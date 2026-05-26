import React, { useRef, useState, useCallback } from 'react';
import './pull-to-refresh.css';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const THRESHOLD = 64;

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const pullDistRef = useRef(0);
  const wasAtTopRef = useRef(false);
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const getScrollParent = () => {
    return wrapRef.current?.closest('.main-content') as HTMLElement | null;
  };

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollEl = getScrollParent();
    wasAtTopRef.current = !scrollEl || scrollEl.scrollTop <= 0;
    startYRef.current = e.touches[0].clientY;
    pullDistRef.current = 0;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!wasAtTopRef.current || refreshing) return;
    const dy = e.touches[0].clientY - startYRef.current;
    if (dy <= 0) return;
    pullDistRef.current = dy;
    const clamped = Math.min(dy * 0.45, THRESHOLD + 16);
    setPullY(clamped);
  }, [refreshing]);

  const onTouchEnd = useCallback(async () => {
    if (!wasAtTopRef.current || refreshing) return;
    if (pullDistRef.current >= THRESHOLD * 2) {
      setRefreshing(true);
      setPullY(THRESHOLD);
      try { await onRefresh(); } catch {}
      setRefreshing(false);
    }
    setPullY(0);
    pullDistRef.current = 0;
  }, [onRefresh, refreshing]);

  const indicatorOpacity = Math.min(pullY / THRESHOLD, 1);
  const rotation = Math.min((pullY / THRESHOLD) * 360, 360);

  return (
    <div
      ref={wrapRef}
      className="ptr-wrap"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="ptr-indicator"
        style={{ height: pullY, opacity: indicatorOpacity }}
      >
        <div
          className={`ptr-spinner ${refreshing ? 'ptr-spinning' : ''}`}
          style={{ transform: refreshing ? undefined : `rotate(${rotation}deg)` }}
        />
      </div>
      {children}
    </div>
  );
};

export default PullToRefresh;
