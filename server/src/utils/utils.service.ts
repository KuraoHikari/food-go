import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UtilsService {
  constructor() {}
  generateUpdatedFileName(file: Express.Multer.File): string {
    const updatedFileName = `${
      path.parse(file.originalname).name
    }-${uuidv4()}.${mime.extension(file.mimetype)}`;

    return updatedFileName;
  }

  writeFileToUploadsFolder(
    updatedFileName: string,
    buffer: Buffer,
    folder: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(
        `./uploads/${folder}/${updatedFileName}`,
      );
      writeStream.write(buffer);

      writeStream.on('finish', () => {
        writeStream.close();
        resolve();
      });

      writeStream.on('error', (error) => {
        reject(error);
      });
    });
  }
}
