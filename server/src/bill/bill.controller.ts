import { Controller } from '@nestjs/common';
import { BillService } from './bill.service';
import { GetCurrentUserId } from '../common/decorators';

@Controller('bill')
export class BillController {
  constructor(private billService: BillService) {}
  createBill(@GetCurrentUserId() userId: number) {
    return this.billService.createBill(userId);
  }
}
