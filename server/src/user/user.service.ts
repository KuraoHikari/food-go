import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { editUserDto } from './dto';
import { UserMe } from './types';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private utilsService: UtilsService,
  ) {}
  async getUser(userId: number): Promise<UserMe> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        shops: true,
      },
    });

    delete user.updatedAt;
    delete user.createdAt;
    delete user.hash;
    delete user.hashedRt;

    return user;
  }

  async editUser(userId: number, dto: editUserDto): Promise<UserMe> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.createdAt;
    delete user.hash;
    delete user.hashedRt;

    return user;
  }

  async editUserImage(
    userId: number,
    logo: Express.Multer.File,
    type: string,
  ): Promise<UserMe> {
    const updatedFileName = this.utilsService.generateUpdatedFileName(logo);

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        [type]: updatedFileName,
      },
    });

    this.utilsService
      .writeFileToUploadsFolder(updatedFileName, logo.buffer, `user/${type}`)
      .catch(() => {
        throw new InternalServerErrorException(
          'Error saving file to uploads folder',
        );
      });

    delete user.createdAt;
    delete user.hash;
    delete user.hashedRt;

    return user;
  }
}
