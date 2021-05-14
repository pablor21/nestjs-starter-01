import { env } from "./env";
import * as crypto from 'crypto';

export class Encryptor {
    static _secret = env('APP_SECRET','vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3');

    static encrypt(message: any, algorithm = 'aes-256-ctr'): any {
        if (typeof (message) !== 'string') {
            message = JSON.stringify(message);
        }
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, Encryptor._secret, iv);
        const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);
        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex'),
            token: `${iv.toString('hex')}_${encrypted.toString('hex')}`
        };
    }

    static decrypt(message: any, algorithm = 'aes-256-ctr'): any {
        let iv, content;
        if (typeof (message) === 'string') {
            const separatorIndex = message.indexOf("_");
            iv = message.substr(0, separatorIndex);
            content = message.substr(separatorIndex + 1);
        } else {
            iv = message.iv;
            content = message.content;
        }
        const decipher = crypto.createDecipheriv(algorithm, Encryptor._secret, Buffer.from(iv, 'hex'));
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);

        try {
            return JSON.parse(decrpyted.toString());
        } catch {
            return decrpyted.toString();
         }

        
    }
}