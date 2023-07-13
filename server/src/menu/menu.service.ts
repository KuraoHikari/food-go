import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto, EditMenuDto } from './dto';
import { Prisma } from '@prisma/client';
import { Menu } from './types';
import * as fs from 'fs';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class MenuService {
  constructor(
    private prisma: PrismaService,
    private utilsService: UtilsService,
  ) {}
  async getMenus(userId: number, shopId: number): Promise<Menu[]> {
    const menus = await this.prisma.menu.findMany({
      where: {
        userId,
        shopId,
      },
    });

    return menus;
  }

  async getMenuById(userId: number, menuId: number): Promise<Menu> {
    const menu = await this.prisma.menu.findUnique({
      where: {
        id: menuId,
      },
    });

    if (!menu || menu.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }
    return menu;
  }

  async createMenu(
    userId: number,
    shopId: number,
    dto: CreateMenuDto,
    file: Express.Multer.File,
  ): Promise<Menu> {
    const updatedFileName = this.utilsService.generateUpdatedFileName(file);

    const menu = await this.prisma.menu
      .create({
        data: {
          userId,
          shopId,
          image: updatedFileName,
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
      .writeFileToUploadsFolder(updatedFileName, file.buffer, 'menu')
      .catch(() => {
        throw new InternalServerErrorException(
          'Error saving file to uploads folder',
        );
      });

    return menu;
  }

  async editMenu(
    userId: number,
    menuId: number,
    dto: EditMenuDto,
    file: Express.Multer.File,
  ): Promise<Menu> {
    const menu = await this.prisma.menu.findUnique({
      where: {
        id: menuId,
      },
    });

    if (!menu || menu.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    const payload: EditMenuDto & { image: string } = {
      ...dto,
      image: menu.image,
    };

    let updatedFileName: string = '';

    if (file) {
      updatedFileName = this.utilsService.generateUpdatedFileName(file);
      payload.image = updatedFileName;
    }

    const updateMenu = this.prisma.menu.update({
      where: {
        id: menuId,
      },
      data: {
        ...payload,
      },
    });

    if (file) {
      this.utilsService
        .writeFileToUploadsFolder(updatedFileName, file.buffer, 'menu')
        .catch(() => {
          throw new InternalServerErrorException(
            'Error saving file to uploads folder',
          );
        });
    }

    return updateMenu;
  }

  async deleteMenu(userId: number, menuId: number): Promise<boolean> {
    const menu = await this.prisma.menu.findUnique({
      where: {
        id: menuId,
      },
    });

    if (!menu || menu.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    await this.prisma.menu.delete({
      where: {
        id: menuId,
      },
    });

    return true;
  }
}
