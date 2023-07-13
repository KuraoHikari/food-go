import {
  Injectable,
  PipeTransform,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';

@Injectable()
export class CustomParseFilePipe implements PipeTransform<any, any> {
  constructor(private readonly fileIsRequired: boolean = true) {}

  async transform(value: any): Promise<any> {
    const parseFilePipe = new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
      ],
      fileIsRequired: this.fileIsRequired,
    });

    try {
      return await parseFilePipe.transform(value);
    } catch (error) {
      throw error;
    }
  }
}
