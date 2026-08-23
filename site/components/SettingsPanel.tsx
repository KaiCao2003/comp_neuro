'use client';

import { useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import { clearStudyState, loadStudyState, normalizeStudyState, saveStudyState } from '@/lib/study-state';

export function SettingsPanel({ locale }: { locale: Locale }) {
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
    setStatus(locale === 'zh' ? '已导出。' : 'Exported.');
  }

  async function importData(file?: File) {
    if (!file) return;
    try {
      const parsed = normalizeStudyState(JSON.parse(await file.text()));
      if (!parsed) throw new Error('schema');
      saveStudyState(parsed);
      setStatus(locale === 'zh' ? '已导入。' : 'Imported.');
    } catch {
      setStatus(locale === 'zh' ? '文件不是有效的 NEUROSCI 366 学习记录。' : 'This file is not a valid NEUROSCI 366 study record.');
    }
  }

  function reset() {
    if (!window.confirm(locale === 'zh' ? '重置全部学习记录？' : 'Reset all study history?')) return;
    clearStudyState();
    setStatus(locale === 'zh' ? '已重置。' : 'Reset complete.');
  }

  return (
    <div className="settings-actions">
      <button type="button" onClick={exportData}>{locale === 'zh' ? '导出 JSON' : 'Export JSON'}</button>
      <button type="button" onClick={() => inputRef.current?.click()}>{locale === 'zh' ? '导入 JSON' : 'Import JSON'}</button>
      <input className="sr-only" ref={inputRef} type="file" accept="application/json" onChange={(event) => importData(event.target.files?.[0])} />
      <button type="button" onClick={reset}>{locale === 'zh' ? '重置' : 'Reset'}</button>
      {status && <p role="status">{status}</p>}
    </div>
  );
}
