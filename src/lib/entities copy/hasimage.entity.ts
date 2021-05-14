import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { Image } from '../storage';

export interface IHasImage {
  [name: string]: any;
  saveImage(file: any, autoSaveEntity?: boolean): Promise<string | null>;
  getImageSection(): string;
  getImageOwnerId(): string;
  deleteImage(autoSaveEntity?: boolean): Promise<any>;
  generateDefaultImage(text?: string): Promise<any>;
  getDefaultImageText(): string;
}

export function HasImage(propertyName: string = 'image', config: any = {}) {
  return <T extends new (...args: any[]) => any>(Target: T) => {
    const privatePropName = `___${propertyName}___`;

    class WithImage extends Target implements IHasImage {
      constructImage() {
        this.imageObject = new Image();
        this.imageObject.section = this.getImageSection();
        this.imageObject.ownerId = this.getImageOwnerId();
        this.imageObject.filename = this[propertyName];
        this[propertyName] = this.imageObject.filename;
      }

      getImageSection(): string {
        return this['imageSection'] || 'default';
      }
      getImageOwnerId(): string {
        return this._id ? this._id.toString() : null;
      }

      getDefaultImageText() {
        return this._id.toString();
      }

      async saveImage(
        file: any,
        autoSaveEntity = false,
      ): Promise<string | null> {
        this.constructImage();
        const result = await this.imageObject.save(
          uuid() + path.extname(file.filename),
          file.createReadStream(),
        );
        if (result) {
          if (autoSaveEntity) {
            this.save();
          }
        }
        this[propertyName] = this.imageObject.filename;
        return this.imageObject.filename;
      }

      async deleteImage(autoSaveEntity = false): Promise<any> {
        this.constructImage();
        const result = await this.imageObject.delete();
        if (result) {
          if (autoSaveEntity) {
            this.save();
          }
        }
        return result;
      }

      async generateDefaultImage(text?: string): Promise<any> {
        this.constructImage();
        this.imageObject.filename = this.getImageOwnerId() + '.png';
        return await this.imageObject.saveDefaultImage(
          text || this.getDefaultImageText(),
        );
      }
    }

    //define the propery get/set for the image
    // Object.defineProperty(WithImage.prototype, propertyName, {
    //   get: function (): string {
    //     return this[privatePropName];
    //   },
    //   set: function (value: string) {
    //     this[privatePropName] = value;
    //   },
    //   enumerable: true,
    //   configurable: true,
    // });

    // //add the column definition
    // WithImage.prototype[privatePropName] = Column({
    //   type: DataType.STRING,
    //   ...config,
    // })(WithImage.prototype, propertyName);

    return WithImage;
  };
}
