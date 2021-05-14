import * as crypto from 'crypto';
import { env } from './env';

export class Hash {
    static _secret = env('APP_KEY', Hash.md5(env('APP_NAME')));

    static sha512(value: string): string {
        const hash = crypto.createHmac(
            'sha512',
            this._secret,
        ); /** Hashing algorithm sha512 */
        hash.update(value);
        return hash.digest('hex');
    }

    static md5(value: string): string {
        return crypto
            .createHash('md5')
            .update(value)
            .digest('hex');
    }

    static compare(value: string, hashed: string): boolean {
        return Hash.sha512(value) === hashed;
    }

    static hash(value: string): string {
        return Hash.sha512(value);
    }
}
