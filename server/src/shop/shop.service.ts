import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Shop } from './types';
import { CreateShopDto, EditShopDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}
  async getShops(userId: number): Promise<Shop[]> {
    const shops = await this.prisma.shop.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        createdAt: true,
        name: true,
        desc: true,
        location: true,
        userId: true,
      },
    });

    return shops;
  }

  getShopById(userId: number, shopId: number): Promise<Shop> {
    return this.prisma.shop.findFirst({
      where: {
        id: shopId,
        userId,
      },
    });
  }

  async createShop(userId: number, dto: CreateShopDto): Promise<Shop> {
    const shop = await this.prisma.shop
      .create({
        data: {
          userId,
          ...dto,
        },
      })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw error;
      });

    delete shop.updatedAt;

    return shop;
  }

  async editShop(
    userId: number,
    shopId: number,
    dto: EditShopDto,
  ): Promise<Shop> {
    const shop = await this.prisma.shop.findUnique({
      where: {
        id: shopId,
      },
    });

    if (!shop || shop.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    const updateShop = this.prisma.shop
      .update({
        where: {
          id: shopId,
        },
        data: {
          ...dto,
        },
      })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw error;
      });

    return updateShop;
  }

  async deleteShop(userId: number, shopId: number): Promise<boolean> {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop || shop.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    await this.prisma.shop.delete({
      where: {
        id: shopId,
      },
    });

    return true;
  }
}
