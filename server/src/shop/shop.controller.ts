import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetCurrentUserId, Public } from '../common/decorators';
import { ShopService } from './shop.service';
import { Shop } from './types';
import { CreateShopDto, EditShopDto } from './dto';
import { Observable } from 'rxjs';
import { UtilsService } from '../utils/utils.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomParseFilePipe } from 'src/lib/parse-file.pipe';

@Controller('shop')
export class ShopController {
  constructor(
    private shopService: ShopService,
    private utilsService: UtilsService,
  ) {}
  @Public()
  @Get('pub/shop-banner/:imagename')
  findShopBannerImage(
    @Param('imagename') imagename: string,
    @Res() res: Response,
  ): Observable<void> {
    return this.utilsService.findImage(imagename, 'shop/banner', res);
  }

  @Public()
  @Get('pub/shop-logo/:imagename')
  findShopLogoImage(
    @Param('imagename') imagename: string,
    @Res() res: Response,
  ): Observable<void> {
    return this.utilsService.findImage(imagename, 'shop/logo', res);
  }

  @Get()
  getShops(@GetCurrentUserId() userId: number): Promise<Shop[]> {
    return this.shopService.getShops(userId);
  }

  @Get(':shopId')
  getShopById(
    @GetCurrentUserId() userId: number,
    @Param('shopId', ParseIntPipe) shopId: number,
  ): Promise<Shop> {
    return this.shopService.getShopById(userId, shopId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  @UsePipes(new ValidationPipe({ always: true }))
  createShop(
    @UploadedFile(new CustomParseFilePipe(true)) logo: Express.Multer.File,
    @GetCurrentUserId() userId: number,
    @Body() dto: CreateShopDto,
  ): Promise<Shop> {
    return this.shopService.createShop(userId, dto, logo);
  }

  @Patch(':shopId')
  editShop(
    @GetCurrentUserId() userId: number,
    @Param('shopId', ParseIntPipe) shopId: number,
    @Body() dto: EditShopDto,
  ): Promise<Shop> {
    return this.shopService.editShop(userId, shopId, dto);
  }

  @Patch(':type/:shopId')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(new ValidationPipe({ always: true }))
  editShopLogo(
    @UploadedFile(new CustomParseFilePipe(true)) image: Express.Multer.File,
    @GetCurrentUserId() userId: number,
    @Param('shopId', ParseIntPipe) shopId: number,
    @Param('type') type: string,
  ): Promise<Shop> {
    if (type === 'logo' || type === 'banner') {
      return this.shopService.editShopImage(userId, shopId, image, type);
    } else {
      throw new NotFoundException('Cannot PATCH /' + type);
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':shopId')
  deleteShop(
    @GetCurrentUserId() userId: number,
    @Param('shopId', ParseIntPipe) shopId: number,
  ): Promise<boolean> {
    return this.shopService.deleteShop(userId, shopId);
  }
}
