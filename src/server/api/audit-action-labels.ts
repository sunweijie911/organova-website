// 操作类型 → 中文名称映射（前后端共用，不可引入 server-only 模块）
// 凡新增 adminProcedure 的 mutation 都应在此登记，否则审计日志 UI 会显示原始 path。
export const ACTION_LABELS: Record<string, string> = {
  // 系统管理（sys）
  'sys.createUser': '创建用户',
  'sys.deleteUser': '删除用户',
  'sys.exportAuditLogs': '导出审计日志',
  'sys.purgeAuditLogs': '清理审计日志',
  'sys.setAuditPurgeConfig': '设置日志清理策略',

  // 门户配置（page）
  'page.saveFrontendConfig': '保存门户配置',

  // 用户咨询（leads）
  'leads.adminExportAll': '导出咨询线索',
  'leads.adminUpdateStatus': '更新线索状态',

  // 案例研究（caseStudies）
  'caseStudies.adminCreate': '创建案例研究',
  'caseStudies.adminUpdate': '更新案例研究',
  'caseStudies.adminDelete': '删除案例研究',
  'caseStudies.adminTogglePublish': '切换案例研究发布状态',
  'caseStudies.adminUpdateSort': '调整案例研究排序',
  'caseStudies.adminSetFilterTags': '设置案例研究筛选标签',

  // 出版物（publications）
  'publications.adminCreate': '创建出版物',
  'publications.adminUpdate': '更新出版物',
  'publications.adminDelete': '删除出版物',
  'publications.adminToggleVisible': '切换出版物可见性',
  'publications.adminUpdateSort': '调整出版物排序',

  // 新闻（news）
  'news.adminCreate': '创建新闻',
  'news.adminUpdate': '更新新闻',
  'news.adminDelete': '删除新闻',
  'news.adminTogglePublish': '切换新闻发布状态',

  // 资源下载（resources）
  'resources.adminCreate': '创建资源',
  'resources.adminUpdate': '更新资源',
  'resources.adminDelete': '删除资源',
  'resources.adminToggleVisible': '切换资源可见性',
  'resources.adminUpdateSort': '调整资源排序',

  // FAQ（faq）
  'faq.adminCreateCategory': '创建 FAQ 分类',
  'faq.adminUpdateCategory': '更新 FAQ 分类',
  'faq.adminDeleteCategory': '删除 FAQ 分类',
  'faq.adminCreateItem': '创建 FAQ 条目',
  'faq.adminUpdateItem': '更新 FAQ 条目',
  'faq.adminDeleteItem': '删除 FAQ 条目',
  'faq.adminToggleItemVisible': '切换 FAQ 条目可见性',
  'faq.adminUpdateCategorySort': '调整 FAQ 分类排序',
  'faq.adminUpdateItemSort': '调整 FAQ 条目排序',

  // 团队成员（team）
  'team.adminCreate': '创建团队成员',
  'team.adminUpdate': '更新团队成员',
  'team.adminDelete': '删除团队成员',
  'team.adminToggleVisible': '切换团队成员可见性',
  'team.adminUpdateSort': '调整团队成员排序',

  // 肿瘤类型（cancerTypes）
  'cancerTypes.adminCreate': '创建肿瘤类型',
  'cancerTypes.adminUpdate': '更新肿瘤类型',
  'cancerTypes.adminDelete': '删除肿瘤类型',
  'cancerTypes.adminTogglePublish': '切换肿瘤类型发布状态',
  'cancerTypes.adminUpdateSort': '调整肿瘤类型排序',
};
