import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule, PrismaClient],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    await app.init();

    prismaClient = moduleFixture.get(PrismaClient);
  });

  afterEach(async () => {
    // Clear the database after each test to ensure tests do not interfere with each other
    await prismaClient.user.deleteMany({});
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('userCreation', () => {
    it('should create a user', async () => {
      const newUser = { name: 'Test User', email: `${randomUUID()}@test.com` };
      const createdUserResponse = await request(app.getHttpServer())
        .post('/user')
        .send(newUser);

      const response = await request(app.getHttpServer())
        .get(`/user/id/${createdUserResponse.body.id}`)
        .expect(200);
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
    });

    it('should fail if recieve unexpected property', () => {
      const newUser = {
        name: 'Test User',
        email: `${randomUUID()}@test.com`,
        date: '22/08/2024',
      };
      return request(app.getHttpServer())
        .post('/user')
        .send(newUser)
        .expect(400);
    });

    it('should fail to create a user with missing data', () => {
      const newUser = { email: `${randomUUID()}@test.com` };
      return request(app.getHttpServer())
        .post('/user')
        .send(newUser)
        .expect(400);
    });

    it('should return users list', async () => {
      const newUsers = [
        { name: 'User One', email: `${randomUUID()}@test.com` },
        { name: 'User Two', email: `${randomUUID()}@test.com` },
      ];

      await Promise.all(
        newUsers.map((user) =>
          request(app.getHttpServer()).post('/user').send(user),
        ),
      );

      const response = await request(app.getHttpServer())
        .get('/user/userslist')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(newUsers.length);
    });

    it('should fail to update a user passing id property', async () => {
      const newUser = { name: 'Test User', email: `${randomUUID()}@test.com` };
      const createdUserResponse = await request(app.getHttpServer())
        .post('/user')
        .send(newUser);

      await request(app.getHttpServer())
        .put(`/user/${createdUserResponse.body.id}`)
        .send({
          id: randomUUID(),
          ...newUser,
        })
        .expect(400);
    });

    it('should update a user and verify updated values', async () => {
      const initialUser = {
        name: 'Initial Name',
        email: `${randomUUID()}@test.com`,
      };

      const updatedUser = {
        name: 'Updated Name',
        email: `${randomUUID()}@test.com`,
      };

      const createdUserResponse = await request(app.getHttpServer())
        .post('/user')
        .send(initialUser);

      const response = await request(app.getHttpServer())
        .put(`/user/${createdUserResponse.body.id}`)
        .send(updatedUser);

      const updatedUserResponse = await request(app.getHttpServer())
        .get(`/user/id/${createdUserResponse.body.id}`)
        .expect(200);

      expect(updatedUserResponse.body.name).toBe(updatedUser.name);
      expect(updatedUserResponse.body.email).toBe(updatedUser.email);
    });

    it('should fail to create a user with empty name', () => {
      const newUser = { name: '', email: `${randomUUID()}@test.com` };
      return request(app.getHttpServer())
        .post('/user')
        .send(newUser)
        .expect(400);
    });

    it('should retrieve user information by ID', async () => {
      const newUser = { name: 'Test User', email: `${randomUUID()}@test.com` };
      const createdUserResponse = await request(app.getHttpServer())
        .post('/user')
        .send(newUser);

      const response = await request(app.getHttpServer())
        .get(`/user/id/${createdUserResponse.body.id}`)
        .expect(200);

      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
    });
  });
});
