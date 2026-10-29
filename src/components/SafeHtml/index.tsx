import DOMPurify from 'isomorphic-dompurify';

interface SafeHtmlProps {
  html: string;
  className?: string;
  as?: 'div' | 'span' | 'section' | 'article';
}

// 富文本允许的标签与属性白名单。覆盖 Tiptap StarterKit + Underline + TextAlign
// 输出，比 DOMPurify 默认更紧、且对未来扩展明确（图片/iframe 默认禁，需显式放行）。
const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'code',
  'hr',
  'a',
  'span',
  'div',
];
const ALLOWED_ATTR = ['href', 'title', 'target', 'rel', 'style', 'class'];

// 给所有 target="_blank" 链接强制注入 rel="noopener noreferrer"，
// 防止反向 tabnabbing（window.opener 攻击）。
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (
    node.tagName === 'A' &&
    (node as Element).getAttribute('target') === '_blank'
  ) {
    (node as Element).setAttribute('rel', 'noopener noreferrer');
  }
});

export function sanitizeRichHtml(html: string | null | undefined): string {
  return DOMPurify.sanitize(html ?? '', {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // 禁止 data:/javascript:/vbscript: 等危险协议；http/https/mailto/tel 默认允许
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
}

// 渲染来自富文本编辑器（Tiptap）的 HTML，统一走 DOMPurify 消毒，避免存储型 XSS
export default function SafeHtml({
  html,
  className,
  as = 'div',
}: SafeHtmlProps) {
  const Tag = as;
  const clean = sanitizeRichHtml(html);
  return (
    <Tag
      className={className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: 已通过 DOMPurify 消毒
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
