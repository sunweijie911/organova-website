import { env } from '@/env';
import { parseAuthMethod } from '@/lib/auth-methods';
import { getSiteName } from '@/server/services/config';
import SignInForm from './signin-form';

// Server Component：在请求时读取运行时 env 与 DB 配置，
// 通过 props 注入客户端表单。改 .env / 后台设置后均无需重新构建。
export default async function SignInPage() {
  const authMethod = parseAuthMethod(env.AUTH_METHOD);
  const siteName = await getSiteName();
  return <SignInForm authMethod={authMethod} siteName={siteName} />;
}
