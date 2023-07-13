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
  @UsePipes(
    new ValidationPipe({
      always: true,
    }),
  )
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
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(
    new ValidationPipe({
      always: true,
    }),
  )
  editMenu(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
        fileIsRequired: false,
      }),
    )
    image: Express.Multer.File,
    @GetCurrentUserId() userId: number,
    @Param('menuId', ParseIntPipe) menuId: number,
    @Body() dto: EditMenuDto,
  ): Promise<Menu> {
    return this.menuService.editMenu(userId, menuId, dto, image);
  }

  @Patch('edit-image/:menuId')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(
    new ValidationPipe({
      always: true,
    }),
  )
  editMenuImage(
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
