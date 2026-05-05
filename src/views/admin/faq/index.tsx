'use client';

import { HolderOutlined } from '@ant-design/icons';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Form, Input, Modal, message, Space, Switch, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import { DraggableTable } from '@/components/DraggableTable';
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

// ──────────────────────────────────────────────
// 左侧可拖拽分类列表
// ──────────────────────────────────────────────

function CategoryRow({
  cat,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  cat: Category;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(cat.id) });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 9999, position: 'relative' } : {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 12px',
        borderRadius: 6,
        cursor: 'pointer',
        background: selected ? '#e6f4ff' : 'transparent',
        borderLeft: selected ? '3px solid #1677ff' : '3px solid transparent',
        marginBottom: 2,
      }}
    >
      <HolderOutlined
        ref={setActivatorNodeRef as React.Ref<HTMLSpanElement>}
        style={{ color: '#ccc', fontSize: 13, cursor: 'grab', flexShrink: 0 }}
        {...(listeners as React.HTMLAttributes<HTMLSpanElement>)}
      />
      <button
        onClick={onSelect}
        style={{
          flex: 1,
          fontSize: 14,
          color: selected ? '#1677ff' : '#333',
          fontWeight: selected ? 600 : 400,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          textAlign: 'left',
        }}
        type="button"
      >
        {cat.name}
        {!cat.isVisible && (
          <Tag color="default" style={{ marginLeft: 4, fontSize: 11 }}>
            隐藏
          </Tag>
        )}
      </button>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        size="small"
        style={{ color: '#999', padding: '0 4px' }}
        type="text"
      >
        编辑
      </Button>
      <Button
        danger
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        size="small"
        style={{ padding: '0 4px' }}
        type="text"
      >
        删除
      </Button>
    </div>
  );
}

// ──────────────────────────────────────────────
// 右侧问题面板
// ──────────────────────────────────────────────

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
  const updateItemSort = api.faq.adminUpdateItemSort.useMutation({
    onError: () => message.error('排序保存失败'),
  });

  const handleOrderChange = useCallback(
    (newRows: FaqItem[]) => {
      updateItemSort.mutate(
        newRows.map((r, i) => ({ id: r.id, sortOrder: i })),
      );
    },
    [updateItemSort],
  );

  const openCreateItem = () => {
    setEditingItem(null);
    setAnswerContent('');
    itemForm.resetFields();
    itemForm.setFieldsValue({ isVisible: true });
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
        sortOrder: editingItem.sortOrder,
        ...payload,
      } as Parameters<typeof updateItem.mutate>[0]);
    } else {
      createItem.mutate({
        categoryId: category.id,
        sortOrder: items?.length ?? 0,
        ...payload,
      } as Parameters<typeof createItem.mutate>[0]);
    }
  };

  const itemColumns: ColumnsType<FaqItem> = [
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
                title: '确认删除该问题？',
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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 15 }}>{category.name}</span>
        <Button onClick={openCreateItem} size="small" type="primary">
          + 添加问题
        </Button>
      </div>

      <DraggableTable
        columns={itemColumns}
        dataSource={items ?? []}
        onOrderChange={handleOrderChange}
        pagination={false}
        size="small"
      />

      <Modal
        destroyOnHidden
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

// ──────────────────────────────────────────────
// 主视图
// ──────────────────────────────────────────────

export default function AdminFaqView() {
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [catForm] = Form.useForm();

  const { data: categories, refetch } = api.faq.adminListCategories.useQuery();

  useEffect(() => {
    if (selectedCatId === null && categories && categories.length > 0) {
      setSelectedCatId(categories[0]?.id ?? null);
    }
  }, [categories, selectedCatId]);

  const selectedCat = categories?.find((c) => c.id === selectedCatId) ?? null;

  const createCat = api.faq.adminCreateCategory.useMutation({
    onSuccess: (row) => {
      message.success('已添加');
      setCatModalOpen(false);
      void refetch();
      if (row) setSelectedCatId(row.id);
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
      setSelectedCatId(null);
    },
    onError: () => message.error('删除失败'),
  });

  const updateCatSort = api.faq.adminUpdateCategorySort.useMutation({
    onError: () => message.error('排序保存失败'),
  });

  const [localCats, setLocalCats] = useState<Category[]>([]);
  const cats = localCats.length > 0 ? localCats : (categories ?? []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
  );

  const handleCatDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return;
      const oldIndex = cats.findIndex(
        (c) => String(c.id) === String(active.id),
      );
      const newIndex = cats.findIndex((c) => String(c.id) === String(over.id));
      const newCats = arrayMove(cats, oldIndex, newIndex);
      setLocalCats(newCats);
      updateCatSort.mutate(newCats.map((c, i) => ({ id: c.id, sortOrder: i })));
    },
    [cats, updateCatSort],
  );

  const openCreateCat = () => {
    setEditingCat(null);
    catForm.resetFields();
    catForm.setFieldsValue({ isVisible: true });
    setCatModalOpen(true);
  };

  const openEditCat = (r: Category) => {
    setEditingCat(r);
    catForm.setFieldsValue(r);
    setCatModalOpen(true);
  };

  const handleCatSubmit = (vals: Record<string, unknown>) => {
    const payload = {
      ...vals,
      sortOrder: editingCat?.sortOrder ?? categories?.length ?? 0,
    };
    if (editingCat) {
      updateCat.mutate({ id: editingCat.id, ...payload } as Parameters<
        typeof updateCat.mutate
      >[0]);
    } else {
      createCat.mutate(payload as Parameters<typeof createCat.mutate>[0]);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
      }}
    >
      {/* 左侧分类菜单 */}
      <div
        style={{
          width: 220,
          flexShrink: 0,
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          background: '#fafafa',
        }}
      >
        <div
          style={{
            padding: '12px 12px 8px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 13, color: '#555' }}>
            FAQ 分类
          </span>
          <Button onClick={openCreateCat} size="small" type="primary">
            + 添加
          </Button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleCatDragEnd}
            sensors={sensors}
          >
            <SortableContext
              items={cats.map((c) => String(c.id))}
              strategy={verticalListSortingStrategy}
            >
              {cats.map((cat) => (
                <CategoryRow
                  cat={cat}
                  key={cat.id}
                  onDelete={() =>
                    Modal.confirm({
                      title: '确认删除整个分类及其下所有问题？',
                      content: cat.name,
                      okType: 'danger',
                      onOk: () => deleteCat.mutate({ id: cat.id }),
                    })
                  }
                  onEdit={() => openEditCat(cat)}
                  onSelect={() => setSelectedCatId(cat.id)}
                  selected={selectedCatId === cat.id}
                />
              ))}
            </SortableContext>
          </DndContext>

          {cats.length === 0 && (
            <div
              style={{
                color: '#999',
                fontSize: 13,
                textAlign: 'center',
                marginTop: 24,
              }}
            >
              暂无分类
            </div>
          )}
        </div>
      </div>

      {/* 右侧问题 Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {selectedCat ? (
          <ItemsPanel category={selectedCat} key={selectedCat.id} />
        ) : (
          <div style={{ color: '#999', marginTop: 60, textAlign: 'center' }}>
            请从左侧选择一个分类
          </div>
        )}
      </div>

      {/* 分类编辑 Modal */}
      <Modal
        destroyOnHidden
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
