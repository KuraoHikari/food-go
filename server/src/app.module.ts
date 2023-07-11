import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';

import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { ShopService } from './shop/shop.service';
import { ShopModule } from './shop/shop.module';
import { MenuController } from './menu/menu.controller';
import { MenuService } from './menu/menu.service';
import { MenuModule } from './menu/menu.module';
import { BillModule } from './bill/bill.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    ShopModule,
    MenuModule,
    BillModule,
    ReviewModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    ShopService,
    MenuService,
  ],
  controllers: [MenuController],
})
export class AppModule {}
