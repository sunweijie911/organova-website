'use client';

import {
  Button,
  Collapse,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Space,
  Switch,
  Table,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { RichTextEditor } from '@/components/RichTextEditor';
import { api } from '@/lib/trpc/react';

type Category = {
  id: number;
  name: string;
  sortOrder: number;
  isVisible: boolean;
};
type FaqItem = {
  id: number;
  categoryId: number;
  question: string;
  answer: string;
  sortOrder: number;
  isVisible: boolean;
};

function ItemsPanel({ category }: { category: Category }) {
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [answerContent, setAnswerContent] = useState('');
  const [itemForm] = Form.useForm();

  const { data: items, refetch } = api.faq.adminListItems.useQuery({
    categoryId: category.id,
  });

  const createItem = api.faq.adminCreateItem.useMutation({
    onSuccess: () => {
      message.success('已添加');
      setItemModalOpen(false);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });

  const updateItem = api.faq.adminUpdateItem.useMutation({
    onSuccess: () => {
      message.success('已保存');
      setItemModalOpen(false);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });

  const deleteItem = api.faq.adminDeleteItem.useMutation({
    onSuccess: () => {
      message.success('已删除');
      void refetch();
    },
    onError: () => message.error('删除失败'),
  });

  const openCreateItem = () => {
    setEditingItem(null);
    setAnswerContent('');
    itemForm.resetFields();
    itemForm.setFieldsValue({ isVisible: true, sortOrder: items?.length ?? 0 });
    setItemModalOpen(true);
  };

  const openEditItem = (r: FaqItem) => {
    setEditingItem(r);
    setAnswerContent(r.answer);
    itemForm.setFieldsValue(r);
    setItemModalOpen(true);
  };

  const handleItemSubmit = (vals: Record<string, unknown>) => {
    const payload = { ...vals, answer: answerContent };
    if (editingItem) {
      updateItem.mutate({
        id: editingItem.id,
        categoryId: category.id,
        ...payload,
      } as Parameters<typeof updateItem.mutate>[0]);
    } else {
      createItem.mutate({ categoryId: category.id, ...payload } as Parameters<
        typeof createItem.mutate
      >[0]);
    }
  };

  const itemColumns: ColumnsType<FaqItem> = [
    { title: '排序', dataIndex: 'sortOrder', width: 60 },
    { title: '问题', dataIndex: 'question', ellipsis: true },
    {
      title: '显示',
      dataIndex: 'isVisible',
      width: 70,
      render: (v: boolean, r: FaqItem) => (
        <Switch
          checked={v}
          onChange={(checked) =>
            updateItem.mutate({ ...r, isVisible: checked })
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
          <Button onClick={() => openEditItem(r)} size="small" type="link">
            编辑
          </Button>
          <Button
            danger
            onClick={() =>
              Modal.confirm({
                title: '确认删除？',
                okType: 'danger',
                onOk: () => deleteItem.mutate({ id: r.id }),
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
    <>
      <div
        style={{
          marginBottom: 12,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={openCreateItem} size="small" type="primary">
          + 添加问题
        </Button>
      </div>
      <Table
        columns={itemColumns}
        dataSource={items ?? []}
        pagination={false}
        rowKey="id"
        size="small"
      />

      <Modal
        destroyOnClose
        footer={null}
        onCancel={() => setItemModalOpen(false)}
        open={itemModalOpen}
        title={editingItem ? '编辑 Q&A' : '添加 Q&A'}
        width={700}
      >
        <Form
          form={itemForm}
          layout="vertical"
          onFinish={handleItemSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item label="问题" name="question" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="答案" rules={[{ required: true }]}>
            <RichTextEditor
              defaultValue={answerContent}
              key={editingItem?.id ?? 'new'}
              onChange={setAnswerContent}
            />
          </Form.Item>
          <Form.Item label="排序" name="sortOrder">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="显示" name="isVisible" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button
              block
              htmlType="submit"
              loading={createItem.isPending || updateItem.isPending}
              type="primary"
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default function AdminFaqView() {
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm] = Form.useForm();

  const { data: categories, refetch } = api.faq.adminListCategories.useQuery();

  const createCat = api.faq.adminCreateCategory.useMutation({
    onSuccess: () => {
      message.success('已添加');
      setCatModalOpen(false);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });

  const updateCat = api.faq.adminUpdateCategory.useMutation({
    onSuccess: () => {
      message.success('已保存');
      setCatModalOpen(false);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });

  const deleteCat = api.faq.adminDeleteCategory.useMutation({
    onSuccess: () => {
      message.success('已删除');
      void refetch();
    },
    onError: () => message.error('删除失败'),
  });

  const openCreateCat = () => {
    setEditingCat(null);
    catForm.resetFields();
    catForm.setFieldsValue({
      isVisible: true,
      sortOrder: categories?.length ?? 0,
    });
    setCatModalOpen(true);
  };

  const openEditCat = (r: Category) => {
    setEditingCat(r);
    catForm.setFieldsValue(r);
    setCatModalOpen(true);
  };

  const handleCatSubmit = (vals: Record<string, unknown>) => {
    if (editingCat) {
      updateCat.mutate({ id: editingCat.id, ...vals } as Parameters<
        typeof updateCat.mutate
      >[0]);
    } else {
      createCat.mutate(vals as Parameters<typeof createCat.mutate>[0]);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={openCreateCat} type="primary">
          + 添加分类
        </Button>
      </div>

      <Collapse
        items={
          categories?.map((cat) => ({
            key: cat.id,
            label: (
              <Space>
                <span style={{ fontWeight: 600 }}>{cat.name}</span>
                <span style={{ color: '#999', fontSize: 12 }}>
                  排序 {cat.sortOrder}
                </span>
                {!cat.isVisible && (
                  <span style={{ color: '#ff4d4f', fontSize: 12 }}>已隐藏</span>
                )}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditCat(cat);
                  }}
                  size="small"
                  type="link"
                >
                  编辑分类
                </Button>
                <Button
                  danger
                  onClick={(e) => {
                    e.stopPropagation();
                    Modal.confirm({
                      title: '确认删除整个分类及其下所有问题？',
                      okType: 'danger',
                      onOk: () => deleteCat.mutate({ id: cat.id }),
                    });
                  }}
                  size="small"
                  type="link"
                >
                  删除
                </Button>
              </Space>
            ),
            children: <ItemsPanel category={cat} />,
          })) ?? []
        }
      />

      <Modal
        destroyOnClose
        footer={null}
        onCancel={() => setCatModalOpen(false)}
        open={catModalOpen}
        title={editingCat ? '编辑分类' : '添加分类'}
      >
        <Form
          form={catForm}
          layout="vertical"
          onFinish={handleCatSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item label="分类名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="排序" name="sortOrder">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="显示" name="isVisible" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button
              block
              htmlType="submit"
              loading={createCat.isPending || updateCat.isPending}
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
