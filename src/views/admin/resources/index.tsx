'use client';

import { Button, Card, Form, Input, message, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { api } from '@/lib/trpc/react';

type Resource = {
  id: number;
  name: string;
  description: string | null;
  ctaLabel: string | null;
  ctaType: string;
  fileUrl: string | null;
  externalUrl: string | null;
  isVisible: boolean;
  sortOrder: number;
};

function ResourceForm({
  resource,
  onSaved,
}: {
  resource: Resource;
  onSaved: () => void;
}) {
  const [form] = Form.useForm();
  const [fileUrl, setFileUrl] = useState(resource.fileUrl ?? '');

  useEffect(() => {
    form.setFieldsValue({ ...resource });
    setFileUrl(resource.fileUrl ?? '');
  }, [resource, form]);

  const update = api.resources.adminUpdate.useMutation({
    onSuccess: () => {
      message.success('已保存');
      onSaved();
    },
    onError: () => message.error('保存失败'),
  });

  const handleSubmit = (vals: Record<string, unknown>) => {
    update.mutate({
      id: resource.id,
      ...vals,
      fileUrl: fileUrl || undefined,
    } as Parameters<typeof update.mutate>[0]);
  };

  return (
    <Card size="small" title={`资源 ${resource.sortOrder} — ${resource.name}`}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="资源名称" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="说明文字" name="description">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="CTA 按钮文字" name="ctaLabel">
          <Input placeholder="Download PDF →" />
        </Form.Item>
        <Form.Item label="CTA 类型" name="ctaType" rules={[{ required: true }]}>
          <Select
            options={[
              { value: 'download', label: '下载 PDF' },
              { value: 'link', label: '外部链接' },
              { value: 'contact', label: '跳转 /contact' },
            ]}
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prev, cur) => prev.ctaType !== cur.ctaType}
        >
          {({ getFieldValue }) =>
            getFieldValue('ctaType') === 'download' ? (
              <Form.Item label="PDF 文件">
                <ImageUploader
                  module="portal"
                  onChange={(url) => setFileUrl(url ?? '')}
                  placeholder="点击上传 PDF 文件"
                  value={fileUrl}
                />
              </Form.Item>
            ) : getFieldValue('ctaType') === 'link' ? (
              <Form.Item label="外部链接 URL" name="externalUrl">
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item label="显示" name="isVisible" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button
            block
            htmlType="submit"
            loading={update.isPending}
            type="primary"
          >
            保存
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default function AdminResourcesView() {
  const { data, refetch } = api.resources.adminList.useQuery();

  return (
    <div
      style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div style={{ color: '#888', fontSize: 13 }}>
        共 3 条固定资源，对应 /publications 页面底部「Resources for Your
        Research」区块。
      </div>
      {data?.map((r) => (
        <ResourceForm
          key={r.id}
          onSaved={() => void refetch()}
          resource={r as Resource}
        />
      ))}
    </div>
  );
}
