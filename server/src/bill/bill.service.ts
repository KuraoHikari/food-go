import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillDto } from './dto/createBill.dto';
import { Bill } from './types';
import { Shop } from 'src/shop/types';

import { PaginateFunction, PaginatedResult, paginator } from '../lib/paginator';
import { Prisma } from '@prisma/client';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class BillService {
  constructor(private prisma: PrismaService) {}
  getBills(userId: number): Promise<Bill[]> {
    return this.prisma.bill.findMany({
      where: {
        userId: userId,
      },
      include: {
        orders: true,
        shop: true,
      },
    });
  }

  async createBill(userId: number, dto: CreateBillDto): Promise<Bill> {
    return await this.prisma.$transaction(async (tx) => {
      const shop = await tx.shop.findUnique({
        where: {
          id: dto.shopId,
        },
      });

      if (!shop) {
        throw new BadRequestException('Shop not found');
      }

      const bill = await tx.bill.create({
        data: {
          hasReviewed: false,
          note: dto.note,
          shopId: dto.shopId,
          userId: userId,
        },
      });

      const orders = [];

      for await (const menu of dto.orderMenu) {
        const findMenu = await tx.menu.findUnique({
          where: {
            id: menu.menuId,
          },
        });

        if (
          !findMenu ||
          menu.menuName !== findMenu.name ||
          dto.shopId !== findMenu.shopId
        ) {
          throw new BadRequestException('Menu is Invalid');
        }

        orders.push({
          menuName: menu.menuName,
          amount: menu.amount,
          price: findMenu.price,
          menuId: menu.menuId,
          billId: bill.id,
        });
      }

      const createOrders = await tx.order.createMany({
        data: orders,
        skipDuplicates: true,
      });

      if (createOrders.count !== dto.orderMenu.length) {
        throw new BadRequestException('Menu is Invalid');
      }

      return {
        ...bill,
        orders,
      };
    });
  }

  async deleteBill(userId: number, billId: number): Promise<Boolean> {
    const bill = await this.prisma.bill.findUnique({
      where: {
        id: billId,
      },
    });

    if (!bill || bill.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    await this.prisma.bill.delete({
      where: {
        id: billId,
      },
    });

    return true;
  }

  async findMany({
    where,
    orderBy,
    page,
  }: {
    where?: Prisma.BillWhereInput;
    orderBy?: Prisma.BillOrderByWithRelationInput;
    page?: number;
  }): Promise<PaginatedResult<Bill>> {
    return paginate(
      this.prisma.bill,
      {
        where,
        orderBy,
      },
      {
        page,
      },
    );
  }
}
