import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Shop } from './types';
import { CreateShopDto, EditShopDto } from './dto';
import { Prisma } from '@prisma/client';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class ShopService {
  constructor(
    private prisma: PrismaService,
    private utilsService: UtilsService,
  ) {}
  async getShops(userId: number): Promise<Shop[]> {
    const shops = await this.prisma.shop.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: { menus: true },
        },
      },
    });

    return shops;
  }

  async getShopById(userId: number, shopId: number): Promise<Shop> {
    const shop = await this.prisma.shop.findUnique({
      where: {
        id: shopId,
      },
      include: {
        _count: {
          select: { menus: true },
        },
      },
    });

    if (!shop || shop.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    return shop;
  }

  async createShop(
    userId: number,
    dto: CreateShopDto,
    logo: Express.Multer.File,
  ): Promise<Shop> {
    const updatedFileName = this.utilsService.generateUpdatedFileName(logo);

    const shop = await this.prisma.shop
      .create({
        data: {
          banner: 'default.jpg',
          logo: updatedFileName,
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

    this.utilsService
      .writeFileToUploadsFolder(updatedFileName, logo.buffer, 'shop/logo')
      .catch(() => {
        throw new InternalServerErrorException(
          'Error saving file to uploads folder',
        );
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

  async editShopImage(
    userId: number,
    shopId: number,
    image: Express.Multer.File,
    type: string,
  ): Promise<Shop> {
    const shop = await this.prisma.shop.findUnique({
      where: {
        id: shopId,
      },
    });

    if (!shop || shop.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }
    const updatedFileName = this.utilsService.generateUpdatedFileName(image);
    const updateShop = this.prisma.shop
      .update({
        where: {
          id: shopId,
        },
        data: {
          [type]: updatedFileName,
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

    this.utilsService
      .writeFileToUploadsFolder(updatedFileName, image.buffer, `shop/${type}`)
      .catch(() => {
        throw new InternalServerErrorException(
          'Error saving file to uploads folder',
        );
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
