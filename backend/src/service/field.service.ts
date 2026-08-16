import { AppDataSource } from '../database';
import { ResearchField } from '../entity/ResearchField';
import { ResearchSubfield } from '../entity/ResearchSubfield';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export class FieldService {
  private fieldRepo = AppDataSource.getRepository(ResearchField);
  private subfieldRepo = AppDataSource.getRepository(ResearchSubfield);

  async getAll() {
    const fields = await this.fieldRepo.find({ where: { is_deleted: false }, order: { name: 'ASC' } });
    const subfields = await this.subfieldRepo.find({ where: { is_deleted: false }, order: { name: 'ASC' } });

    return fields.map(field => ({
      ...field,
      subfields: subfields.filter(s => s.field_id === field.id),
    }));
  }

  async getById(id: string) {
    const field = await this.fieldRepo.findOne({ where: { id, is_deleted: false } });
    if (!field) throw { status: 404, code: 'FIELD_NOT_FOUND', message: 'Field not found' };
    const subfields = await this.subfieldRepo.find({ where: { field_id: id, is_deleted: false } });
    return { ...field, subfields };
  }

  async create(data: { name: string; description?: string; color?: string; icon?: string; metadata?: any }, userId: string) {
    const slug = slugify(data.name);
    const existing = await this.fieldRepo.findOne({ where: { slug, is_deleted: false } });
    if (existing) throw { status: 400, code: 'FIELD_EXISTS', message: 'Research field with this name already exists' };

    const field = this.fieldRepo.create({
      ...data,
      slug,
      created_by: userId,
    });
    return this.fieldRepo.save(field);
  }

  async update(id: string, data: Partial<ResearchField>) {
    const field = await this.getById(id);
    if (data.name) {
      data.slug = slugify(data.name);
    }
    Object.assign(field, data);
    return this.fieldRepo.save(field);
  }

  async delete(id: string) {
    const field = await this.getById(id);
    field.is_deleted = true;
    await this.fieldRepo.save(field);
    return { success: true };
  }

  async addSubfield(fieldId: string, data: { name: string; description?: string; metadata?: any }, userId: string) {
    await this.getById(fieldId);
    const slug = slugify(data.name);
    const subfield = this.subfieldRepo.create({
      ...data,
      slug,
      field_id: fieldId,
      created_by: userId,
    });
    return this.subfieldRepo.save(subfield);
  }
}
