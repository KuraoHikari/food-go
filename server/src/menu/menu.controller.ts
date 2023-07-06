import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { GetCurrentUserId } from '../common/decorators';
import { CreateMenuDto, EditMenuDto } from './dto';
import { Menu } from './types';

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}
  @Get(':shopId')
  getMenus(
    @GetCurrentUserId() userId: number,
    @Param('shopId', ParseIntPipe) shopId: number,
  ): Promise<Menu[]> {
    return this.menuService.getMenus(userId, shopId);
  }

  @Get(':menuId')
  getMenuById(
    @GetCurrentUserId() userId: number,

    @Param('menuId', ParseIntPipe) menuId: number,
  ): Promise<Menu> {
    return this.menuService.getMenuById(userId, menuId);
  }

  @Post(':shopId')
  createMenu(
    @GetCurrentUserId() userId: number,
    @Param('shopId', ParseIntPipe) shopId: number,
    @Body() dto: CreateMenuDto,
  ): Promise<Menu> {
    return this.menuService.createMenu(userId, shopId, dto);
  }

  @Patch(':menuId')
  editMenu(
    @GetCurrentUserId() userId: number,
    @Param('menuId', ParseIntPipe) menuId: number,
    @Body() dto: EditMenuDto,
  ): Promise<Menu> {
    return this.menuService.editMenu(userId, menuId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':menuId')
  deleteMenu(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) menuId: number,
  ): Promise<boolean> {
    return this.menuService.deleteMenu(userId, menuId);
  }
}
