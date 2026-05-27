/**
 * 分享到广场弹窗
 */

import React, { useState } from 'react';
import { shareApi } from '@services/share';
import './share-modal.css';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** 预填的分享内容 */
  shareData?: {
    shareType: 'single' | 'monthly';
    content: object;
  };
}

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  onSuccess,
  shareData,
}) => {
  const [title, setTitle] = useState('');
  const [shareType, setShareType] = useState<'single' | 'monthly'>(shareData?.shareType || 'monthly');
  const [submitting, setSubmitting] = useState(false);

  if (!visible) return null;

  const handleSubmit = async () => {
    if (!shareData?.content) {
      alert('没有可分享的内容');
      return;
    }

    setSubmitting(true);
    try {
      await shareApi.createShare({
        shareType,
        title: title.trim() || '我的账单分享',
        content: JSON.stringify(shareData.content),
      });
      alert('分享成功！');
      onSuccess?.();
      onClose();
      setTitle('');
    } catch {
      alert('分享失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="share-modal-overlay" onClick={handleOverlayClick}>
      <div className="share-modal-sheet">
        <div className="share-modal-handle" />
        <div className="share-modal-header">
          <span className="share-modal-title">分享到广场</span>
          <button className="share-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="share-modal-body">
          {/* 分享类型选择 */}
          {!shareData && (
            <div className="share-modal-field">
              <label className="share-modal-label">分享类型</label>
              <div className="share-modal-type-row">
                <button
                  className={`share-modal-type-btn ${shareType === 'single' ? 'active' : ''}`}
                  onClick={() => setShareType('single')}
                >
                  单条账单
                </button>
                <button
                  className={`share-modal-type-btn ${shareType === 'monthly' ? 'active' : ''}`}
                  onClick={() => setShareType('monthly')}
                >
                  月度概览
                </button>
              </div>
            </div>
          )}

          {/* 标题输入 */}
          <div className="share-modal-field">
            <label className="share-modal-label">分享标题（选填）</label>
            <input
              className="share-modal-input"
              placeholder="我的账单分享"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* 预览 */}
          {shareData?.content && (
            <div className="share-modal-preview">
              <div className="share-modal-preview-label">将分享以下内容</div>
              <div className="share-modal-preview-type">
                {(shareData.shareType || shareType) === 'single' ? '📋 单条账单' : '📊 月度收支概览'}
              </div>
            </div>
          )}
        </div>

        <div className="share-modal-footer">
          <button
            className="share-modal-submit"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '分享中...' : '发布到广场'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
