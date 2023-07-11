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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { GetCurrentUserId } from '../common/decorators';
import { CreateMenuDto, EditMenuDto } from './dto';
import { Menu } from './types';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

export const storage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

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

  @Get(':menuId/info')
  getMenuById(
    @GetCurrentUserId() userId: number,
    @Param('menuId', ParseIntPipe) menuId: number,
  ): Promise<Menu> {
    return this.menuService.getMenuById(userId, menuId);
  }

  @Post(':shopId')
  @UseInterceptors(FileInterceptor('file', storage))
  async createMenu(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetCurrentUserId() userId: number,
    @Param('shopId', ParseIntPipe) shopId: number,
    @Body() dto: CreateMenuDto,
  ) {
    //save data into db
    //save file into storage
    // console.log(file);
    return this.menuService.createMenu(userId, shopId, dto, file);
  }

  @Post('/imageUpload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadMenuImage() {
    //save data into db
    //save file into storage
    // console.log(file);
    return true;
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
