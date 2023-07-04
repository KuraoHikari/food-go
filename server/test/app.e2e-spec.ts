import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { Tokens } from '../src/auth/types';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: 'super-secret-password',
    };

    let tokens: Tokens;

    describe('Signup', () => {
      it('should throw if email empty', () => {
        return request(app.getHttpServer())
          .post('/auth/local/signup')
          .send({
            password: dto.password,
          })
          .expect(400);
      });

      it('should throw if password empty', () => {
        return request(app.getHttpServer())
          .post('/auth/local/signup')
          .send({
            email: dto.email,
          })
          .expect(400);
      });

      it('should throw if no body provided', () => {
        return request(app.getHttpServer())
          .post('/auth/local/signup')
          .expect(400);
      });

      it('should signup', () => {
        return request(app.getHttpServer())
          .post('/auth/local/signup')
          .send(dto)
          .expect(201)
          .expect(({ body }: { body: Tokens }) => {
            expect(body.access_token).toBeTruthy();
            expect(body.refresh_token).toBeTruthy();
          });
      });
    });
  });
});
