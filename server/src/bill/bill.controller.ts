import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BillService } from './bill.service';
import { GetCurrentUserId } from '../common/decorators';
import { CreateBillDto } from './dto/createBill.dto';
import { Bill } from './types';

@Controller('bill')
export class BillController {
  constructor(private billService: BillService) {}

  @Get()
  getBills(@GetCurrentUserId() userId: number): Promise<Bill[]> {
    return this.billService.getBills(userId);
  }

  @Post()
  createBill(
    @GetCurrentUserId() userId: number,
    @Body() dto: CreateBillDto,
  ): Promise<Bill> {
    return this.billService.createBill(userId, dto);
  }

  @Delete(':billId')
  deleteBill(
    @GetCurrentUserId() userId: number,
    @Param('billId', ParseIntPipe) billId: number,
  ): Promise<Boolean> {
    return this.billService.deleteBill(userId, billId);
  }
}
