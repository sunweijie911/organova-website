export const SANITIZE_CASES: Record<string, string> = {
  richText:
    '<h2>Title</h2><p style="text-align: center"><strong>bold</strong> <em>i</em> <u>u</u> <s>s</s></p><ul><li>a</li></ul><ol><li>b</li></ol><blockquote>q</blockquote><pre><code>c</code></pre><hr>',
  script: '<p>a</p><script>alert(1)</script>',
  eventHandler: '<p onclick="alert(1)" class="lead">x</p>',
  imgOnerror: '<img src=x onerror="alert(1)">',
  iframe: '<iframe src="https://evil.example"></iframe><p>ok</p>',
  svg: '<svg><script>alert(1)</script></svg><p>ok</p>',
  styleTag: '<style>body{display:none}</style><p>ok</p>',
  jsHref: '<a href="javascript:alert(1)">x</a>',
  jsHrefObfuscated: '<a href="JaVaScRiPt&#58;alert(1)">x</a>',
  dataHref:
    '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">x</a>',
  vbscriptHref: '<a href="vbscript:run(1)">x</a>',
  httpsHref: '<a href="https://organova.bio/a?b=1" title="t">x</a>',
  mailtoTel: '<a href="mailto:a@b.c">m</a><a href="tel:+123">t</a>',
  relativeHref: '<a href="/contact">c</a><a href="#top">t</a>',
  targetBlank: '<a href="https://x.example" target="_blank" rel="opener">x</a>',
  mutationXssNamespace:
    '<svg><p><style><img src=x onerror=alert(1)></style></p></svg>',
  mutationXssNoscript:
    '<noscript><p title="</noscript><img src=x onerror=alert(1)>">',
  formAction: '<form action="javascript:alert(1)"><button>x</button></form>',
  empty: '',
};
