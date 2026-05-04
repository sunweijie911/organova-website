'use client';

import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import CodeMirror from '@uiw/react-codemirror';
import {
  Button,
  Card,
  Checkbox,
  Col,
  ColorPicker,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Radio,
  Rate,
  Row,
  Segmented,
  Select,
  Slider,
  Space,
  Switch,
  TimePicker,
  theme,
  Upload,
  type UploadFile,
} from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  extractDefaults,
  type IObjectSchema,
  type IStringSchema,
  type JsonSchema,
} from '@/lib/frontend-config';
import type { LocaleKey } from '@/types/system';
import { LocaleList } from '@/types/system';

// ==================== 常量 ====================

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const localeKeys = Object.keys(LocaleList).filter((k) =>
  Number.isNaN(Number(k)),
) as LocaleKey[];
const localeLabels: Record<string, string> = {
  'zh-CN': '中文',
  'en-US': 'English',
};

// ==================== 子组件 ====================

function I18nField({
  value,
  onChange,
  disabled,
}: {
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
  disabled?: boolean;
}) {
  const [activeLang, setActiveLang] = useState<string>(
    localeKeys[0] ?? 'zh-CN',
  );
  return (
    <Space.Compact style={{ width: '100%' }}>
      <Segmented
        onChange={(v) => setActiveLang(v as string)}
        options={localeKeys.map((k) => ({
          value: k,
          label: localeLabels[k] || k,
        }))}
        size="middle"
        value={activeLang}
      />
      <Input
        disabled={disabled}
        onChange={(e) => onChange({ ...value, [activeLang]: e.target.value })}
        style={{ flex: 1 }}
        value={value[activeLang] ?? ''}
      />
    </Space.Compact>
  );
}

function ImagePreviewUpload({
  accept,
  fileList,
  disabled,
  hasValue,
  onRemove,
  onUpload,
}: {
  accept: string;
  fileList: UploadFile[];
  disabled?: boolean;
  hasValue: boolean;
  onRemove: () => void;
  onUpload: (file: File) => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <>
      <Upload
        accept={accept}
        beforeUpload={(file) => {
          onUpload(file);
          return false;
        }}
        disabled={disabled}
        fileList={fileList}
        listType="picture-card"
        maxCount={1}
        onPreview={() => setPreviewOpen(true)}
        onRemove={onRemove}
      >
        {!hasValue && (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>选择图片</div>
          </div>
        )}
      </Upload>
      {hasValue && (
        <Image
          preview={{ visible: previewOpen, onVisibleChange: setPreviewOpen }}
          src={fileList[0]?.url}
          style={{ display: 'none' }}
        />
      )}
    </>
  );
}

interface SchemaFieldsProps {
  schema: Record<string, JsonSchema>;
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  disabled?: boolean;
}

function SchemaFields({
  schema,
  value,
  onChange,
  disabled,
}: SchemaFieldsProps) {
  const handleFieldChange = (key: string, fieldValue: any) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const renderField = useCallback(
    (
      fieldSchema: JsonSchema,
      fieldValue: any,
      onFieldChange: (v: any) => void,
    ) => {
      switch (fieldSchema.type) {
        case 'string': {
          if (fieldSchema.enumType && fieldSchema.inputType === 'radio') {
            return (
              <Radio.Group
                buttonStyle="solid"
                disabled={disabled}
                onChange={(e) => onFieldChange(e.target.value)}
                options={fieldSchema.enumType.map((v) => ({
                  value: v,
                  label: v,
                }))}
                optionType="button"
                value={fieldValue}
              />
            );
          }
          if (fieldSchema.inputType === 'i18n') {
            const i18nValue = (
              fieldValue && typeof fieldValue === 'object' ? fieldValue : {}
            ) as Record<string, string>;
            return (
              <I18nField
                disabled={disabled}
                onChange={onFieldChange}
                value={i18nValue}
              />
            );
          }
          if (fieldSchema.enumType) {
            return (
              <Select
                disabled={disabled}
                onChange={onFieldChange}
                options={fieldSchema.enumType.map((v) => ({
                  value: v,
                  label: v,
                }))}
                style={{ width: '100%' }}
                value={fieldValue}
              />
            );
          }
          if (fieldSchema.inputType === 'textarea') {
            return (
              <Input.TextArea
                disabled={disabled}
                onChange={(e) => onFieldChange(e.target.value)}
                rows={3}
                value={fieldValue}
              />
            );
          }
          if (fieldSchema.inputType === 'password') {
            return (
              <Input.Password
                disabled={disabled}
                onChange={(e) => onFieldChange(e.target.value)}
                value={fieldValue}
              />
            );
          }
          if (fieldSchema.inputType === 'color') {
            return (
              <ColorPicker
                disabled={disabled}
                onChange={(_, hex) => onFieldChange(hex)}
                showText
                value={fieldValue || undefined}
              />
            );
          }
          if (fieldSchema.inputType === 'image') {
            const imageFileList: UploadFile[] = fieldValue
              ? [{ uid: '-1', name: 'image', status: 'done', url: fieldValue }]
              : [];
            return (
              <ImagePreviewUpload
                accept={(fieldSchema as IStringSchema).accept || 'image/*'}
                disabled={disabled}
                fileList={imageFileList}
                hasValue={!!fieldValue}
                onRemove={() => onFieldChange('')}
                onUpload={(file) => {
                  if (file.size > MAX_UPLOAD_SIZE) {
                    void message.error(
                      `文件大小不能超过 ${MAX_UPLOAD_SIZE / 1024 / 1024}MB`,
                    );
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (e) =>
                    onFieldChange(e.target?.result as string);
                  reader.readAsDataURL(file);
                }}
              />
            );
          }
          if (fieldSchema.inputType === 'file') {
            return (
              <div>
                {fieldValue && (
                  <Space style={{ marginBottom: 8 }}>
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--ant-color-text-secondary)',
                      }}
                    >
                      已上传文件
                    </span>
                    <Button
                      danger
                      disabled={disabled}
                      icon={<DeleteOutlined />}
                      onClick={() => onFieldChange('')}
                      size="small"
                    />
                  </Space>
                )}
                <Upload
                  accept={(fieldSchema as IStringSchema).accept}
                  beforeUpload={(file) => {
                    if (file.size > MAX_UPLOAD_SIZE) {
                      void message.error(
                        `文件大小不能超过 ${MAX_UPLOAD_SIZE / 1024 / 1024}MB`,
                      );
                      return false;
                    }
                    const reader = new FileReader();
                    reader.onload = (e) =>
                      onFieldChange(e.target?.result as string);
                    reader.readAsDataURL(file);
                    return false;
                  }}
                  disabled={disabled}
                  showUploadList={false}
                >
                  <Button disabled={disabled} icon={<UploadOutlined />}>
                    选择文件
                  </Button>
                </Upload>
              </div>
            );
          }
          if (fieldSchema.inputType === 'url') {
            return (
              <Input
                disabled={disabled}
                onChange={(e) => onFieldChange(e.target.value)}
                placeholder="https://"
                type="url"
                value={fieldValue}
              />
            );
          }
          if (fieldSchema.inputType === 'date') {
            return (
              <DatePicker
                disabled={disabled}
                onChange={(_, d) => onFieldChange(d)}
                style={{ width: '100%' }}
                value={fieldValue ? dayjs(fieldValue) : null}
              />
            );
          }
          if (fieldSchema.inputType === 'time') {
            return (
              <TimePicker
                disabled={disabled}
                onChange={(_, t) => onFieldChange(t)}
                style={{ width: '100%' }}
                value={fieldValue ? dayjs(fieldValue, 'HH:mm:ss') : null}
              />
            );
          }
          if (fieldSchema.inputType === 'datetime') {
            return (
              <DatePicker
                disabled={disabled}
                onChange={(_, d) => onFieldChange(d)}
                showTime
                style={{ width: '100%' }}
                value={fieldValue ? dayjs(fieldValue) : null}
              />
            );
          }
          if (fieldSchema.inputType === 'daterange') {
            const dates = fieldValue ? String(fieldValue).split(',') : [];
            return (
              <DatePicker.RangePicker
                disabled={disabled}
                onChange={(_, ds) =>
                  onFieldChange(ds.filter(Boolean).join(','))
                }
                style={{ width: '100%' }}
                value={
                  dates.length === 2 && dates[0]
                    ? [dayjs(dates[0]), dayjs(dates[1] ?? '')]
                    : null
                }
              />
            );
          }
          if (fieldSchema.inputType === 'datetimerange') {
            const dates = fieldValue ? String(fieldValue).split(',') : [];
            return (
              <DatePicker.RangePicker
                disabled={disabled}
                onChange={(_, ds) =>
                  onFieldChange(ds.filter(Boolean).join(','))
                }
                showTime
                style={{ width: '100%' }}
                value={
                  dates.length === 2 && dates[0]
                    ? [dayjs(dates[0]), dayjs(dates[1] ?? '')]
                    : null
                }
              />
            );
          }
          return (
            <Input
              disabled={disabled}
              onChange={(e) => onFieldChange(e.target.value)}
              value={fieldValue}
            />
          );
        }

        case 'number': {
          if (fieldSchema.inputType === 'rate') {
            return (
              <Rate
                count={fieldSchema.max ?? 5}
                disabled={disabled}
                onChange={onFieldChange}
                value={fieldValue}
              />
            );
          }
          if (fieldSchema.inputType === 'slider') {
            return (
              <Slider
                disabled={disabled}
                max={fieldSchema.max ?? 100}
                min={fieldSchema.min ?? 0}
                onChange={onFieldChange}
                step={fieldSchema.step ?? 1}
                value={fieldValue}
              />
            );
          }
          return (
            <InputNumber
              disabled={disabled}
              max={fieldSchema.max}
              min={fieldSchema.min}
              onChange={(v) => onFieldChange(v ?? fieldSchema.defaultValue)}
              step={fieldSchema.step}
              style={{ width: '100%' }}
              value={fieldValue}
            />
          );
        }

        case 'boolean':
          return (
            <Switch
              checked={fieldValue}
              disabled={disabled}
              onChange={onFieldChange}
            />
          );

        case 'array': {
          const { items } = fieldSchema;
          const list = (fieldValue || []) as any[];

          if (
            items.type === 'string' &&
            fieldSchema.enumType &&
            fieldSchema.inputType === 'checkbox'
          ) {
            return (
              <Checkbox.Group
                disabled={disabled}
                onChange={onFieldChange as any}
                options={fieldSchema.enumType.map((v) => ({
                  value: v,
                  label: v,
                }))}
                value={list}
              />
            );
          }
          if (items.type === 'string' && fieldSchema.enumType) {
            return (
              <Select
                disabled={disabled}
                mode="multiple"
                onChange={onFieldChange}
                options={fieldSchema.enumType.map((v) => ({
                  value: v,
                  label: v,
                }))}
                style={{ width: '100%' }}
                value={list}
              />
            );
          }
          if (items.type === 'string') {
            return (
              <Select
                disabled={disabled}
                mode="tags"
                onChange={onFieldChange}
                placeholder="输入后回车添加"
                style={{ width: '100%' }}
                tokenSeparators={[',']}
                value={list}
              />
            );
          }

          const handleAdd = () => {
            const newItem =
              items.type === 'object'
                ? extractDefaults(items.properties)
                : items.type === 'number'
                  ? (items.defaultValue ?? 0)
                  : '';
            onFieldChange([...list, newItem]);
          };
          const handleRemove = (idx: number) =>
            onFieldChange(list.filter((_, i) => i !== idx));
          const handleItemChange = (idx: number, v: any) => {
            const next = [...list];
            next[idx] = v;
            onFieldChange(next);
          };

          if (items.type === 'number') {
            return (
              <div>
                {list.map((item, idx) => (
                  <Space key={idx} style={{ display: 'flex', marginBottom: 8 }}>
                    <InputNumber
                      disabled={disabled}
                      max={items.max}
                      min={items.min}
                      onChange={(v) => handleItemChange(idx, v ?? 0)}
                      step={items.step}
                      value={item}
                    />
                    <Button
                      danger
                      disabled={disabled}
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(idx)}
                      size="small"
                    />
                  </Space>
                ))}
                <Button
                  block
                  disabled={disabled}
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  type="dashed"
                >
                  添加
                </Button>
              </div>
            );
          }

          if (items.type === 'object') {
            return (
              <div>
                {list.map((item, idx) => (
                  <Card
                    extra={
                      <Button
                        danger
                        disabled={disabled}
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemove(idx)}
                        size="small"
                        type="text"
                      />
                    }
                    key={idx}
                    size="small"
                    style={{ marginBottom: 8 }}
                    title={`${items.title} ${idx + 1}`}
                  >
                    <SchemaFields
                      disabled={disabled}
                      onChange={(v) => handleItemChange(idx, v)}
                      schema={items.properties}
                      value={item || {}}
                    />
                  </Card>
                ))}
                <Button
                  block
                  disabled={disabled}
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  type="dashed"
                >
                  添加{items.title}
                </Button>
              </div>
            );
          }

          return null;
        }

        case 'object':
          return (
            <SchemaFields
              disabled={disabled}
              onChange={onFieldChange}
              schema={(fieldSchema as IObjectSchema).properties}
              value={fieldValue || {}}
            />
          );

        default:
          return <Input disabled value={String(fieldValue ?? '')} />;
      }
    },
    // biome-ignore lint/correctness/useExhaustiveDependencies: SchemaFields is module-level stable
    [disabled, SchemaFields],
  );

  return (
    <Row gutter={[16, 0]}>
      {Object.entries(schema).map(([key, fieldSchema]) => {
        const fieldValue =
          value[key] ??
          (fieldSchema.type !== 'object'
            ? fieldSchema.defaultValue
            : undefined);
        const isBlock =
          fieldSchema.type === 'object' ||
          (fieldSchema.type === 'array' && fieldSchema.items.type !== 'string');
        const span = fieldSchema.span ?? (isBlock ? 24 : 12);

        if (isBlock) {
          return (
            <Col key={key} span={span}>
              <Card
                size="small"
                style={{ marginBottom: 16 }}
                title={fieldSchema.title}
              >
                {fieldSchema.description && (
                  <p
                    style={{
                      color: 'var(--ant-color-text-tertiary)',
                      marginBottom: 12,
                    }}
                  >
                    {fieldSchema.description}
                  </p>
                )}
                {renderField(fieldSchema, fieldValue, (v) =>
                  handleFieldChange(key, v),
                )}
              </Card>
            </Col>
          );
        }

        return (
          <Col key={key} span={span}>
            <Form.Item
              label={fieldSchema.title}
              style={{ marginBottom: 16 }}
              tooltip={fieldSchema.description}
            >
              {renderField(fieldSchema, fieldValue, (v) =>
                handleFieldChange(key, v),
              )}
            </Form.Item>
          </Col>
        );
      })}
    </Row>
  );
}

function SchemaForm({
  schema,
  value,
  onChange,
  disabled,
}: {
  schema: Record<string, JsonSchema>;
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  disabled?: boolean;
}) {
  return (
    <Form layout="vertical" size="middle">
      <SchemaFields
        disabled={disabled}
        onChange={onChange}
        schema={schema}
        value={value}
      />
    </Form>
  );
}

// ==================== 主组件 ====================

type EditMode = 'visual' | 'code';

interface ConfigEditorProps {
  schema: Record<string, JsonSchema>;
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
}

export default function ConfigEditor({
  schema,
  value,
  onChange,
}: ConfigEditorProps) {
  const { token } = theme.useToken();
  const isDark =
    token.colorBgBase === '#141414' || token.colorBgBase === '#000';
  const [editMode, setEditMode] = useState<EditMode>('visual');
  const [jsonText, setJsonText] = useState('');
  const skipSyncRef = useRef(false);

  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }
    setJsonText(JSON.stringify(value, null, 2));
  }, [value]);

  const handleCodeChange = useCallback(
    (text: string) => {
      setJsonText(text);
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed === 'object' && parsed !== null) {
          skipSyncRef.current = true;
          onChange(parsed);
        }
      } catch {
        // JSON 不合法时不触发更新
      }
    },
    [onChange],
  );

  const handleModeChange = useCallback(
    (mode: EditMode) => {
      if (editMode === 'code' && mode === 'visual') {
        try {
          JSON.parse(jsonText);
        } catch {
          void message.error('请先修正 JSON 格式错误');
          return;
        }
      }
      if (mode === 'code') setJsonText(JSON.stringify(value, null, 2));
      setEditMode(mode);
    },
    [editMode, jsonText, value],
  );

  const codeExtensions = useMemo(() => [json()], []);

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Radio.Group
          buttonStyle="solid"
          onChange={(e) => handleModeChange(e.target.value as EditMode)}
          size="small"
          value={editMode}
        >
          <Radio.Button value="visual">可视模式</Radio.Button>
          <Radio.Button value="code">编辑模式</Radio.Button>
        </Radio.Group>
      </div>
      {editMode === 'visual' ? (
        <SchemaForm onChange={onChange} schema={schema} value={value} />
      ) : (
        <CodeMirror
          extensions={codeExtensions}
          height="calc(100vh - 320px)"
          onChange={handleCodeChange}
          style={{ borderRadius: 4, overflow: 'hidden' }}
          theme={isDark ? oneDark : undefined}
          value={jsonText}
        />
      )}
    </div>
  );
}
