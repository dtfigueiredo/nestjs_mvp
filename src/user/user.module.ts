import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PrismaUsersRepository } from './repositories/prisma/prisma-users-repository';
import { UsersRepository } from './repositories/users-repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    UserService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
})
export class UserModule {}
