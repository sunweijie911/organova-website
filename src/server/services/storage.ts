import 'server-only';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { env } from '@/env';

/**
 * 上传文件到配置的存储后端（local / OSS / S3）。
 * 返回文件的公开访问 URL。
 */
export async function uploadFile(
  module: string,
  fileName: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const key = `uploads/${module}/${fileName}`;
  switch (env.STORAGE_PROVIDER) {
    case 'oss':
      return uploadToOss(key, buffer, contentType);
    case 's3':
      return uploadToS3(key, buffer, contentType);
    default:
      return uploadToLocal(module, fileName, buffer);
  }
}

async function uploadToLocal(
  module: string,
  fileName: string,
  buffer: Buffer,
): Promise<string> {
  const uploadDir = join(process.cwd(), 'public', 'uploads', module);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, fileName), buffer);
  return `/uploads/${module}/${fileName}`;
}

async function uploadToOss(
  key: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const { region, accessKeyId, accessKeySecret, bucket, baseUrl } =
    requireOssConfig();
  const OSS = (await import('ali-oss')).default;
  const client = new OSS({ region, accessKeyId, accessKeySecret, bucket });
  await client.put(key, buffer, { mime: contentType });
  const base = baseUrl ?? `https://${bucket}.${region}.aliyuncs.com`;
  return `${base}/${key}`;
}

async function uploadToS3(
  key: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const { region, accessKeyId, secretAccessKey, bucket, endpoint, baseUrl } =
    requireS3Config();
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
  const client = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
    ...(endpoint ? { endpoint } : {}),
    // 使用自定义 endpoint 时强制 path-style，兼容 MinIO 等服务
    forcePathStyle: !!endpoint,
  });
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );
  const defaultBase = endpoint
    ? `${endpoint}/${bucket}`
    : `https://${bucket}.s3.${region}.amazonaws.com`;
  return `${baseUrl ?? defaultBase}/${key}`;
}

function requireOssConfig() {
  const {
    OSS_REGION,
    OSS_ACCESS_KEY_ID,
    OSS_ACCESS_KEY_SECRET,
    OSS_BUCKET,
    OSS_BASE_URL,
  } = env;
  if (
    !OSS_REGION ||
    !OSS_ACCESS_KEY_ID ||
    !OSS_ACCESS_KEY_SECRET ||
    !OSS_BUCKET
  ) {
    throw new Error(
      'STORAGE_PROVIDER=oss 时必须配置 OSS_REGION / OSS_ACCESS_KEY_ID / OSS_ACCESS_KEY_SECRET / OSS_BUCKET',
    );
  }
  return {
    region: OSS_REGION,
    accessKeyId: OSS_ACCESS_KEY_ID,
    accessKeySecret: OSS_ACCESS_KEY_SECRET,
    bucket: OSS_BUCKET,
    baseUrl: OSS_BASE_URL,
  };
}

function requireS3Config() {
  const {
    S3_REGION,
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    S3_BUCKET,
    S3_ENDPOINT,
    S3_BASE_URL,
  } = env;
  if (!S3_REGION || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_BUCKET) {
    throw new Error(
      'STORAGE_PROVIDER=s3 时必须配置 S3_REGION / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY / S3_BUCKET',
    );
  }
  return {
    region: S3_REGION,
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    bucket: S3_BUCKET,
    endpoint: S3_ENDPOINT,
    baseUrl: S3_BASE_URL,
  };
}
