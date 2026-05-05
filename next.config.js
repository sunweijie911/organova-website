import './src/env.js';

/** @type {import("next").NextConfig} */
const config = {
  output: 'standalone',
  // ali-oss 和 @aws-sdk/client-s3 含 Node.js 原生依赖，不能被 Turbopack 打包
  serverExternalPackages: ['ali-oss', '@aws-sdk/client-s3'],
};

export default config;
