import { User } from '../entities/user';
import { UserId } from '../value-objects/user-id';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(userId: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(userId: UserId): Promise<void>;
}

export const IUserRepository = Symbol('IUserRepository');
