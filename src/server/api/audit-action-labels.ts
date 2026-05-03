// 操作类型 → 中文名称映射（前后端共用，不可引入 server-only 模块）
export const ACTION_LABELS: Record<string, string> = {
  // 系统管理
  'sys.createUser': '创建用户',
  'sys.deleteUser': '删除用户',
  'sys.setConfig': '系统配置',
};
