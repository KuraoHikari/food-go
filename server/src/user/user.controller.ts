import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { GetCurrentUserId, Public } from '../common/decorators';
import { UtilsService } from '../utils/utils.service';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomParseFilePipe } from 'src/lib/parse-file.pipe';
import { editUserDto } from './dto';
import { UserMe } from './types';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private utilsService: UtilsService,
  ) {}
  @Public()
  @Get('user-banner/:imagename')
  findUserBannerImage(
    @Param('imagename') imagename: string,
    @Res() res: Response,
  ): Observable<void> {
    return this.utilsService.findImage(imagename, 'user/banner', res);
  }

  @Public()
  @Get('user-profile/:imagename')
  findUserProfileImage(
    @Param('imagename') imagename: string,
    @Res() res: Response,
  ): Observable<void> {
    return this.utilsService.findImage(imagename, 'user/profile', res);
  }

  @Get('me')
  getUser(@GetCurrentUserId() userId: number): Promise<UserMe> {
    return this.userService.getUser(userId);
  }

  @Patch('me')
  editUser(
    @GetCurrentUserId() userId: number,
    @Body() dto: editUserDto,
  ): Promise<UserMe> {
    return this.userService.editUser(userId, dto);
  }

  @Patch('/change-image/:type')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(new ValidationPipe({ always: true }))
  editUserImage(
    @UploadedFile(new CustomParseFilePipe(true)) logo: Express.Multer.File,
    @GetCurrentUserId() userId: number,
    @Param('type') type: string,
  ): Promise<UserMe> {
    return this.userService.editUserImage(userId, logo, type);
  }
}
