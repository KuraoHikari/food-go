import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MenuController } from './menu.controller';
import { AtStrategy } from '../auth/strategies';
import { MenuService } from './menu.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [MenuController],
  providers: [MenuService, AtStrategy],
})
export class MenuModule {}
