import { AppDataSource } from '../database';
import { User } from '../entity/User';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  async register(data: {
    email: string;
    password: string;
    full_name: string;
    institution?: string;
    country?: string;
    orcid_id?: string;
  }) {
    const existing = await this.userRepo.findOne({ where: { email: data.email, is_deleted: false } });
    if (existing) {
      throw { status: 400, code: 'USER_EXISTS', message: 'User with this email already exists' };
    }

    const password_hash = await hashPassword(data.password);
    const user = this.userRepo.create({
      email: data.email,
      password_hash,
      full_name: data.full_name,
      institution: data.institution,
      country: data.country,
      orcid_id: data.orcid_id,
      role: 'RESEARCHER',
    });

    await this.userRepo.save(user);
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const { password_hash: _, ...userProfile } = user;
    return { user: userProfile, token };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email, is_deleted: false } });
    if (!user) {
      throw { status: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      throw { status: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }

    user.last_login = new Date();
    await this.userRepo.save(user);

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const { password_hash: _, ...userProfile } = user;
    return { user: userProfile, token };
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId, is_deleted: false } });
    if (!user) {
      throw { status: 404, code: 'USER_NOT_FOUND', message: 'User not found' };
    }
    const { password_hash: _, ...userProfile } = user;
    return userProfile;
  }

  async updateProfile(userId: string, data: Partial<User>) {
    const user = await this.userRepo.findOne({ where: { id: userId, is_deleted: false } });
    if (!user) {
      throw { status: 404, code: 'USER_NOT_FOUND', message: 'User not found' };
    }

    delete (data as any).password_hash;
    delete (data as any).id;
    delete (data as any).email;

    Object.assign(user, data);
    await this.userRepo.save(user);

    const { password_hash: _, ...userProfile } = user;
    return userProfile;
  }
}
