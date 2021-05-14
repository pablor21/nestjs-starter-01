import { FileStorage } from '@bigbangjs/file-storage';
import { Config } from '../config';
import { Logger } from '../logger';

export class AppStorage extends FileStorage {
  async init() {
    const config = (Config.get('storage'));
    await Promise.all(Object.keys(config).map(async key => {
      (await this.addProvider(config[key])).result;
    }))
  }

  /**
   * Empty the cache disk
   * @returns 
   */
  async deleteCache() {
    return this.getBucket('cache').empty();
  }

}

export const Storage = new AppStorage({
  defaultBucketMode: '0777',
  bucketAliasStrategy: 'NAME',
  autoInitProviders: true,
  autoCleanup: true,
  defaultBucketName: 'uploads',
  logger: Logger.getLogger('storage'),
});

