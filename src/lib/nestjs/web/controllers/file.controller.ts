import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { File } from '@/lib/storage';

@Controller('file')
export class FileController {
  @Get('*')
  public async getFile(@Param() rawParams: any, @Res() res: any) {
    if (!rawParams[0]) {
      throw new NotFoundException();
    }
    const segments: string[] = rawParams[0].split('/');

    //min params :section/:owner/:filename
    if (segments.length < 3) {
      throw new NotFoundException();
    }

    const info = {
      filename: segments[segments.length - 1],
      owner: segments[segments.length - 2],
      section: segments.slice(0, segments.length - 2).join('/'),
    };

    try {
      const file = new File();
      file.section = info.section;
      file.filename = info.filename;
      file.ownerId = info.owner;

      const fileInfo = await file.info();
      if (!fileInfo.exists) {
        throw new NotFoundException();
      }
      const stream = (await file.getStream()).result;
      if (stream) {
        await stream.pipe(res);
        return;
      }
    } catch (ex) {
      //console.log(ex);
    }
    throw new NotFoundException();
  }
}
