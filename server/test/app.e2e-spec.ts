import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { Tokens } from '../src/auth/types';
import * as chai from 'chai';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDatabase();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'vlad@gmail.com',
      password: '123',
    };

    pactum.handler.addExpectHandler('auth', (ctx) => {
      chai.expect(ctx.res.json).to.have.property(ctx.data);
    });

    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody({
            password: dto.password,
          })
          .expect('auth', 'message')
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody({
            email: dto.email,
          })
          .expect('auth', 'message')
          .expectStatus(400);
      });

      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .expect('auth', 'message')
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody(dto)
          .expectStatus(201)
          .expect('auth', 'access_token')
          .expect('auth', 'refresh_token');
      });
    });
    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody({
            password: dto.password,
          })
          .expect('auth', 'message')
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody({
            email: dto.email,
          })
          .expect('auth', 'message')
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/local/signin')
          .expect('auth', 'message')
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/local/signin')
          .withBody(dto)
          .expectStatus(200)
          .expect('auth', 'access_token')
          .expect('auth', 'refresh_token')
          .stores('userAt', 'access_token')
          .stores('userRt', 'refresh_token');
      });
    });

    describe('RefreshToken', () => {
      it('should throw if no Token', () => {
        return pactum
          .spec()
          .post('/auth/refresh')
          .expectJson({
            message: 'Unauthorized',
            statusCode: 401,
          })
          .expectStatus(401);
      });
      it('should throw if Invalid Token', () => {
        return pactum
          .spec()
          .post('/auth/refresh')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectJson({
            message: 'Unauthorized',
            statusCode: 401,
          })
          .expectStatus(401);
      });
      it('should refresh', () => {
        return pactum
          .spec()
          .post('/auth/refresh')
          .withHeaders({
            Authorization: 'Bearer $S{userRt}',
          })
          .expectStatus(200);
      });
    });

    describe('Logout', () => {
      it('should throw if no Token', () => {
        return pactum
          .spec()
          .post('/auth/logout')
          .expectJson({
            message: 'Unauthorized',
            statusCode: 401,
          })
          .expectStatus(401);
      });
      it('should throw if Invalid Token', () => {
        return pactum
          .spec()
          .post('/auth/logout')
          .withHeaders({
            Authorization: 'Bearer $S{userRt}',
          })
          .expectJson({
            message: 'Unauthorized',
            statusCode: 401,
          })
          .expectStatus(401);
      });
      it('should logout', () => {
        return pactum
          .spec()
          .post('/auth/logout')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
  });
});
