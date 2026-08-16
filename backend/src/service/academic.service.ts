import axios from 'axios';
import { logger } from '../utils/logger';

export interface AcademicPaperResult {
  title: string;
  abstract: string;
  authors: Array<{ name: string }>;
  publication_year?: number;
  venue?: string;
  doi?: string;
  arxiv_id?: string;
  url?: string;
  source: 'arxiv' | 'crossref' | 'openalex' | 'semanticscholar';
}

export class AcademicService {
  /**
   * Search arXiv via the official arXiv API (Atom XML)
   */
  async searchArxiv(query: string, maxResults = 10): Promise<AcademicPaperResult[]> {
    try {
      const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
        query
      )}&start=0&max_results=${maxResults}&sortBy=relevance&sortOrder=descending`;
      
      const response = await axios.get(url, { timeout: 10000 });
      const xml = response.data as string;

      // Extract entries using regex to avoid heavy XML parser dependencies
      const entries: AcademicPaperResult[] = [];
      const entryMatches = xml.split('<entry>');

      for (let i = 1; i < entryMatches.length; i++) {
        const chunk = entryMatches[i];
        
        const titleMatch = chunk.match(/<title>([\s\S]*?)<\/title>/);
        const summaryMatch = chunk.match(/<summary>([\s\S]*?)<\/summary>/);
        const idMatch = chunk.match(/<id>([\s\S]*?)<\/id>/);
        const publishedMatch = chunk.match(/<published>([\s\S]*?)<\/published>/);
        const doiMatch = chunk.match(/<arxiv:doi[\s\S]*?>([\s\S]*?)<\/arxiv:doi>/);

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
        const pubYear = publishedMatch ? new Date(publishedMatch[1].trim()).getFullYear() : undefined;
        const doi = doiMatch ? doiMatch[1].trim() : undefined;

        entries.push({
          title,
          abstract,
          authors: authors.length > 0 ? authors : [{ name: 'Unknown Author' }],
          publication_year: pubYear,
          venue: 'arXiv Preprint',
          arxiv_id: arxivId,
          doi,
          url: arxivUrl,
          source: 'arxiv',
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
      const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=${rows}`;
      const response = await axios.get(url, {
        timeout: 10000,
        headers: { 'User-Agent': 'ResearchOS/1.0 (mailto:admin@research-os.dev)' },
      });

      const items = response.data?.message?.items || [];
      return items.map((item: any) => ({
        title: Array.isArray(item.title) ? item.title[0] : (item.title || 'Untitled'),
        abstract: item.abstract ? item.abstract.replace(/<[^>]+>/g, '').trim() : '',
        authors: Array.isArray(item.author)
          ? item.author.map((a: any) => ({ name: `${a.given || ''} ${a.family || ''}`.trim() }))
          : [{ name: 'Unknown Author' }],
        publication_year: item.issued?.['date-parts']?.[0]?.[0] || item.created?.['date-parts']?.[0]?.[0],
        venue: Array.isArray(item['container-title']) ? item['container-title'][0] : item['container-title'],
        doi: item.DOI,
        url: item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : undefined),
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
      const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=${perPage}`;
      const response = await axios.get(url, { timeout: 10000 });
      const results = response.data?.results || [];

      return results.map((work: any) => ({
        title: work.display_name || work.title || 'Untitled',
        abstract: work.abstract || '',
        authors: Array.isArray(work.authorships)
          ? work.authorships.map((auth: any) => ({ name: auth.author?.display_name || 'Author' }))
          : [{ name: 'Unknown Author' }],
        publication_year: work.publication_year,
        venue: work.primary_location?.source?.display_name || 'Academic Venue',
        doi: work.doi ? work.doi.replace('https://doi.org/', '') : undefined,
        url: work.doi || work.id,
        source: 'openalex',
      }));
    } catch (error: any) {
      logger.warn(`OpenAlex API error: ${error.message}`);
      return [];
    }
  }

  /**
   * Search Semantic Scholar Graph API
   */
  async searchSemanticScholar(query: string, limit = 10): Promise<AcademicPaperResult[]> {
    try {
      const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
        query
      )}&limit=${limit}&fields=title,abstract,authors,year,venue,externalIds,url,citationCount`;
      
      const response = await axios.get(url, { timeout: 10000 });
      const data = response.data?.data || [];

      return data.map((item: any) => ({
        title: item.title || 'Untitled',
        abstract: item.abstract || '',
        authors: Array.isArray(item.authors)
          ? item.authors.map((a: any) => ({ name: a.name }))
          : [{ name: 'Unknown Author' }],
        publication_year: item.year,
        venue: item.venue || 'Semantic Scholar Index',
        doi: item.externalIds?.DOI,
        arxiv_id: item.externalIds?.ArXiv,
        url: item.url,
        source: 'semanticscholar',
      }));
    } catch (error: any) {
      logger.warn(`Semantic Scholar API error: ${error.message}`);
      return [];
    }
  }

  /**
   * Unified multi-source scholarly literature search
   */
  async searchAll(query: string, limit = 10): Promise<AcademicPaperResult[]> {
    const [arxiv, crossref, openalex] = await Promise.all([
      this.searchArxiv(query, Math.ceil(limit / 2)),
      this.searchCrossref(query, Math.ceil(limit / 2)),
      this.searchOpenAlex(query, Math.ceil(limit / 2)),
    ]);

    const combined = [...arxiv, ...crossref, ...openalex];
    // Deduplicate by title similarity
    const seen = new Set<string>();
    return combined.filter((p) => {
      const normalized = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    }).slice(0, limit);
  }
}
