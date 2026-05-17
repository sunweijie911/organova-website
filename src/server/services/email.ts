import type { Transporter } from 'nodemailer';
import nodemailer from 'nodemailer';
import { env } from '@/env';

// HTML 转义，防止用户输入注入 HTML 邮件模板
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('[EMAIL] 生产环境必须配置 SMTP 变量: SMTP_USER, SMTP_PASS');
  }

  const host = env.SMTP_HOST;
  const port = env.SMTP_PORT;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export interface LeadNotificationPayload {
  source: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string | null;
}

/**
 * 发送线索通知邮件。
 * 开发环境打印到控制台；生产环境通过 SMTP 发送（见 .env.example SMTP 配置）。
 * 邮件失败会抛出异常，由调用方决定如何记录（leads router 会写 email_send_status）。
 */
export async function sendLeadNotification(
  lead: LeadNotificationPayload,
): Promise<void> {
  const sourceLabel =
    lead.source === 'rfq' ? 'RFQ (询价)' : 'Contact (联系我们)';
  if (env.NODE_ENV !== 'production') {
    console.log(
      `[LEAD] 新线索 [${sourceLabel}] ${lead.firstName} ${lead.lastName} <${lead.email}>`,
    );
    return;
  }
  const fullName = `${lead.firstName} ${lead.lastName}`;
  await getTransporter().sendMail({
    from: `"OrgaNova 网站" <${env.SMTP_USER}>`,
    to: 'info@tricbio.com',
    subject: `[新线索] ${sourceLabel} — ${fullName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="color:#333;margin-bottom:16px;">收到新的网站线索</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px;color:#666;width:100px;">来源</td><td style="padding:8px;font-weight:600;">${esc(sourceLabel)}</td></tr>
          <tr><td style="padding:8px;color:#666;">姓名</td><td style="padding:8px;">${esc(fullName)}</td></tr>
          <tr><td style="padding:8px;color:#666;">邮箱</td><td style="padding:8px;"><a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a></td></tr>
          ${lead.company ? `<tr><td style="padding:8px;color:#666;">公司</td><td style="padding:8px;">${esc(lead.company)}</td></tr>` : ''}
        </table>
        <p style="margin-top:20px;font-size:13px;color:#999;">请登录后台查看完整信息。</p>
      </div>
    `,
  });
}

export async function sendEmailOtp(email: string, code: string): Promise<void> {
  if (env.NODE_ENV !== 'production') {
    console.log(`[EMAIL OTP] 邮箱: ${email} | 验证码: ${code}`);
    return;
  }

  await getTransporter().sendMail({
    from: `"验证码" <${env.SMTP_USER}>`,
    to: email,
    subject: '您的登录验证码',
    html: `
      <div style="max-width:400px;margin:0 auto;padding:32px;font-family:sans-serif;">
        <h2 style="color:#333;margin-bottom:16px;">登录验证码</h2>
        <p style="color:#666;margin-bottom:24px;">您的验证码为：</p>
        <div style="background:#f5f5f5;border-radius:8px;padding:16px;text-align:center;font-size:32px;letter-spacing:8px;font-weight:bold;color:#333;">
          ${esc(code)}
        </div>
        <p style="color:#999;margin-top:24px;font-size:13px;">验证码 5 分钟内有效，请勿泄露给他人。</p>
      </div>
    `,
  });
}
