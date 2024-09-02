import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users-repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  find() {
    return this.usersRepository.findUsers();
  }

  findById(id: string) {
    return this.usersRepository.findUserById(id);
  }

  findByEmail(email: string) {
    return this.usersRepository.findUserByEmail(email);
  }

  create(payload: { name: string; email: string }) {
    const { email, name } = payload;
    return this.usersRepository.create(name, email);
  }

  update(id: string, patch: { name: string; email: string }) {
    const { email, name } = patch;
    return this.usersRepository.update(id, name, email);
  }

  delete(id: string) {
    return this.usersRepository.delete(id);
  }
}
