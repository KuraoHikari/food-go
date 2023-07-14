import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from '../auth/strategies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, AtStrategy],
})
export class UserModule {}
