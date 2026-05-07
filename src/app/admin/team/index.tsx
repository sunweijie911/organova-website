'use client';

import {
  Avatar,
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
import { EllipsisCell } from '@/components/EllipsisCell';
import { ImageUploader } from '@/components/ImageUploader';
import { RichTextEditor } from '@/components/RichTextEditor';
import { api, type RouterOutputs } from '@/lib/trpc/react';
import {
  TEAM_GROUP_LABELS,
  TEAM_GROUP_SHORT_LABELS,
  TEAM_GROUP_TAG_COLORS,
  TEAM_GROUPS,
  toSelectOptions,
} from '@/types/enums';

type Member = RouterOutputs['team']['adminList'][number];

export default function AdminTeamView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [photo, setPhoto] = useState('');
  const [fullBio, setFullBio] = useState('');
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = api.team.adminList.useQuery();

  const create = api.team.adminCreate.useMutation({
    onSuccess: () => {
      message.success('已添加');
      setModalOpen(false);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });

  const update = api.team.adminUpdate.useMutation({
    onSuccess: () => {
      message.success('已保存');
      setModalOpen(false);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });

  const del = api.team.adminDelete.useMutation({
    onSuccess: () => {
      message.success('已删除');
      void refetch();
    },
    onError: () => message.error('删除失败'),
  });

  const updateSort = api.team.adminUpdateSort.useMutation({
    onError: () => message.error('排序保存失败'),
  });

  const handleOrderChange = useCallback(
    (newRows: Member[]) => {
      updateSort.mutate(newRows.map((r, i) => ({ id: r.id, sortOrder: i })));
    },
    [updateSort],
  );

  const openCreate = () => {
    setEditing(null);
    setPhoto('');
    setFullBio('');
    form.resetFields();
    form.setFieldsValue({ group: 'tricbio', sortOrder: 0 });
    setModalOpen(true);
  };

  const openEdit = (r: Member) => {
    setEditing(r);
    setPhoto(r.photo ?? '');
    setFullBio(r.fullBio ?? '');
    form.setFieldsValue(r);
    setModalOpen(true);
  };

  const handleSubmit = (vals: Record<string, unknown>) => {
    const payload = {
      ...vals,
      photo: photo || undefined,
      fullBio,
      isVisible: editing?.isVisible ?? true,
    };
    if (editing) {
      update.mutate({ id: editing.id, ...payload } as Parameters<
        typeof update.mutate
      >[0]);
    } else {
      create.mutate(payload as Parameters<typeof create.mutate>[0]);
    }
  };

  const columns: ColumnsType<Member> = [
    {
      title: '#',
      width: 56,
      align: 'center',
      render: (_, __, idx) => idx + 1,
    },
    {
      title: '头像',
      dataIndex: 'photo',
      width: 56,
      render: (v: string | null, r: Member) => (
        <Avatar size={36} src={v ?? undefined}>
          {r.name[0]}
        </Avatar>
      ),
    },
    { title: '姓名', dataIndex: 'name', width: 180 },
    {
      title: '职位',
      dataIndex: 'title',
      ellipsis: { showTitle: false },
      render: (v: string | null) => <EllipsisCell value={v} />,
    },
    {
      title: '团队',
      dataIndex: 'group',
      width: 100,
      render: (v: Member['group']) => (
        <Tag color={TEAM_GROUP_TAG_COLORS[v]}>{TEAM_GROUP_SHORT_LABELS[v]}</Tag>
      ),
    },
    {
      title: '显示',
      dataIndex: 'isVisible',
      width: 70,
      render: (v: boolean, r: Member) => (
        <Switch
          checked={v}
          onChange={(checked) =>
            update.mutate({
              ...r,
              isVisible: checked,
              photo: r.photo ?? undefined,
              shortBio: r.shortBio ?? undefined,
              fullBio: r.fullBio ?? undefined,
            })
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
          + 添加成员
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
        title={editing ? '编辑成员' : '添加成员'}
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item label="头像">
            <ImageUploader
              module="portal"
              onChange={(url) => setPhoto(url ?? '')}
              value={photo}
            />
          </Form.Item>
          <Form.Item
            label="姓名（含学位，如 Wei He, PhD）"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="职位" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="简短背景（卡片显示）" name="shortBio">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="完整 Bio（点击展开，富文本）">
            <RichTextEditor
              defaultValue={fullBio}
              key={editing?.id ?? 'new'}
              onChange={setFullBio}
            />
          </Form.Item>
          <Form.Item label="所属团队" name="group" rules={[{ required: true }]}>
            <Select options={toSelectOptions(TEAM_GROUPS, TEAM_GROUP_LABELS)} />
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
