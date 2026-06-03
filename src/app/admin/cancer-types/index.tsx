'use client';

import { App, Button, Form, Input, Modal, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';
import { DraggableTable } from '@/components/DraggableTable';
import { ImageUploader } from '@/components/ImageUploader';
import { RichTextEditor } from '@/components/RichTextEditor';
import { api, type RouterOutputs } from '@/lib/trpc/react';

type CancerType = RouterOutputs['cancerTypes']['adminList'][number];

export default function AdminCancerTypesView() {
  const { message, modal } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CancerType | null>(null);
  const [coverImage, setCoverImage] = useState('');
  const [validatedApps, setValidatedApps] = useState('');
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = api.cancerTypes.adminList.useQuery();

  const create = api.cancerTypes.adminCreate.useMutation({
    onSuccess: () => {
      message.success('已添加');
      setModalOpen(false);
      void refetch();
    },
    onError: (e) => message.error(e.message || '操作失败'),
  });

  const update = api.cancerTypes.adminUpdate.useMutation({
    onSuccess: () => {
      message.success('已保存');
      setModalOpen(false);
      void refetch();
    },
    onError: (e) => message.error(e.message || '操作失败'),
  });

  const del = api.cancerTypes.adminDelete.useMutation({
    onSuccess: () => {
      message.success('已删除');
      void refetch();
    },
    onError: () => message.error('删除失败'),
  });

  const togglePublish = api.cancerTypes.adminTogglePublish.useMutation({
    onSuccess: () => void refetch(),
    onError: () => message.error('操作失败'),
  });

  const updateSort = api.cancerTypes.adminUpdateSort.useMutation({
    onError: () => message.error('排序保存失败'),
  });

  const handleOrderChange = useCallback(
    (newRows: CancerType[]) => {
      updateSort.mutate(newRows.map((r, i) => ({ id: r.id, sortOrder: i })));
    },
    [updateSort],
  );

  const openCreate = () => {
    setEditing(null);
    setCoverImage('');
    setValidatedApps('');
    form.resetFields();
    form.setFieldsValue({ sortOrder: data?.length ?? 0 });
    setModalOpen(true);
  };

  const openEdit = (r: CancerType) => {
    setEditing(r);
    setCoverImage(r.coverImage ?? '');
    setValidatedApps(r.validatedApplications ?? '');
    form.setFieldsValue(r);
    setModalOpen(true);
  };

  const handleSubmit = (vals: Record<string, unknown>) => {
    const payload = {
      ...vals,
      coverImage: coverImage || null,
      validatedApplications: validatedApps,
      // 编辑时保留原有上线状态；新增时默认为草稿
      isPublished: editing?.isPublished ?? false,
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

  const columns: ColumnsType<CancerType> = [
    {
      title: '#',
      width: 56,
      align: 'center',
      render: (_, __, idx) => idx + 1,
    },
    {
      title: '封面',
      dataIndex: 'coverImage',
      width: 60,
      render: (v: string | null) =>
        v ? (
          <img
            alt=""
            src={v}
            style={{
              width: 44,
              height: 28,
              objectFit: 'cover',
              borderRadius: 4,
            }}
          />
        ) : (
          <div
            style={{
              width: 44,
              height: 28,
              background: '#f5f5f5',
              borderRadius: 4,
            }}
          />
        ),
    },
    { title: '癌种名称', dataIndex: 'name', width: 220 },
    { title: 'Slug', dataIndex: 'slug', width: 180 },
    { title: '模型数量', dataIndex: 'modelCount', width: 130 },
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
      width: 170,
      render: (_, r) => (
        <Space>
          <Button onClick={() => openEdit(r)} size="small" type="link">
            编辑
          </Button>
          <Button
            onClick={() =>
              modal.confirm({
                title: r.isPublished ? '确认下线？' : '确认上线？',
                content: r.name,
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
          + 添加癌种
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
        styles={{
          body: { maxHeight: '72vh', overflowY: 'auto', paddingRight: 8 },
        }}
        title={editing ? '编辑癌种' : '添加癌种'}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="癌种名称（英文）"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Liver Cancer (HCC / ICC)" />
          </Form.Item>
          <Form.Item
            label="URL Slug（生成 /tumor-types/[slug]）"
            name="slug"
            rules={[
              { required: true },
              {
                pattern: /^[a-z0-9-]+$/,
                message: '只能包含小写字母、数字和连字符',
              },
            ]}
          >
            <Input placeholder="liver-cancer" />
          </Form.Item>
          <Form.Item label="封面图片">
            <ImageUploader
              module="portal"
              onChange={(url) => setCoverImage(url ?? '')}
              value={coverImage}
            />
          </Form.Item>
          <Form.Item
            extra="多行将分行展示在卡片上，每行回车换行。例如：300+ (China) ⏎ 190 (US)"
            label="模型数量（卡片展示）"
            name="modelCount"
          >
            <Input.TextArea
              autoSize={{ minRows: 1, maxRows: 4 }}
              placeholder={'300+ (China)\n190 (US)'}
            />
          </Form.Item>
          <Form.Item label="可用格式" name="formats">
            <Input placeholder="PDO 1.0 & 2.0" />
          </Form.Item>
          <Form.Item label="子页标题" name="subpageTitle">
            <Input placeholder="Liver Cancer: HCC & ICC Models" />
          </Form.Item>
          <Form.Item label="模型数量详述（子页）" name="modelCountDetail">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="验证方式" name="validationMethods">
            <Input placeholder="H&E、IHC、NGS，配完整临床注释" />
          </Form.Item>
          <Form.Item label="已验证应用（富文本）">
            <RichTextEditor
              defaultValue={validatedApps}
              key={editing?.id ?? 'new'}
              onChange={setValidatedApps}
            />
          </Form.Item>
          <Form.Item label="临床相关性数据" name="clinicalCorrelation">
            <Input placeholder="78.95% 临床相关性" />
          </Form.Item>
          <Form.Item label="CTA 1 文字" name="cta1Label">
            <Input placeholder="Read the HCC/ICC Co-clinical Case Study" />
          </Form.Item>
          <Form.Item label="CTA 1 链接" name="cta1Url">
            <Input placeholder="/case-studies/liver-cancer-co-clinical" />
          </Form.Item>
          <Form.Item label="CTA 2 文字" name="cta2Label">
            <Input placeholder="Request Liver Cancer Models" />
          </Form.Item>
          <Form.Item label="CTA 2 链接" name="cta2Url">
            <Input placeholder="/request-quote" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
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
