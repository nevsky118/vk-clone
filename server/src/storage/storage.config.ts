import { S3 } from 'aws-sdk';

const S3Client = new S3({
  endpoint: 'https://storage.yandexcloud.net',
  accessKeyId: process.env.YANDEX_ACCESS_KEY_ID,
  secretAccessKey: process.env.YANDEX_SECRET_ACCESS_KEY,
  region: process.env.YANDEX_REGION,
  httpOptions: {
    timeout: 10000,
    connectTimeout: 10000,
  },
});

export default S3Client;
