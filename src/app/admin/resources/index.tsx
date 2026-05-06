'use client';

import {
  Button,
  Form,
  Input,
  Modal,
  message,
  Select,
  Space,
  Switch,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';
import { DraggableTable } from '@/components/DraggableTable';
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

const CTA_TYPE_LABELS: Record<string, string> = {
  download: '下载 PDF',
  link: '外部链接',
  contact: '联系我们',
};

export default function AdminResourcesView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [fileUrl, setFileUrl] = useState('');
  const [form] = Form.useForm();

  const { data, refetch } = api.resources.adminList.useQuery();

  const create = api.resources.adminCreate.useMutation({
    onSuccess: () => {
      message.success('已添加');
      setModalOpen(false);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });

  const update = api.resources.adminUpdate.useMutation({
    onSuccess: () => {
      message.success('已保存');
      setModalOpen(false);
      void refetch();
    },
    onError: () => message.error('保存失败'),
  });

  const del = api.resources.adminDelete.useMutation({
    onSuccess: () => {
      message.success('已删除');
      void refetch();
    },
    onError: () => message.error('删除失败'),
  });

  const updateSort = api.resources.adminUpdateSort.useMutation({
    onError: () => message.error('排序保存失败'),
  });

  const handleOrderChange = useCallback(
    (newRows: Resource[]) => {
      updateSort.mutate(newRows.map((r, i) => ({ id: r.id, sortOrder: i })));
    },
    [updateSort],
  );

  const openCreate = () => {
    setEditing(null);
    setFileUrl('');
    form.resetFields();
    form.setFieldsValue({
      isVisible: true,
      ctaType: 'download',
      sortOrder: data?.length ?? 0,
    });
    setModalOpen(true);
  };

  const openEdit = (r: Resource) => {
    setEditing(r);
    setFileUrl(r.fileUrl ?? '');
    form.setFieldsValue(r);
    setModalOpen(true);
  };

  const handleSubmit = (vals: Record<string, unknown>) => {
    const payload = { ...vals, fileUrl: fileUrl || undefined };
    if (editing) {
      update.mutate({ id: editing.id, ...payload } as Parameters<
        typeof update.mutate
      >[0]);
    } else {
      create.mutate(payload as Parameters<typeof create.mutate>[0]);
    }
  };

  const columns: ColumnsType<Resource> = [
    { title: '资源名称', dataIndex: 'name', ellipsis: true },
    {
      title: '类型',
      dataIndex: 'ctaType',
      width: 100,
      render: (v: string) => CTA_TYPE_LABELS[v] ?? v,
    },
    {
      title: '显示',
      dataIndex: 'isVisible',
      width: 70,
      render: (v: boolean) => (
        <Tag color={v ? 'success' : 'default'}>{v ? '显示' : '隐藏'}</Tag>
      ),
    },
    {
      title: '操作',
      width: 120,
      render: (_, r) => (
        <Space>
          <Button onClick={() => openEdit(r)} size="small" type="link">
            编辑
          </Button>
          <Button
            danger
            onClick={() =>
              Modal.confirm({
                title: '确认删除？',
                content: r.name,
                okType: 'danger',
                onOk: () => del.mutate({ id: r.id }),
              })
            }
            size="small"
            type="link"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={openCreate} type="primary">
          + 添加资源
        </Button>
      </div>

      <DraggableTable
        columns={columns}
        dataSource={data ?? []}
        onOrderChange={handleOrderChange}
        pagination={false}
        size="middle"
      />

      <Modal
        destroyOnHidden
        footer={null}
        onCancel={() => setModalOpen(false)}
        open={modalOpen}
        title={editing ? '编辑资源' : '添加资源'}
        width={640}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item label="资源名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="说明文字" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="CTA 按钮文字" name="ctaLabel">
            <Input placeholder="Download PDF →" />
          </Form.Item>
          <Form.Item
            label="CTA 类型"
            name="ctaType"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: 'download', label: '下载 PDF' },
                { value: 'link', label: '外部链接' },
                { value: 'contact', label: '联系我们' },
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
              loading={create.isPending || update.isPending}
              type="primary"
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
