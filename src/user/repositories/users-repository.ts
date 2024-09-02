import { User } from '@prisma/client';

export interface UsersRepository {
  findUsers(): Promise<User[]>;

  findUserById(id: string): Promise<User | null>;

  findUserByEmail(email: string): Promise<User | null>;

  create(name: string, email: string): Promise<User>;

  update(id: string, name: string, email: string): Promise<User>;

  delete(id: string): Promise<void>;
}

export const UsersRepository = Symbol('UsersRepository');
