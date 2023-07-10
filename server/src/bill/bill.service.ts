import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillService {
  constructor(private prisma: PrismaService) {}
  async createBill(userId: number) {
    return await this.prisma.$transaction(async (tx) => {
      const dto = {
        shopId: 7,
        note: '',
        orderMenu: [
          {
            menuId: 3,
            menuName: 'nas gor 3',
            amount: 2,
          },
          {
            menuId: 1,
            menuName: 'nas gor',
            amount: 4,
          },
        ],
      };

      const bill = await this.prisma.bill.create({
        data: {
          hasReviewed: false,
          note: dto.note,
          shopId: dto.shopId,
          userId: userId,
        },
      });

      const orders = [];

      for await (const menu of dto.orderMenu) {
        const findMenu = await this.prisma.menu.findUnique({
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

      const createOrders = await this.prisma.order.createMany({
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
}
