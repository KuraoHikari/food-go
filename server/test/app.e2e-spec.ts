import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import * as chai from 'chai';
import { CreateShopDto, EditShopDto } from 'src/shop/dto';

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
    pactum.handler.addExpectHandler('shop', (ctx) => {
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
      it('should throw if email isDuplicate', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody(dto)
          .expect('auth', 'message')
          .expectStatus(403);
      });
      it('should throw if is not email', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody({
            email: 'test',
            password: 'secret',
          })
          .expect('auth', 'message')
          .expectStatus(400);
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
  describe('Shop', () => {
    const userDto: AuthDto = {
      email: 'vlad@gmail.com',
      password: '123',
    };
    const userDto2: AuthDto = {
      email: 'vlad2@gmail.com',
      password: '123',
    };
    it('should signin', () => {
      return pactum
        .spec()
        .post('/auth/local/signin')
        .withBody(userDto)
        .expectStatus(200)
        .expect('auth', 'access_token')
        .expect('auth', 'refresh_token')
        .stores('userAt', 'access_token')
        .stores('userRt', 'refresh_token');
    });
    it('should signup', () => {
      return pactum
        .spec()
        .post('/auth/local/signup')
        .withBody(userDto2)
        .expectStatus(201)
        .expect('auth', 'access_token')
        .expect('auth', 'refresh_token')
        .stores('userAt2', 'access_token')
        .stores('userRt2', 'refresh_token');
    });
    describe('Get empty shops', () => {
      it('should get empty shops', () => {
        return pactum
          .spec()
          .get('/shop')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
      it('should throw if no Token', () => {
        return pactum
          .spec()
          .post('/shop')
          .expectJson({
            message: 'Unauthorized',
            statusCode: 401,
          })
          .expectStatus(401);
      });
      it('should throw if Invalid Token', () => {
        return pactum
          .spec()
          .post('/shop')
          .withHeaders({
            Authorization: 'Bearer $S{userRt}',
          })
          .expectJson({
            message: 'Unauthorized',
            statusCode: 401,
          })
          .expectStatus(401);
      });
    });
    describe('Create Shop', () => {
      const shopDto: CreateShopDto = {
        name: 'kue bali',
        location: 'di bali',
        desc: 'ini toko kue',
      };

      it('should create shop', () => {
        return pactum
          .spec()
          .post('/shop')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(shopDto)
          .expectStatus(201)
          .stores('shopId', 'id');
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/shop')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expect('shop', 'message')
          .expectStatus(400);
      });
      it('should throw if shop name isDuplicate', () => {
        return pactum
          .spec()
          .post('/shop')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(shopDto)
          .expectStatus(403)
          .expect('shop', 'message');
      });
      it('should throw if name empty string', () => {
        return pactum
          .spec()
          .post('/shop')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            name: '',
            location: 'test',
            desc: 'test',
          })
          .expectStatus(400)
          .expect('shop', 'message');
      });
    });
    describe('Get shop', () => {
      it('should get shop', () => {
        return pactum
          .spec()
          .get('/shop')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get shop by id', () => {
      it('should get shop by id', () => {
        return pactum
          .spec()
          .get('/shop/{id}')
          .withPathParams('id', '$S{shopId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{shopId}');
      });
      it('should throw if shop was not exit', () => {
        return pactum
          .spec()
          .get('/shop/{id}')
          .withPathParams('id', '$S{shopId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt2}',
          })
          .expectStatus(403);
      });
    });
    describe('Edit Shop', () => {
      const shopDto: EditShopDto = {
        name: 'kue bali',
        location: 'di kuta',
        desc: 'ini toko kue kuta',
      };
      it('should edit shop', () => {
        return pactum
          .spec()
          .patch('/shop/{id}')
          .withPathParams('id', '$S{shopId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(shopDto)
          .expectStatus(200)
          .expectBodyContains(shopDto.name)
          .expectBodyContains(shopDto.desc);
      });
      it('should throw if shop was not exit', () => {
        return pactum
          .spec()
          .patch('/shop/2')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(shopDto)
          .expectStatus(403);
      });
    });
    describe('Delete Shop', () => {
      it('should delete shop', () => {
        return pactum
          .spec()
          .delete('/shop/{id}')
          .withPathParams('id', '$S{shopId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });
      it('should throw if shop was not exit', () => {
        return pactum
          .spec()
          .delete('/shop/{id}')
          .withPathParams('id', '$S{shopId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(403);
      });
      it('should get empty shops', () => {
        return pactum
          .spec()
          .get('/shop')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
