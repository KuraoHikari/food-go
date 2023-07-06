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
import { GetCurrentUserId } from '../common/decorators';
import { ShopService } from './shop.service';
import { Shop } from './types';
import { CreateShopDto, EditShopDto } from './dto';

@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}
  @Get()
  getShops(@GetCurrentUserId() userId: number): Promise<Shop[]> {
    return this.shopService.getShops(userId);
  }

  @Get(':id')
  getShopById(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) shopId: number,
  ): Promise<Shop> {
    return this.shopService.getShopById(userId, shopId);
  }

  @Post()
  createShop(
    @GetCurrentUserId() userId: number,
    @Body() dto: CreateShopDto,
  ): Promise<Shop> {
    return this.shopService.createShop(userId, dto);
  }

  @Patch(':id')
  editShop(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) shopId: number,
    @Body() dto: EditShopDto,
  ): Promise<Shop> {
    return this.shopService.editShop(userId, shopId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteShop(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) shopId: number,
  ): Promise<boolean> {
    return this.shopService.deleteShop(userId, shopId);
  }
}
