import { IFileOwner } from './fileowner.interface';
import { Storage } from './storage';
import * as path from 'path';
import { uuid } from '../functions';

export class File {
  public section = 'default';
  public ownerId: string | number = null;
  public owner: IFileOwner;
  public filename: string;
  public diskName = 'uploads';
  public cacheDiskName = 'cache';
  public mimeType = null;
  public size = 0;

  async info() {
    return (await Storage.getBucket(this.diskName).getFile(
      await this.getOriginalFilename(),
    )).result.meta;
  }

  generateFilename(extension: string): string {
    return uuid() + '.' + extension;
  }

  public async getOriginalFilename() {
    return path.join(await this.getOriginalPath(), this.filename);
  }

  public async getOriginalPath() {
    return path.join('/' + this.section, String(this.ownerId));
  }

  async save(filename: string, stream: any) {
    const result = (await Storage.getBucket(this.diskName).putFile(
      path.join(await this.getOriginalPath(), filename),
      stream,
    )).result;
    this.filename = filename;
    return result;
  }

  async getStream() {
    return await Storage.getBucket(this.diskName).getFileStream(
      await this.getOriginalFilename(),
    );
  }

  public async delete() {
    if (this.filename) {
      return (await Storage.getBucket(this.diskName).deleteFile(
        await this.getOriginalFilename(),
        {
          cleanup: true
        }
      )).result;
    }
  }
}
