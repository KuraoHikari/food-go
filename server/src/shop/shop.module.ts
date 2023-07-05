import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { AtStrategy } from '../auth/strategies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ShopController],
  providers: [ShopService, AtStrategy],
})
export class ShopModule {}
