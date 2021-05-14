// import {
//     Table,
//     Column,
//     Model,
//     CreatedAt,
//     UpdatedAt,
//     IsUUID,
//     PrimaryKey,
//     DataType,
// } from 'sequelize-typescript';
// import { HasFile } from '@/lib/entities/hasfile.entity';

export class Resource {}

// class BaseResource extends Model<BaseResource> {
//     @IsUUID(4)
//     @PrimaryKey
//     @Column({
//         defaultValue: DataType.UUIDV4,
//     })
//     public id: string;

//     @Column({ field: 'section' })
//     public section: string;

//     @Column({ field: 'ownerid' })
//     public ownerId: string;

//     @Column({ field: 'uri' })
//     public uri: string;

//     @Column({ field: 'size', type: DataType.INTEGER.UNSIGNED })
//     public size: number;

//     @Column({ field: 'title' })
//     public title: string;

//     @Column({ field: 'mime_type' })
//     public mimeType: string;

//     @Column({ field: 'display_type', defaultValue: "DEFAULT" })
//     public displayType: "FILE" | "IMAGE" | "DEFAULT";

//     @CreatedAt
//     @Column({ field: 'created_at' })
//     public createdAt: Date;

//     @UpdatedAt
//     @Column({ field: 'updated_at' })
//     public updatedAt: Date;
// }

// @Table({
//     tableName: 'core_resources',
//     timestamps: true,
// })
// export class Resource extends HasFile('uri', {
//     field: 'uri',
// })(BaseResource) {
//     getFileOwnerId(): string {
//         return this.ownerId;
//     }

//     getFileSection(): string {
//         return this.section;
//     }

//     async saveFile(
//         file: any,
//         autoSaveEntity = false,
//     ): Promise<string | null> {
//         const result = await super.saveFile(file, false);
//         if (result) {
//             const info = await this.fileObject.info();
//             this.mimeType = info.mime;
//             this.size = info.size;
//             this.title = file.filename;
//         } else {

//         }
//         if (autoSaveEntity) {
//             await this.save();
//         }
//         return this.fileObject.filename;
//     }
// }
