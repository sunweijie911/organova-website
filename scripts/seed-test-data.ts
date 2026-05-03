import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/server/db/schema';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('错误: 缺少 DATABASE_URL 环境变量');
  process.exit(1);
}

const conn = postgres(databaseUrl);
const _db = drizzle(conn, { schema });

async function seed() {
  // TODO: 在此添加测试数据插入逻辑，例如:
  // await _db.insert(schema.posts).values([...]);
  console.log('Seed script placeholder — add your seed data here');
}

seed()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
