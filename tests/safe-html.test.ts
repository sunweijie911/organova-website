import { describe, expect, it } from 'vitest';
import { sanitizeRichHtml } from '@/components/SafeHtml';
import { SANITIZE_CASES } from './sanitize-cases';

const EXPECTED: Record<string, string> = {
  richText:
    '<h2>Title</h2><p style="text-align: center"><strong>bold</strong> <em>i</em> <u>u</u> <s>s</s></p><ul><li>a</li></ul><ol><li>b</li></ol><blockquote>q</blockquote><pre><code>c</code></pre><hr>',
  script: '<p>a</p>',
  eventHandler: '<p class="lead">x</p>',
  imgOnerror: '',
  iframe: '<p>ok</p>',
  svg: '<p>ok</p>',
  styleTag: '<p>ok</p>',
  jsHref: '<a>x</a>',
  jsHrefObfuscated: '<a>x</a>',
  dataHref: '<a>x</a>',
  vbscriptHref: '<a>x</a>',
  httpsHref: '<a href="https://organova.bio/a?b=1" title="t">x</a>',
  mailtoTel: '<a href="mailto:a@b.c">m</a><a href="tel:+123">t</a>',
  relativeHref: '<a href="/contact">c</a><a href="#top">t</a>',
  targetBlank:
    '<a href="https://x.example" target="_blank" rel="noopener noreferrer">x</a>',
  mutationXssNamespace: '<p></p>',
  mutationXssNoscript: '<p></p>',
  formAction: 'x',
  empty: '',
};

const DANGEROUS = [
  /<script/i,
  /\bon[a-z]+=/i,
  /javascript:/i,
  /vbscript:/i,
  /data:/i,
  /<iframe/i,
  /<img/i,
  /<svg/i,
  /<style/i,
  /<form/i,
];

describe('sanitizeRichHtml', () => {
  it.each(Object.keys(SANITIZE_CASES))('%s 的输出与基线一致', (name) => {
    expect(sanitizeRichHtml(SANITIZE_CASES[name])).toBe(EXPECTED[name]);
  });

  it.each(Object.keys(SANITIZE_CASES))(
    '%s 的输出不含危险标签、事件与协议',
    (name) => {
      const out = sanitizeRichHtml(SANITIZE_CASES[name]);
      for (const re of DANGEROUS) expect(out).not.toMatch(re);
    },
  );

  it('target=_blank 链接强制 rel=noopener noreferrer', () => {
    expect(sanitizeRichHtml(SANITIZE_CASES.targetBlank)).toContain(
      'rel="noopener noreferrer"',
    );
  });

  it('null 与 undefined 返回空字符串', () => {
    expect(sanitizeRichHtml(null)).toBe('');
    expect(sanitizeRichHtml(undefined)).toBe('');
  });
});
