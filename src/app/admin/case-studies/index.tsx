'use client';

import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  message,
  Space,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useState } from 'react';
import { DraggableTable } from '@/components/DraggableTable';
import { EllipsisCell } from '@/components/EllipsisCell';
import { ImageUploader } from '@/components/ImageUploader';
import { RichTextEditor } from '@/components/RichTextEditor';
import { api, type RouterOutputs } from '@/lib/trpc/react';

type CS = RouterOutputs['caseStudies']['adminList'][number];

export default function AdminCaseStudiesView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CS | null>(null);
  const [coverImage, setCoverImage] = useState('');
  const [challenge, setChallenge] = useState('');
  const [approach, setApproach] = useState('');
  const [results, setResults] = useState('');
  const [implication, setImplication] = useState('');
  const [form] = Form.useForm();

  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const [editCancerTags, setEditCancerTags] = useState<string[]>([]);
  const [editAppTags, setEditAppTags] = useState<string[]>([]);
  const [newCancerTag, setNewCancerTag] = useState('');
  const [newAppTag, setNewAppTag] = useState('');

  const { data, isLoading, refetch } = api.caseStudies.adminList.useQuery();
  const { data: filterTags, refetch: refetchTags } =
    api.caseStudies.adminGetFilterTags.useQuery();

  const create = api.caseStudies.adminCreate.useMutation({
    onSuccess: () => {
      message.success('已添加');
      setModalOpen(false);
      void refetch();
    },
    onError: (e) => message.error(e.message || '操作失败'),
  });

  const update = api.caseStudies.adminUpdate.useMutation({
    onSuccess: () => {
      message.success('已保存');
      setModalOpen(false);
      void refetch();
    },
    onError: (e) => message.error(e.message || '操作失败'),
  });

  const del = api.caseStudies.adminDelete.useMutation({
    onSuccess: () => {
      message.success('已删除');
      void refetch();
    },
    onError: () => message.error('删除失败'),
  });

  const togglePublish = api.caseStudies.adminTogglePublish.useMutation({
    onSuccess: () => void refetch(),
    onError: () => message.error('操作失败'),
  });

  const updateSort = api.caseStudies.adminUpdateSort.useMutation({
    onError: () => message.error('排序保存失败'),
  });

  const handleOrderChange = useCallback(
    (newRows: CS[]) => {
      updateSort.mutate(newRows.map((r, i) => ({ id: r.id, sortOrder: i })));
    },
    [updateSort],
  );

  const setFilterTags = api.caseStudies.adminSetFilterTags.useMutation({
    onSuccess: () => {
      message.success('标签已保存');
      setTagsModalOpen(false);
      void refetchTags();
    },
    onError: () => message.error('保存失败'),
  });

  const openTagsModal = () => {
    setEditCancerTags(filterTags?.cancerTypeTags ?? []);
    setEditAppTags(filterTags?.applicationTags ?? []);
    setNewCancerTag('');
    setNewAppTag('');
    setTagsModalOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setCoverImage('');
    setChallenge('');
    setApproach('');
    setResults('');
    setImplication('');
    form.resetFields();
    form.setFieldsValue({
      sortOrder: data?.length ?? 0,
      cancerTypeTags: [],
      applicationTags: [],
    });
    setModalOpen(true);
  };

  const openEdit = (r: CS) => {
    setEditing(r);
    setCoverImage(r.coverImage ?? '');
    setChallenge(r.challenge ?? '');
    setApproach(r.approach ?? '');
    setResults(r.results ?? '');
    setImplication(r.implication ?? '');
    form.setFieldsValue(r);
    setModalOpen(true);
  };

  const handleSubmit = (vals: Record<string, unknown>) => {
    const payload = {
      ...vals,
      coverImage: coverImage || null,
      challenge,
      approach,
      results,
      implication,
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

  const columns: ColumnsType<CS> = [
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
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: { showTitle: false },
      render: (v: string) => <EllipsisCell value={v} />,
    },
    {
      title: '标签',
      dataIndex: 'cancerTypeTags',
      width: 180,
      render: (v: string[]) =>
        v.slice(0, 2).map((t) => (
          <Tag key={t} style={{ fontSize: 11 }}>
            {t}
          </Tag>
        )),
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
      width: 170,
      render: (_, r) => (
        <Space>
          <Button onClick={() => openEdit(r)} size="small" type="link">
            编辑
          </Button>
          <Button
            onClick={() =>
              Modal.confirm({
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
            onClick={() =>
              Modal.confirm({
                title: '确认删除？',
                content: r.title,
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
          gap: 8,
        }}
      >
        <Button onClick={openTagsModal}>管理筛选标签</Button>
        <Button onClick={openCreate} type="primary">
          + 添加案例研究
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
        title={editing ? '编辑案例研究' : '添加案例研究'}
        width={860}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="URL Slug"
            name="slug"
            rules={[
              { required: true },
              { pattern: /^[a-z0-9-]+$/, message: '小写字母、数字和连字符' },
            ]}
          >
            <Input placeholder="liver-cancer-drug-response" />
          </Form.Item>
          <Form.Item label="摘要（卡片一行显示）" name="summary">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="封面图片">
            <ImageUploader
              module="portal"
              onChange={(url) => setCoverImage(url ?? '')}
              value={coverImage}
            />
          </Form.Item>
          <Form.Item label="Cancer Type 标签" name="cancerTypeTags">
            <Checkbox.Group
              options={filterTags?.cancerTypeTags ?? []}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
            />
          </Form.Item>
          <Form.Item label="Application 标签" name="applicationTags">
            <Checkbox.Group
              options={filterTags?.applicationTags ?? []}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
            />
          </Form.Item>
          <Form.Item label="Challenge（富文本）">
            <RichTextEditor
              defaultValue={challenge}
              key={`challenge-${editing?.id ?? 'new'}`}
              onChange={setChallenge}
            />
          </Form.Item>
          <Form.Item label="Approach（富文本）">
            <RichTextEditor
              defaultValue={approach}
              key={`approach-${editing?.id ?? 'new'}`}
              onChange={setApproach}
            />
          </Form.Item>
          <Form.Item label="Results（富文本）">
            <RichTextEditor
              defaultValue={results}
              key={`results-${editing?.id ?? 'new'}`}
              onChange={setResults}
            />
          </Form.Item>
          <Form.Item label="Implication（富文本）">
            <RichTextEditor
              defaultValue={implication}
              key={`implication-${editing?.id ?? 'new'}`}
              onChange={setImplication}
            />
          </Form.Item>
          <Form.Item label="元数据 - Model" name="metaModel">
            <Input />
          </Form.Item>
          <Form.Item label="元数据 - Drug Classes" name="metaDrugClasses">
            <Input />
          </Form.Item>
          <Form.Item label="元数据 - Readout" name="metaReadout">
            <Input />
          </Form.Item>
          <Form.Item label="元数据 - Validation" name="metaValidation">
            <Input />
          </Form.Item>
          <Form.Item label="CTA 1 文字" name="cta1Label">
            <Input />
          </Form.Item>
          <Form.Item label="CTA 1 链接" name="cta1Url">
            <Input />
          </Form.Item>
          <Form.Item label="CTA 2 文字" name="cta2Label">
            <Input />
          </Form.Item>
          <Form.Item label="CTA 2 链接" name="cta2Url">
            <Input />
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

      <Modal
        footer={
          <Button
            loading={setFilterTags.isPending}
            onClick={() =>
              setFilterTags.mutate({
                cancerTypeTags: editCancerTags,
                applicationTags: editAppTags,
              })
            }
            type="primary"
          >
            保存标签
          </Button>
        }
        onCancel={() => setTagsModalOpen(false)}
        open={tagsModalOpen}
        title="管理筛选标签"
        width={560}
      >
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              Cancer Type 标签
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginBottom: 8,
              }}
            >
              {editCancerTags.map((t) => (
                <Tag
                  closable
                  key={t}
                  onClose={() =>
                    setEditCancerTags(editCancerTags.filter((x) => x !== t))
                  }
                >
                  {t}
                </Tag>
              ))}
            </div>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                onChange={(e) => setNewCancerTag(e.target.value)}
                onPressEnter={() => {
                  const tag = newCancerTag.trim();
                  if (tag && !editCancerTags.includes(tag)) {
                    setEditCancerTags([...editCancerTags, tag]);
                    setNewCancerTag('');
                  }
                }}
                placeholder="输入新标签，回车添加"
                value={newCancerTag}
              />
              <Button
                onClick={() => {
                  const tag = newCancerTag.trim();
                  if (tag && !editCancerTags.includes(tag)) {
                    setEditCancerTags([...editCancerTags, tag]);
                    setNewCancerTag('');
                  }
                }}
              >
                添加
              </Button>
            </Space.Compact>
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              Application 标签
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginBottom: 8,
              }}
            >
              {editAppTags.map((t) => (
                <Tag
                  closable
                  key={t}
                  onClose={() =>
                    setEditAppTags(editAppTags.filter((x) => x !== t))
                  }
                >
                  {t}
                </Tag>
              ))}
            </div>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                onChange={(e) => setNewAppTag(e.target.value)}
                onPressEnter={() => {
                  const tag = newAppTag.trim();
                  if (tag && !editAppTags.includes(tag)) {
                    setEditAppTags([...editAppTags, tag]);
                    setNewAppTag('');
                  }
                }}
                placeholder="输入新标签，回车添加"
                value={newAppTag}
              />
              <Button
                onClick={() => {
                  const tag = newAppTag.trim();
                  if (tag && !editAppTags.includes(tag)) {
                    setEditAppTags([...editAppTags, tag]);
                    setNewAppTag('');
                  }
                }}
              >
                添加
              </Button>
            </Space.Compact>
          </div>
        </div>
      </Modal>
    </div>
  );
}
