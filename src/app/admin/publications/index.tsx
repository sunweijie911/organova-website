'use client';

import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Switch,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';
import { DraggableTable } from '@/components/DraggableTable';
import { EllipsisCell } from '@/components/EllipsisCell';
import { api, type RouterOutputs } from '@/lib/trpc/react';

type Pub = RouterOutputs['publications']['adminList'][number];

export default function AdminPublicationsView() {
  const { message, modal } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Pub | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = api.publications.adminList.useQuery();

  const create = api.publications.adminCreate.useMutation({
    onSuccess: () => {
      message.success('已添加');
      setModalOpen(false);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });

  const update = api.publications.adminUpdate.useMutation({
    onSuccess: () => {
      message.success('已保存');
      setModalOpen(false);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });

  const del = api.publications.adminDelete.useMutation({
    onSuccess: () => {
      message.success('已删除');
      void refetch();
    },
    onError: () => message.error('删除失败'),
  });

  const updateSort = api.publications.adminUpdateSort.useMutation({
    onError: () => message.error('排序保存失败'),
  });

  const toggleVisible = api.publications.adminToggleVisible.useMutation({
    onSuccess: () => void refetch(),
    onError: () => message.error('切换显示失败'),
  });

  const handleOrderChange = useCallback(
    (newRows: Pub[]) => {
      updateSort.mutate(newRows.map((r, i) => ({ id: r.id, sortOrder: i })));
    },
    [updateSort],
  );

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      year: new Date().getFullYear(),
      isVisible: true,
      sortOrder: data?.length ?? 0,
    });
    setModalOpen(true);
  };

  const openEdit = (r: Pub) => {
    setEditing(r);
    form.setFieldsValue(r);
    setModalOpen(true);
  };

  const handleSubmit = (vals: Record<string, unknown>) => {
    const payload = {
      ...vals,
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

  const handleDelete = (r: Pub) => {
    modal.confirm({
      title: '确认删除？',
      content: r.title,
      okType: 'danger',
      onOk: () => del.mutate({ id: r.id }),
    });
  };

  const columns: ColumnsType<Pub> = [
    {
      title: '#',
      width: 56,
      align: 'center',
      render: (_, __, idx) => idx + 1,
    },
    { title: '年份', dataIndex: 'year', width: 80 },
    {
      title: '期刊',
      dataIndex: 'journal',
      width: 180,
      ellipsis: { showTitle: false },
      render: (v: string) => <EllipsisCell value={v} />,
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: { showTitle: false },
      render: (v: string) => <EllipsisCell value={v} />,
    },
    {
      title: '作者',
      dataIndex: 'authors',
      width: 200,
      ellipsis: { showTitle: false },
      render: (v: string) => <EllipsisCell value={v} />,
    },
    { title: '引用', dataIndex: 'citationCount', width: 80 },
    {
      title: '显示',
      dataIndex: 'isVisible',
      width: 70,
      render: (v: boolean, r: Pub) => (
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
      width: 110,
      render: (_, r) => (
        <Space>
          <Button onClick={() => openEdit(r)} size="small" type="link">
            编辑
          </Button>
          <Button
            danger
            onClick={() => handleDelete(r)}
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
          + 添加出版物
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
        title={editing ? '编辑出版物' : '添加出版物'}
        width={640}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item label="年份" name="year" rules={[{ required: true }]}>
            <InputNumber max={2100} min={1900} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="期刊名称"
            name="journal"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="论文标题" name="title" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="作者" name="authors" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="引用数（如 1,400+，空时填 —）" name="citationCount">
            <Input />
          </Form.Item>
          <Form.Item label="DOI / 外部链接" name="doi">
            <Input />
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
