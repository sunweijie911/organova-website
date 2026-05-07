// 原生深合并，替代 lodash-es/merge
function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>,
): T {
  const result = { ...target };
  for (const key in source) {
    const sv = source[key];
    if (
      sv !== null &&
      typeof sv === 'object' &&
      !Array.isArray(sv) &&
      typeof result[key] === 'object'
    ) {
      result[key] = deepMerge(result[key], sv as any);
    } else if (sv !== undefined) {
      result[key] = sv as any;
    }
  }
  return result;
}

// ==================== Schema 类型定义 ====================

export interface IBaseSchema {
  title: string;
  description?: string;
  span?: number;
}

export interface IStringSchema extends IBaseSchema {
  type: 'string';
  inputType?:
    | 'text'
    | 'password'
    | 'textarea'
    | 'color'
    | 'url'
    | 'image'
    | 'file'
    | 'date'
    | 'time'
    | 'datetime'
    | 'daterange'
    | 'datetimerange'
    | 'radio'
    | 'i18n';
  accept?: string;
  enumType?: readonly string[];
  /** image / file 类型上传到 /api/upload 时的 module，默认 'portal' */
  uploadModule?: 'portal' | 'avatars' | 'misc';
  defaultValue?: string | Record<string, string>;
}

export interface INumberSchema extends IBaseSchema {
  type: 'number';
  inputType?: 'input' | 'slider' | 'rate';
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
}

export interface IBooleanSchema extends IBaseSchema {
  type: 'boolean';
  defaultValue?: boolean;
}

export interface IArraySchema extends IBaseSchema {
  type: 'array';
  items: JsonSchema;
  enumType?: readonly string[];
  inputType?: 'checkbox';
  defaultValue?: readonly any[];
}

export interface IObjectSchema extends IBaseSchema {
  type: 'object';
  properties: Record<string, JsonSchema>;
}

export type JsonSchema =
  | IStringSchema
  | INumberSchema
  | IBooleanSchema
  | IArraySchema
  | IObjectSchema;

/** 顶层 section 均为 object，FrontendSchema 约束整体结构 */
export type FrontendSchema = Record<string, IObjectSchema>;

// ==================== 类型推断 ====================

export type InferValue<T> = T extends { type: infer Type }
  ? Type extends 'string'
    ? T extends { inputType: 'i18n' }
      ? Record<string, string>
      : string
    : Type extends 'number'
      ? number
      : Type extends 'boolean'
        ? boolean
        : Type extends 'array'
          ? T extends { items: infer I }
            ? Array<InferValue<I>>
            : never
          : Type extends 'object'
            ? T extends { properties: infer P }
              ? { [K in keyof P]: InferValue<P[K]> }
              : never
            : never
  : never;

export function extractDefaults<T extends Record<string, JsonSchema>>(
  schema: T,
): { [K in keyof T]: InferValue<T[K]> } {
  const result: Record<string, any> = {};
  for (const [key, s] of Object.entries(schema)) {
    if (s.type === 'object') {
      result[key] = extractDefaults(s.properties);
    } else {
      result[key] = s.defaultValue;
    }
  }
  return result as { [K in keyof T]: InferValue<T[K]> };
}

// ==================== 配置实例 ====================

import { frontendConfigSchema } from '@/constants/frontend-config';

export const defaultFrontendConfig = extractDefaults(frontendConfigSchema);
export type FrontendConfig = typeof defaultFrontendConfig;

export function mergeConfig(
  customConfig: Partial<FrontendConfig> = {},
): FrontendConfig {
  return deepMerge(defaultFrontendConfig as FrontendConfig, customConfig);
}
