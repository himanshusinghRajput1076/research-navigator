import { AppDataSource } from '../database';
import { Note } from '../entity/Note';

export class NoteService {
  private noteRepo = AppDataSource.getRepository(Note);

  async getAll(userId: string, page = 1, limit = 20, noteType?: string) {
    const query = this.noteRepo.createQueryBuilder('n')
      .where('n.user_id = :userId', { userId })
      .andWhere('n.is_deleted = false');

    if (noteType) query.andWhere('n.note_type = :noteType', { noteType });

    const total = await query.getCount();
    const data = await query
      .orderBy('n.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async getById(id: string, userId: string) {
    const note = await this.noteRepo.findOne({ where: { id, user_id: userId, is_deleted: false } });
    if (!note) throw { status: 404, code: 'NOTE_NOT_FOUND', message: 'Note not found' };
    return note;
  }

  async create(data: Partial<Note>, userId: string) {
    const note = this.noteRepo.create({ ...data, user_id: userId });
    return this.noteRepo.save(note);
  }

  async update(id: string, data: Partial<Note>, userId: string) {
    const note = await this.getById(id, userId);
    Object.assign(note, data);
    return this.noteRepo.save(note);
  }

  async delete(id: string, userId: string) {
    const note = await this.getById(id, userId);
    note.is_deleted = true;
    await this.noteRepo.save(note);
    return { success: true };
  }
}
