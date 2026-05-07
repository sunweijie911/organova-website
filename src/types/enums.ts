// 业务枚举集中定义。
// drizzle schema 字段为 varchar，值域不在 DB 层约束；
// zod schema、admin Select、Tag 颜色 / Label 都从这里派生，避免漂移。

export const LEAD_SOURCES = ['contact', 'rfq'] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];
export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  contact: 'Contact',
  rfq: 'RFQ',
};
export const LEAD_SOURCE_TAG_COLORS: Record<LeadSource, string> = {
  contact: 'purple',
  rfq: 'geekblue',
};

export const LEAD_STATUSES = ['new', 'following', 'closed'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: '新建',
  following: '跟进中',
  closed: '已关闭',
};
export const LEAD_STATUS_BADGE_COLORS: Record<LeadStatus, string> = {
  new: 'blue',
  following: 'orange',
  closed: 'default',
};

export const TEAM_GROUPS = ['tricbio', 'organova'] as const;
export type TeamGroup = (typeof TEAM_GROUPS)[number];
export const TEAM_GROUP_LABELS: Record<TeamGroup, string> = {
  tricbio: 'TRiCBiO (Nanjing/Shanghai)',
  organova: 'OrgaNova (Philadelphia)',
};
export const TEAM_GROUP_SHORT_LABELS: Record<TeamGroup, string> = {
  tricbio: 'TRiCBiO',
  organova: 'OrgaNova',
};
export const TEAM_GROUP_TAG_COLORS: Record<TeamGroup, string> = {
  tricbio: 'purple',
  organova: 'blue',
};

export const RESOURCE_CTA_TYPES = ['download', 'link', 'contact'] as const;
export type ResourceCtaType = (typeof RESOURCE_CTA_TYPES)[number];
export const RESOURCE_CTA_TYPE_LABELS: Record<ResourceCtaType, string> = {
  download: '下载 PDF',
  link: '外部链接',
  contact: '联系我们',
};

// 把 enum 数组转成 antd Select options
export function toSelectOptions<T extends string>(
  values: readonly T[],
  labels: Record<T, string>,
): { value: T; label: string }[] {
  return values.map((v) => ({ value: v, label: labels[v] }));
}
