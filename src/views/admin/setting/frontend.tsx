'use client';

import { Button, Card, Modal, message, Space, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ConfigEditor from '@/components/ConfigEditor';
import { frontendConfigSchema } from '@/constants/frontend-config';
import { mergeConfig } from '@/lib/frontend-config';
import { api } from '@/lib/trpc/react';
import styles from './frontend.module.scss';

export default function AdminSettingFrontend() {
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

  const savedConfig = useMemo(
    () => mergeConfig(storedConfig ?? {}),
    [storedConfig],
  );
  // biome-ignore lint/suspicious/noExplicitAny: generic config value map
  const [draft, setDraft] = useState<Record<string, any>>(savedConfig);

  useEffect(() => {
    setDraft(savedConfig);
  }, [savedConfig]);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(savedConfig),
    [draft, savedConfig],
  );

  const handleSave = useCallback(() => {
    saveMutation.mutate(draft);
  }, [saveMutation, draft]);

  const handleReset = useCallback(() => {
    Modal.confirm({
      title: '恢复默认配置',
      content: '确定要恢复默认配置吗？所有自定义修改将丢失。',
      centered: true,
      onOk: () => {
        saveMutation.mutate({});
      },
    });
  }, [saveMutation]);

  return (
    <div className={styles.container}>
      <Card
        extra={
          <Space>
            <Button
              disabled={!isDirty}
              loading={saveMutation.isPending}
              onClick={handleSave}
              type="primary"
            >
              保存配置
            </Button>
            <Button danger onClick={handleReset}>
              恢复默认
            </Button>
          </Space>
        }
        title="前端配置"
      >
        <Spin spinning={isLoading}>
          <ConfigEditor
            onChange={setDraft}
            schema={frontendConfigSchema}
            value={draft}
          />
        </Spin>
      </Card>
    </div>
  );
}
