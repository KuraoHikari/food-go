import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { GetCurrentUserId, Public } from '../common/decorators';
import { CreateMenuDto, EditMenuDto } from './dto';
import { Menu } from './types';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { Observable, of } from 'rxjs';
import { Response } from 'express';

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}
  @Public()
  @Get('menu-image/:imagename')
  findProfileImage(
    @Param('imagename') imagename: string,
    @Res() res: Response,
  ): Observable<void> {
    return of(
      res.sendFile(path.join(process.cwd(), 'uploads/menu/' + imagename)),
    );
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
  async createMenu(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
        fileIsRequired: true,
      }),
    )
    image: Express.Multer.File,
    @GetCurrentUserId() userId: number,
    @Param('shopId', ParseIntPipe) shopId: number,
    @Body() dto: CreateMenuDto,
  ) {
    return this.menuService.createMenu(userId, shopId, dto, image);
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
    @Param('menuId', ParseIntPipe) menuId: number,
  ): Promise<boolean> {
    return this.menuService.deleteMenu(userId, menuId);
  }
}
