'use client';

import { useRef, useState } from 'react';
import { clearStudyState, loadStudyState, normalizeStudyState, saveStudyState } from '@/lib/study-state';

export function SettingsPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState('');

  function exportData() {
    const blob = new Blob([JSON.stringify(loadStudyState(), null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = 'neurosci366-study-history.json';
    anchor.click();
    URL.revokeObjectURL(href);
    setStatus('已导出。');
  }

  async function importData(file?: File) {
    if (!file) return;
    try {
      const parsed = normalizeStudyState(JSON.parse(await file.text()));
      if (!parsed) throw new Error('schema');
      saveStudyState(parsed);
      setStatus('已导入。');
    } catch {
      setStatus('文件不是有效的 NEUROSCI 366 学习记录。');
    }
  }

  function reset() {
    if (!window.confirm('重置全部学习记录？')) return;
    clearStudyState();
    setStatus('已重置。');
  }

  return (
    <div className="settings-actions">
      <button type="button" onClick={exportData}>导出 JSON</button>
      <button type="button" onClick={() => inputRef.current?.click()}>导入 JSON</button>
      <input className="sr-only" ref={inputRef} type="file" accept="application/json" onChange={(event) => importData(event.target.files?.[0])} />
      <button type="button" onClick={reset}>重置</button>
      {status && <p role="status">{status}</p>}
    </div>
  );
}
