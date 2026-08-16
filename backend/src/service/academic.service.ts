import axios from 'axios';
import { logger } from '../utils/logger';
import { AiService } from './ai.service';
import { AppDataSource } from '../database';
import { Paper } from '../entity/Paper';
import { ResearchProblem } from '../entity/ResearchProblem';
import { ResearchGap } from '../entity/ResearchGap';

export interface AcademicPaperResult {
  title: string;
  abstract: string;
  authors: Array<{ name: string }>;
  publication_year?: number;
  venue?: string;
  doi?: string;
  arxiv_id?: string;
  url?: string;
  pdf_url?: string;
  citation_count?: number;
  source: 'arxiv' | 'crossref' | 'openalex' | 'semanticscholar' | 'pubmed' | 'web';
  domain?: string;
}

export class AcademicService {
  private aiService = new AiService();

  /**
   * Search arXiv via the official arXiv API (Atom XML)
   */
  async searchArxiv(query: string, maxResults = 10, domain?: string): Promise<AcademicPaperResult[]> {
    try {
      let searchQuery = query;
      if (domain && domain !== 'all') {
        searchQuery = `${query} AND cat:${domain}`;
      }

      const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
        searchQuery
      )}&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;
      
      const response = await axios.get(url, { timeout: 12000 });
      const xml = response.data as string;

      const entries: AcademicPaperResult[] = [];
      const entryMatches = xml.split('<entry>');

      for (let i = 1; i < entryMatches.length; i++) {
        const chunk = entryMatches[i];
        
        const titleMatch = chunk.match(/<title>([\s\S]*?)<\/title>/);
        const summaryMatch = chunk.match(/<summary>([\s\S]*?)<\/summary>/);
        const idMatch = chunk.match(/<id>([\s\S]*?)<\/id>/);
        const publishedMatch = chunk.match(/<published>([\s\S]*?)<\/published>/);
        const doiMatch = chunk.match(/<arxiv:doi[\s\S]*?>([\s\S]*?)<\/arxiv:doi>/);
        const pdfMatch = chunk.match(/<link title="pdf" href="([\s\S]*?)"/);

        const authors: Array<{ name: string }> = [];
        const authorRegex = /<author>\s*<name>([\s\S]*?)<\/name>/g;
        let authMatch;
        while ((authMatch = authorRegex.exec(chunk)) !== null) {
          authors.push({ name: authMatch[1].trim() });
        }

        const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : 'Untitled Paper';
        const abstract = summaryMatch ? summaryMatch[1].replace(/\s+/g, ' ').trim() : '';
        const arxivUrl = idMatch ? idMatch[1].trim() : '';
        const arxivId = arxivUrl.split('/abs/').pop() || '';
        const pubYear = publishedMatch ? new Date(publishedMatch[1].trim()).getFullYear() : new Date().getFullYear();
        const doi = doiMatch ? doiMatch[1].trim() : undefined;
        const pdf_url = pdfMatch ? pdfMatch[1].trim() : (arxivId ? `https://arxiv.org/pdf/${arxivId}.pdf` : undefined);

        entries.push({
          title,
          abstract,
          authors: authors.length > 0 ? authors : [{ name: 'Unknown Author' }],
          publication_year: pubYear,
          venue: 'arXiv Preprint',
          arxiv_id: arxivId,
          doi,
          url: arxivUrl,
          pdf_url,
          source: 'arxiv',
          domain: domain || 'Computer Science / Emerging',
        });
      }

      return entries;
    } catch (error: any) {
      logger.warn(`arXiv API error: ${error.message}`);
      return [];
    }
  }

  /**
   * Search Crossref Works API
   */
  async searchCrossref(query: string, rows = 10): Promise<AcademicPaperResult[]> {
    try {
      const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=${rows}&sort=relevance`;
      const response = await axios.get(url, {
        timeout: 10000,
        headers: { 'User-Agent': 'ResearchOS/1.0 (mailto:admin@research-os.dev)' },
      });

      const items = response.data?.message?.items || [];
      return items.map((item: any) => ({
        title: Array.isArray(item.title) ? item.title[0] : (item.title || 'Untitled Paper'),
        abstract: item.abstract ? item.abstract.replace(/<[^>]+>/g, '').trim() : 'Abstract indexed in Crossref database.',
        authors: Array.isArray(item.author)
          ? item.author.map((a: any) => ({ name: `${a.given || ''} ${a.family || ''}`.trim() }))
          : [{ name: 'Unknown Author' }],
        publication_year: item.issued?.['date-parts']?.[0]?.[0] || item.created?.['date-parts']?.[0]?.[0] || 2024,
        venue: Array.isArray(item['container-title']) ? item['container-title'][0] : (item['container-title'] || 'Peer-Reviewed Journal'),
        doi: item.DOI,
        url: item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : undefined),
        pdf_url: item.link?.[0]?.URL || undefined,
        citation_count: item['is-referenced-by-count'] || 0,
        source: 'crossref',
      }));
    } catch (error: any) {
      logger.warn(`Crossref API error: ${error.message}`);
      return [];
    }
  }

  /**
   * Search OpenAlex API (250M+ scholarly works)
   */
  async searchOpenAlex(query: string, perPage = 10): Promise<AcademicPaperResult[]> {
    try {
      const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=${perPage}&sort=relevance_score:desc`;
      const response = await axios.get(url, { timeout: 10000 });
      const results = response.data?.results || [];

      return results.map((work: any) => {
        // Reconstruct inverted abstract if provided
        let abstractText = work.abstract || '';
        if (!abstractText && work.abstract_inverted_index) {
          const words: string[] = [];
          Object.entries(work.abstract_inverted_index).forEach(([word, positions]: [string, any]) => {
            positions.forEach((pos: number) => {
              words[pos] = word;
            });
          });
          abstractText = words.filter(Boolean).join(' ');
        }

        return {
          title: work.display_name || work.title || 'Untitled Work',
          abstract: abstractText || 'Scholarly work indexed in OpenAlex open repository.',
          authors: Array.isArray(work.authorships)
            ? work.authorships.map((auth: any) => ({ name: auth.author?.display_name || 'Author' }))
            : [{ name: 'Unknown Author' }],
          publication_year: work.publication_year || 2024,
          venue: work.primary_location?.source?.display_name || 'Academic Conference / Journal',
          doi: work.doi ? work.doi.replace('https://doi.org/', '') : undefined,
          url: work.doi || work.id,
          pdf_url: work.open_access?.oa_url || work.primary_location?.pdf_url || undefined,
          citation_count: work.cited_by_count || 0,
          source: 'openalex',
        };
      });
    } catch (error: any) {
      logger.warn(`OpenAlex API error: ${error.message}`);
      return [];
    }
  }

  /**
   * Unified multi-source real-time scientific web search
   */
  async searchAll(query: string, limit = 15, domain?: string): Promise<AcademicPaperResult[]> {
    const [arxiv, crossref, openalex] = await Promise.all([
      this.searchArxiv(query, Math.ceil(limit / 2), domain),
      this.searchCrossref(query, Math.ceil(limit / 2)),
      this.searchOpenAlex(query, Math.ceil(limit / 2)),
    ]);

    const combined = [...arxiv, ...crossref, ...openalex];
    // Deduplicate by normalized title
    const seen = new Set<string>();
    return combined.filter((p) => {
      const normalized = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    }).slice(0, limit);
  }

  /**
   * Inspect any Academic URL, DOI, or arXiv link and scrape live metadata
   */
  async inspectPaperUrl(urlOrDoi: string): Promise<AcademicPaperResult> {
    const cleanInput = urlOrDoi.trim();

    // Check if it is an arXiv URL or ID
    const arxivMatch = cleanInput.match(/(?:arxiv\.org\/(?:abs|pdf)\/|arXiv:)?([0-9]{4}\.[0-9]{4,5}(?:v[0-9]+)?|[a-z\-]+(?:\.[A-Z]{2})?\/[0-9]{7})/i);
    if (arxivMatch) {
      const arxivId = arxivMatch[1];
      const results = await this.searchArxiv(`id:${arxivId}`, 1);
      if (results.length > 0) return results[0];
    }

    // Check if it is a DOI
    const doiMatch = cleanInput.match(/10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/);
    if (doiMatch) {
      const doi = doiMatch[0];
      try {
        const response = await axios.get(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
          timeout: 8000,
          headers: { 'User-Agent': 'ResearchOS/1.0 (mailto:admin@research-os.dev)' },
        });
        const item = response.data?.message;
        if (item) {
          return {
            title: Array.isArray(item.title) ? item.title[0] : (item.title || 'Untitled Paper'),
            abstract: item.abstract ? item.abstract.replace(/<[^>]+>/g, '').trim() : 'Abstract retrieved from DOI registry.',
            authors: Array.isArray(item.author)
              ? item.author.map((a: any) => ({ name: `${a.given || ''} ${a.family || ''}`.trim() }))
              : [{ name: 'Author' }],
            publication_year: item.issued?.['date-parts']?.[0]?.[0] || 2024,
            venue: Array.isArray(item['container-title']) ? item['container-title'][0] : item['container-title'],
            doi: item.DOI,
            url: item.URL || `https://doi.org/${item.DOI}`,
            source: 'crossref',
          };
        }
      } catch (e) {
        logger.warn(`DOI direct resolve failed: ${e}`);
      }
    }

    // Fallback: search OpenAlex by URL or title
    const searchRes = await this.searchAll(cleanInput, 1);
    if (searchRes.length > 0) {
      return searchRes[0];
    }

    // Fallback constructed representation
    return {
      title: `Academic Research Document: ${cleanInput.slice(0, 60)}`,
      abstract: `Paper ingested from URL / Source: ${cleanInput}`,
      authors: [{ name: 'Academic Researcher' }],
      publication_year: new Date().getFullYear(),
      url: cleanInput.startsWith('http') ? cleanInput : `https://${cleanInput}`,
      source: 'web',
    };
  }

  /**
   * Ingest paper and automatically trigger AI problem and gap discovery
   */
  async ingestAndExtract(paperData: AcademicPaperResult, userId: string) {
    const paperRepo = AppDataSource.getRepository(Paper);
    const problemRepo = AppDataSource.getRepository(ResearchProblem);
    const gapRepo = AppDataSource.getRepository(ResearchGap);

    // 1. Save Paper
    const paper = paperRepo.create({
      user_id: userId,
      title: paperData.title,
      abstract: paperData.abstract,
      authors: paperData.authors || [{ name: 'Author' }],
      publication_year: paperData.publication_year || 2024,
      venue: paperData.venue || 'Academic Web Explorer',
      doi: paperData.doi,
      arxiv_id: paperData.arxiv_id,
      url: paperData.url,
      field_id: '00000000-0000-0000-0000-000000000000',
      added_from_source: paperData.source || 'web_explorer',
      reading_status: 'UNREAD',
    });
    const savedPaper = await paperRepo.save(paper);

    // 2. Automatically extract AI gaps and formulate problems if abstract is present
    let extractedGaps: any[] = [];
    if (paperData.abstract && paperData.abstract.length > 50) {
      try {
        const gapAnalysis = await this.aiService.identifyGaps({
          title: paperData.title,
          description: paperData.abstract,
        });

        if (gapAnalysis?.potentialGaps) {
          for (const g of gapAnalysis.potentialGaps) {
            const gapEntity = gapRepo.create({
              user_id: userId,
              field_id: '00000000-0000-0000-0000-000000000000',
              title: g.title,
              gap_statement: g.rationale || 'Unaddressed limitation extracted from paper analysis.',
              confidence_score: g.confidence || 8,
              novelty_estimate: g.novelty || 8,
              impact_estimate: g.impact || 8,
              gap_status: 'POTENTIAL',
            });
            const savedGap = await gapRepo.save(gapEntity);
            extractedGaps.push(savedGap);
          }
        }
      } catch (err: any) {
        logger.warn(`Automated gap extraction skipped: ${err.message}`);
      }
    }

    return {
      paper: savedPaper,
      extractedGaps,
      message: `Paper "${savedPaper.title}" imported successfully with ${extractedGaps.length} automated research gaps registered!`,
    };
  }
}
