import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from 'src/auth/strategies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [BillController],
  providers: [BillService, AtStrategy],
})
export class BillModule {}
