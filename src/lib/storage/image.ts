import { File } from './file';
import * as TextToSVG from 'text-to-svg';
import * as randomColor from 'randomcolor';
import * as sharp from 'sharp';
import * as path from 'path';
import { Storage } from './storage';
import { NotFoundException } from '@nestjs/common';
import { Hash } from '../hash';

let textToSVG;
try {
  textToSVG = TextToSVG.loadSync(path.join('resources/fonts/FuturaBQ-Book.otf'));
} catch (ex) {

}

export class Image extends File {
  private isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  private async generateSvg(text: string, size = 400): Promise<any> {
    const words = text
      .split(' ')
      .filter(w => w.replace(/[^A-Za-z0-9]/gi, ''))
      .filter(w => (!this.isEmptyOrSpaces(w) ? w : undefined));
    if (words.length > 0) {
      let initials = null;
      if (words.length > 1) {
        initials = words
          .splice(0, words.length > 2 ? 2 : 2)
          .map(w => {
            return w.charAt(0).toUpperCase();
          })
          .join('');
      } else {
        initials =
          words[0].charAt(0).toUpperCase() + words[0].charAt(1).toUpperCase();
      }

      if (initials) {
        const attributes = { fill: 'white' };
        const options = {
          x: 0,
          y: -5,
          fontSize: size * 0.5,
          /*letterSpacing: -0.1,*/ anchor: 'top middle',
          attributes: attributes,
        };
        const svg = textToSVG.getSVG(initials, options);
        return {
          svg: svg,
          initials: initials,
        };
      }
    }
    return null;
  }

  public async generateFromInitials(
    filename: string,
    text: string,
    size = 400,
  ) {
    const image = await this.generateSvg(text);
    if (image) {
      const color = randomColor({
        seed: Hash.md5(filename),
        luminosity: 'random',
        hue: 'random',
      });
      /*
            const roundedCorners = Buffer.from(
                '<svg><rect x="0" y="0" width="200" height="200" rx="50" ry="50"/></svg>'
            );
           
            return sharp(
                {
                    create: {
                        width: size,
                        height: size,
                        channels: 4,
                        background: color
                    }
                }
            )
                .resize(200, 200)
                .composite([{
                    input: roundedCorners,
                    background: color,
                    blend: 'over'
                }])
                .png();*/
      const roundedCorners = Buffer.from(
        (await this.generateSvg(text, size)).svg,
      );

      return sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: color,
        },
      })
        .composite([
          {
            input: roundedCorners,
            background: color,
            blend: 'over',
          },
        ])
        .png();
    }
    return null;
  }

  public async getCachePath(size = '0x0') {
    return path.join('/images', this.section, String(this.ownerId), size);
  }

  public async getCacheFileName(size = '0x0') {
    return path.join(await this.getCachePath(size), '/', this.filename);
  }

  public async getOriginalFilename() {
    return path.join(await this.getOriginalPath(), this.filename);
  }

  public async getOriginalPath() {
    return path.join('/' + this.section, String(this.ownerId));
  }

  public async saveToCache(size, stream) {
    return await Storage.getBucket(this.cacheDiskName).putFile(
      await this.getCacheFileName(size),
      stream,
    );
  }

  public async save(filename, stream) {
    if (this.filename) {
      await this.deleteCacheImages();
    }
    const result = (await Storage.getBucket(this.diskName).putFile(
      path.join(await this.getOriginalPath(), filename),
      stream,
    )).result;
    if (result) {
      if (this.filename) {
        await Storage.getBucket(this.diskName).deleteFile(
          await this.getOriginalFilename(),
        );
      }
      this.filename = filename;
    }
    return result;
  }

  public async delete() {
    if (this.filename) {
      await this.deleteCacheImages();
      return super.delete();
    }
  }

  public async deleteCacheImages() {
    if (!this.filename) {
      return true;
    }
    // return await Storage.getBucket(this.cacheDiskName).deleteFiles(
    //   await this.getCacheFileName('**'),
    // );
  }

  public async getCachedFile(size = '0x0') {
    const cacheFileName = await this.getCacheFileName(size);
    if ((await Storage.getBucket(this.cacheDiskName).fileExists(cacheFileName)).result) {
      return (await Storage.getBucket(this.cacheDiskName).getFileStream(cacheFileName)).result;
    }
    return null;
  }

  public async originalFileExists() {
    const originalFilename = await this.getOriginalFilename();
    return (await Storage.getBucket(this.diskName).fileExists(originalFilename)).result;
  }

  public async getOriginalFile() {
    const originalFilename = await this.getOriginalFilename();
    if (await this.originalFileExists()) {
      return await Storage.getBucket(this.diskName).getFile(originalFilename);
    }
    return null;
  }

  public async saveDefaultImage(text: string) {
    if (this.filename) {
      await this.deleteCacheImages();
    }
    return await Storage.getBucket(this.diskName).putFile(
      path.join(await this.getOriginalPath(), this.filename),
      await this.generateFromInitials(await this.getOriginalFilename(), text),
    );
  }

  public async resize(
    size = '0x0',
    allowCache = true,
    allowDefault = true,
    text = null,
  ) {

    if (!size.match(/([0-9]+)x([0-9]+)/)) {
      throw new NotFoundException();
    }

    const requestSize = {
      w: Number(size.split('x')[0]),
      h: Number(size.split('x')[1]),
    };

    
    //check if cache exists
    if (allowCache) {
      const cachedFile = await this.getCachedFile(size);
      if (cachedFile) {
        return cachedFile;
      }
    }
    let diskName = this.diskName;
    let originalFilename = await this.getOriginalFilename();
    if (!(await this.originalFileExists())) {
      if (allowDefault) {
        if (text) {
          await this.saveDefaultImage(text);
        } else {
          originalFilename = this.section.split('/')[0] + '.png';
          diskName = 'defaults';
          if (!(await Storage.getBucket(diskName).fileExists(originalFilename)).result) {
            originalFilename = 'default.png';
            if (!(await Storage.getBucket(diskName).fileExists(originalFilename)).result) {
              throw new NotFoundException();
            }
          }
        }
      } else {
        return null;
      }
    }
    let stream = null;
    const transformer = sharp().resize({
      width: requestSize.w > 0 ? requestSize.w : null,
      height: requestSize.h > 0 ? requestSize.h : null,
    });
    //check if cache exists
    if (allowCache) {
      stream = await this.getCachedFile(size);
      if (!stream) {
        let originalStream = null;
        if (size === '0x0') {
          originalStream = (await Storage.getBucket(diskName).getFileStream(
            originalFilename,
          )).result;
        } else {
          const str = (await Storage.getBucket(diskName).getFileStream(
            originalFilename,
          )).result;

          originalStream = str.pipe(transformer);
        }
        if (originalStream) {
          await this.saveToCache(size, originalStream);
          stream = await this.getCachedFile(size);
        }
      }
    } else {
      if (size === '0x0') {
        stream = (await Storage.getBucket(diskName).getFileStream(originalFilename)).result;
      } else {
        const originalStream = (await Storage.getBucket(diskName).getFileStream(
          originalFilename,
        )).result;
        stream = originalStream.pipe(transformer);
      }
    }
    return stream;
  }
}
