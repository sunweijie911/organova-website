import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { isEmailOtpEnabled } from '@/lib/auth-methods';

export const authClient = createAuthClient({
  plugins: isEmailOtpEnabled ? [emailOTPClient()] : [],
});

export type Session = typeof authClient.$Infer.Session;
