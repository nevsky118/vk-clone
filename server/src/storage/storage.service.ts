import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import S3Client from './storage.config';

@Injectable()
export class StorageService {
  async uploadOne(file: Express.Multer.File, path: string): Promise<string> {
    if (!file) return;

    const Key = `${path}/${uuidv4()}.${file.originalname.split('.').pop()}`;

    const params: S3.PutObjectRequest = {
      Bucket: process.env.YANDEX_BUCKET,
      Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const res = await S3Client.upload(params).promise();
      return res.Location;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        `Произошла ошибка при загрузке файла: ${file.originalname}`,
      );
    }
  }

  async deleteOne(file: string): Promise<void> {
    if (!file) return;

    const Key = file.replace(
      `https://${process.env.YANDEX_BUCKET}.storage.yandexcloud.net/`,
      '',
    );

    const params: S3.DeleteObjectRequest = {
      Bucket: process.env.YANDEX_BUCKET,
      Key,
    };

    try {
      await S3Client.deleteObject(params).promise();
    } catch (error) {
      throw new BadRequestException(
        `Произошла ошибка при удалении файла: ${Key}`,
      );
    }
  }
}
