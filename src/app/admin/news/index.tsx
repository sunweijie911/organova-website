'use client';

import {
  App,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useState } from 'react';
import { EllipsisCell } from '@/components/EllipsisCell';
import { ImageUploader } from '@/components/ImageUploader';
import { RichTextEditor } from '@/components/RichTextEditor';
import { api, type RouterOutputs } from '@/lib/trpc/react';

type NewsItem = RouterOutputs['news']['adminList']['items'][number];

export default function AdminNewsView() {
  const { message, modal } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [coverImage, setCoverImage] = useState<string>('');
  const [content, setContent] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = api.news.adminList.useQuery({
    page,
    pageSize,
  });

  const create = api.news.adminCreate.useMutation({
    onSuccess: () => {
      message.success('已添加');
      setModalOpen(false);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });

  const update = api.news.adminUpdate.useMutation({
    onSuccess: () => {
      message.success('已保存');
      setModalOpen(false);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });

  const del = api.news.adminDelete.useMutation({
    onSuccess: () => {
      message.success('已删除');
      void refetch();
    },
    onError: () => message.error('删除失败'),
  });

  const togglePublish = api.news.adminTogglePublish.useMutation({
    onSuccess: () => void refetch(),
    onError: () => message.error('操作失败'),
  });

  const openCreate = () => {
    setEditing(null);
    setCoverImage('');
    setContent('');
    form.resetFields();
    form.setFieldsValue({ publishedAt: dayjs() });
    setModalOpen(true);
  };

  const openEdit = (r: NewsItem) => {
    setEditing(r);
    setCoverImage(r.coverImage ?? '');
    setContent(r.content ?? '');
    form.setFieldsValue({ ...r, publishedAt: dayjs(r.publishedAt) });
    setModalOpen(true);
  };

  const handleSubmit = (vals: Record<string, unknown>) => {
    const payload = {
      ...vals,
      publishedAt: (vals.publishedAt as dayjs.Dayjs).toDate(),
      content,
      coverImage: coverImage || null,
      isPublished: editing?.isPublished ?? false,
    };
    if (editing) {
      update.mutate({ id: editing.id, ...payload } as Parameters<
        typeof update.mutate
      >[0]);
    } else {
      create.mutate(payload as Parameters<typeof create.mutate>[0]);
    }
  };

  const handleDelete = (r: NewsItem) => {
    modal.confirm({
      title: '确认删除？',
      content: r.title,
      okType: 'danger',
      onOk: () => del.mutate({ id: r.id }),
    });
  };

  const columns: ColumnsType<NewsItem> = [
    {
      title: '#',
      width: 56,
      align: 'center',
      render: (_, __, idx) => (page - 1) * pageSize + idx + 1,
    },
    {
      title: '封面',
      dataIndex: 'coverImage',
      width: 72,
      render: (v: string | null) =>
        v ? (
          <img
            alt=""
            src={v}
            style={{
              width: 48,
              height: 32,
              objectFit: 'cover',
              borderRadius: 4,
            }}
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 32,
              background: '#f0f0f0',
              borderRadius: 4,
            }}
          />
        ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: { showTitle: false },
      render: (v: string) => <EllipsisCell value={v} />,
    },
    {
      title: '发布日期',
      dataIndex: 'publishedAt',
      width: 130,
      render: (v: Date) => dayjs(v).format('YYYY-MM-DD'),
    },
    {
      title: '来源地',
      dataIndex: 'location',
      width: 160,
      ellipsis: { showTitle: false },
      render: (v: string | null) => <EllipsisCell value={v} />,
    },
    {
      title: '状态',
      dataIndex: 'isPublished',
      width: 80,
      render: (v: boolean) => (
        <Tag color={v ? 'success' : 'default'}>{v ? '已上线' : '草稿'}</Tag>
      ),
    },
    {
      title: '操作',
      width: 160,
      render: (_, r) => (
        <Space>
          <Button onClick={() => openEdit(r)} size="small" type="link">
            编辑
          </Button>
          <Button
            onClick={() =>
              modal.confirm({
                title: r.isPublished ? '确认下线？' : '确认上线？',
                content: r.title,
                okType: r.isPublished ? 'danger' : 'primary',
                onOk: () =>
                  togglePublish.mutate({
                    id: r.id,
                    isPublished: !r.isPublished,
                  }),
              })
            }
            size="small"
            type="link"
          >
            {r.isPublished ? '下线' : '上线'}
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
          + 添加 News
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.items ?? []}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total: data?.total ?? 0,
          onChange: setPage,
          showSizeChanger: false,
        }}
        rowKey="id"
        size="middle"
      />

      <Modal
        destroyOnHidden
        footer={null}
        onCancel={() => setModalOpen(false)}
        open={modalOpen}
        title={editing ? '编辑 News' : '添加 News'}
        width={760}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="发布日期"
            name="publishedAt"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="来源地（如 PHILADELPHIA, Penn.）" name="location">
            <Input />
          </Form.Item>
          <Form.Item label="封面图片">
            <ImageUploader
              module="portal"
              onChange={(url) => setCoverImage(url ?? '')}
              value={coverImage}
            />
          </Form.Item>
          <Form.Item label="正文内容">
            <RichTextEditor
              defaultValue={content}
              key={editing?.id ?? 'new'}
              onChange={setContent}
            />
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
