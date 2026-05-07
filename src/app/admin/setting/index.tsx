'use client';

import {
  Button,
  Card,
  Modal,
  message,
  Radio,
  Space,
  Spin,
  Tooltip,
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ConfigEditor, { type EditMode } from '@/components/ConfigEditor';
import { frontendConfigSchema } from '@/constants/frontend-config';
import { type FrontendConfig, mergeConfig } from '@/lib/frontend-config';
import { api } from '@/lib/trpc/react';

export default function AdminSettingPage() {
  const {
    data: storedConfig,
    isLoading,
    refetch,
  } = api.page.getFrontendConfig.useQuery();
  const saveMutation = api.page.saveFrontendConfig.useMutation({
    onSuccess: () => {
      message.success('配置已保存');
      void refetch();
    },
    onError: () => message.error('保存失败，请重试'),
  });
  const resetMutation = api.page.saveFrontendConfig.useMutation({
    onSuccess: () => {
      message.success('已恢复默认配置');
      void refetch();
    },
    onError: () => message.error('恢复失败，请重试'),
  });

  const savedConfig = useMemo(
    () => mergeConfig(storedConfig ?? {}),
    [storedConfig],
  );
  const [draft, setDraft] = useState<FrontendConfig>(savedConfig);
  const [editMode, setEditMode] = useState<EditMode>('visual');
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(savedConfig);
  }, [savedConfig]);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(savedConfig),
    [draft, savedConfig],
  );

  const canSave = isDirty && !jsonError;

  const handleSave = useCallback(() => {
    if (jsonError) {
      void message.error('请先修正 JSON 格式错误');
      return;
    }
    saveMutation.mutate(draft);
  }, [saveMutation, draft, jsonError]);

  const handleReset = useCallback(() => {
    Modal.confirm({
      title: '恢复默认配置',
      content: '确定要恢复默认配置吗？所有自定义修改将丢失。',
      centered: true,
      onOk: () => {
        resetMutation.mutate({});
      },
    });
  }, [resetMutation]);

  const visualDisabledTip =
    jsonError && editMode === 'code' ? '请先修正 JSON 格式错误' : '';

  return (
    <Card
      extra={
        <Space>
          <Radio.Group
            buttonStyle="solid"
            onChange={(e) => setEditMode(e.target.value as EditMode)}
            size="middle"
            value={editMode}
          >
            <Tooltip title={visualDisabledTip}>
              <Radio.Button disabled={!!visualDisabledTip} value="visual">
                可视模式
              </Radio.Button>
            </Tooltip>
            <Radio.Button value="code">代码模式</Radio.Button>
          </Radio.Group>
          <Button
            danger
            loading={resetMutation.isPending}
            onClick={handleReset}
          >
            恢复默认
          </Button>
          <Button
            disabled={!canSave}
            loading={saveMutation.isPending}
            onClick={handleSave}
            type="primary"
          >
            保存配置
          </Button>
        </Space>
      }
      title="门户配置"
    >
      <Spin spinning={isLoading}>
        <ConfigEditor
          mode={editMode}
          onChange={(v) => setDraft(v as FrontendConfig)}
          onValidityChange={setJsonError}
          schema={frontendConfigSchema}
          value={draft}
        />
      </Spin>
    </Card>
  );
}
