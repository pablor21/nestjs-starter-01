import {
    Controller,
    Get,
    Param,
    NotFoundException,
    Res,
    Query,
  } from '@nestjs/common';
  import { Image } from '@/lib/storage';
  
  @Controller('image')
  export class ImageController {
    /**
     * Get the image (min params :section/:owner/:size/:filename)
     * You can add query params ?text=text+to+display&default=1|0
     * @param rawParams 
     * @param cache 
     * @param allowDefault 
     * @param text 
     * @param res 
     * @returns 
     */
    @Get('*')
    public async getImage(
      @Param() rawParams: any,
      @Query('cache') cache: string,
      @Query('default') allowDefault: string,
      @Query('text') text: string,
      @Res() res: any,
    ) {
      if (!rawParams[0]) {
        throw new NotFoundException();
      }
      const segments: string[] = rawParams[0].split('/');
  
      //min params :section/:owner/:size/:filename
      if (segments.length < 4) {
        throw new NotFoundException();
      }
  
      const info = {
        cache: !cache || cache !== '0',
        allowDefault: !allowDefault || allowDefault !== '0',
        filename: segments[segments.length - 1],
        size: segments[segments.length - 2],
        requestSize: {
          w: 0,
          h: 0,
        },
        owner: segments[segments.length - 3],
        section: segments.slice(0, segments.length - 3).join('/'),
      };
  
      if (!info.size.match(/([0-9]+)x([0-9]+)/)) {
        throw new NotFoundException();
      }
  
      const image = new Image();
      image.section = info.section;
      image.filename = info.filename;
      image.ownerId = info.owner;
      const stream = await image.resize(
        info.size,
        info.cache,
        info.allowDefault,
        text,
      );
      if (stream) {
        stream.pipe(res);
        return;
      }
      throw new NotFoundException();
    }
  }
  