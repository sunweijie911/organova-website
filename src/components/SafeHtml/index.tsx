import DOMPurify from 'isomorphic-dompurify';

interface SafeHtmlProps {
  html: string;
  className?: string;
  as?: 'div' | 'span' | 'section' | 'article';
}

// 渲染来自富文本编辑器（Tiptap）的 HTML，统一走 DOMPurify 消毒，避免存储型 XSS
export default function SafeHtml({
  html,
  className,
  as = 'div',
}: SafeHtmlProps) {
  const Tag = as;
  const clean = DOMPurify.sanitize(html ?? '');
  return (
    <Tag
      className={className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: 已通过 DOMPurify 消毒
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
