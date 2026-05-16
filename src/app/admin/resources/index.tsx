'use client';

import { App, Button, Form, Input, Modal, Select, Space, Switch } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';
import { DraggableTable } from '@/components/DraggableTable';
import { EllipsisCell } from '@/components/EllipsisCell';
import { ImageUploader } from '@/components/ImageUploader';
import { api, type RouterOutputs } from '@/lib/trpc/react';
import {
  RESOURCE_CTA_TYPE_LABELS,
  RESOURCE_CTA_TYPES,
  toSelectOptions,
} from '@/types/enums';

type Resource = RouterOutputs['resources']['adminList'][number];

export default function AdminResourcesView() {
  const { message, modal } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [fileUrl, setFileUrl] = useState('');
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = api.resources.adminList.useQuery();

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

  const toggleVisible = api.resources.adminToggleVisible.useMutation({
    onSuccess: () => void refetch(),
    onError: () => message.error('切换显示失败'),
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
    // 按 ctaType 清理无关字段，避免切换类型后旧 fileUrl/externalUrl 残留为脏数据
    const ctaType = vals.ctaType as string;
    const payload = {
      ...vals,
      fileUrl: ctaType === 'download' ? fileUrl || null : null,
      externalUrl:
        ctaType === 'link' ? (vals.externalUrl as string) || null : null,
      isVisible: editing?.isVisible ?? true,
      // 表单未注册 sortOrder，编辑时显式带回原值，避免被 zod default(0) 重置
      sortOrder: editing?.sortOrder ?? data?.length ?? 0,
    };
    if (editing) {
      update.mutate({ id: editing.id, ...payload } as Parameters<
        typeof update.mutate
      >[0]);
    } else {
      create.mutate(payload as Parameters<typeof create.mutate>[0]);
    }
  };

  const columns: ColumnsType<Resource> = [
    {
      title: '#',
      width: 56,
      align: 'center',
      render: (_, __, idx) => idx + 1,
    },
    {
      title: '资源名称',
      dataIndex: 'name',
      ellipsis: { showTitle: false },
      render: (v: string) => <EllipsisCell value={v} />,
    },
    {
      title: '类型',
      dataIndex: 'ctaType',
      width: 100,
      render: (v: Resource['ctaType']) => RESOURCE_CTA_TYPE_LABELS[v] ?? v,
    },
    {
      title: '显示',
      dataIndex: 'isVisible',
      width: 70,
      render: (v: boolean, r: Resource) => (
        <Switch
          checked={v}
          onChange={(checked) =>
            toggleVisible.mutate({ id: r.id, isVisible: checked })
          }
          size="small"
        />
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
              modal.confirm({
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
        loading={isLoading}
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
              options={toSelectOptions(
                RESOURCE_CTA_TYPES,
                RESOURCE_CTA_TYPE_LABELS,
              )}
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
                    accept="pdf"
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
