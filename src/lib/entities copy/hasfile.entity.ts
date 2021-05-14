//import { Column, DataType, AfterDestroy } from 'sequelize-typescript';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { File } from '../storage';

export interface IHasFile {
  [name: string]: any;
  saveFile(file: any, autoSaveEntity?: boolean): Promise<string | null>;
  getFileSection(): string;
  getFileOwnerId(): string;
  deleteFile(autoSaveEntity?: boolean): Promise<any>;
}

export function HasFile(propertyName: string = 'file', config: any = {}) {
  return <T extends new (...args: any[]) => any>(Target: T) => {
    const privatePropName = `___${propertyName}___`;

    class WithFile extends Target implements IHasFile {
      constructFile() {
        this.fileObject = new File();
        this.fileObject.section = this.getFileSection();
        this.fileObject.ownerId = this.getFileOwnerId();
        this.fileObject.filename = this[propertyName];
        this[propertyName] = this.fileObject.filename;
      }

      //@AfterDestroy
      static async deleteOnDestroy(instance, options) {
        await instance.deleteFile();
      }

      getFileSection(): string {
        return this['fileSection'] || 'default';
      }
      getFileOwnerId(): string {
        return this.id;
      }

      async saveFile(
        file: any,
        autoSaveEntity = false,
      ): Promise<string | null> {
        try {
          await this.deleteFile();
        } catch (ex) { }
        const fileName = uuid() + path.extname(file.filename);
        this.constructFile();
        const result = await this.fileObject.save(
          fileName,
          file.createReadStream(),
        );
        this[propertyName] = fileName;

        if (result) {
          if (autoSaveEntity) {
            this.save();
          }
        }
        return this.fileObject.filename;
      }

      async deleteFile(autoSaveEntity = false): Promise<any> {
        this.constructFile();
        const result = await this.fileObject.delete();

        this[propertyName] = null;
        if (result) {
          if (autoSaveEntity) {
            this.save();
          }
        }
        return result;
      }
    }

    //define the propery get/set for the image
    // Object.defineProperty(WithFile.prototype, propertyName, {
    //   get: function(): string {
    //     return this[privatePropName];
    //   },
    //   set: function(value: string) {
    //     this[privatePropName] = value;
    //   },
    //   enumerable: true,
    //   configurable: true,
    // });

    return WithFile;
  };
}
