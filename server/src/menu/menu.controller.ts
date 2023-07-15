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
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { GetCurrentUserId, Public } from '../common/decorators';
import { CreateMenuDto, EditMenuAvailabilityDto, EditMenuDto } from './dto';
import { Menu } from './types';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { CustomParseFilePipe } from '../lib/parse-file.pipe';
import { UtilsService } from '../utils/utils.service';

@Controller('menu')
export class MenuController {
  constructor(
    private menuService: MenuService,
    private utilsService: UtilsService,
  ) {}

  @Public()
  @Get('menu-image/:imagename')
  findMenuImage(
    @Param('imagename') imagename: string,
    @Res() res: Response,
  ): Observable<void> {
    return this.utilsService.findImage(imagename, 'menu', res);
  }

  @Public()
  @Get()
  getPublicMenus() {
    return this.menuService.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      page: 0,
    });
  }

  @Get(':shopId')
  getMenus(
    @GetCurrentUserId() userId: number,
    @Param('shopId', ParseIntPipe) shopId: number,
  ): Promise<Menu[]> {
    return this.menuService.getMenus(userId, shopId);
  }

  @Get(':menuId/info')
  getMenuById(
    @GetCurrentUserId() userId: number,
    @Param('menuId', ParseIntPipe) menuId: number,
  ): Promise<Menu> {
    return this.menuService.getMenuById(userId, menuId);
  }

  @Post(':shopId')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(new ValidationPipe({ always: true }))
  async createMenu(
    @UploadedFile(new CustomParseFilePipe(true)) image: Express.Multer.File,
    @GetCurrentUserId() userId: number,
    @Param('shopId', ParseIntPipe) shopId: number,
    @Body() dto: CreateMenuDto,
  ) {
    return this.menuService.createMenu(userId, shopId, dto, image);
  }

  @Patch(':menuId')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(new ValidationPipe({ always: true }))
  editMenu(
    @UploadedFile(new CustomParseFilePipe(false)) image: Express.Multer.File,
    @GetCurrentUserId() userId: number,
    @Param('menuId', ParseIntPipe) menuId: number,
    @Body() dto: EditMenuDto,
  ): Promise<Menu> {
    return this.menuService.editMenu(userId, menuId, dto, image);
  }

  @Patch('edit-image/:menuId')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(new ValidationPipe({ always: true }))
  editMenuImage(
    @UploadedFile(new CustomParseFilePipe(true)) image: Express.Multer.File,
    @GetCurrentUserId() userId: number,
    @Param('menuId', ParseIntPipe) menuId: number,
  ): Promise<Menu> {
    return this.menuService.editMenu(userId, menuId, {}, image);
  }

  @Put('availability/:menuId')
  editMenuAvailability(
    @GetCurrentUserId() userId: number,
    @Param('menuId', ParseIntPipe) menuId: number,
    @Body() dto: EditMenuAvailabilityDto,
  ): Promise<Menu> {
    return this.menuService.editMenu(userId, menuId, dto, undefined);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':menuId')
  deleteMenu(
    @GetCurrentUserId() userId: number,
    @Param('menuId', ParseIntPipe) menuId: number,
  ): Promise<boolean> {
    return this.menuService.deleteMenu(userId, menuId);
  }
}
