'use client';

import { useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import {
  clearSocraticState,
  loadSocraticState,
  normalizeSocraticState,
  saveSocraticState,
} from '@/lib/socratic-state';
import { clearStudyState, loadStudyState, normalizeStudyState, saveStudyState } from '@/lib/study-state';

type StudyExport = {
  version: 2;
  exportedAt: string;
  study: ReturnType<typeof loadStudyState>;
  socratic: ReturnType<typeof loadSocraticState>;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

export function SettingsPanel({ locale }: { locale: Locale }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState('');

  function exportData() {
    const payload: StudyExport = {
      version: 2,
      exportedAt: new Date().toISOString(),
      study: loadStudyState(),
      socratic: loadSocraticState(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = 'neurosci366-study-history.json';
    anchor.click();
    URL.revokeObjectURL(href);
    setStatus(locale === 'zh' ? '已导出题目记录与苏格拉底学习进度。' : 'Question history and Socratic progress exported.');
  }

  async function importData(file?: File) {
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      const legacy = normalizeStudyState(parsed);
      if (legacy) {
        saveStudyState(legacy);
        setStatus(locale === 'zh' ? '已导入旧版学习记录。' : 'Legacy study record imported.');
        return;
      }
      if (!isRecord(parsed) || parsed.version !== 2) throw new Error('schema');
      const study = normalizeStudyState(parsed.study);
      const socratic = normalizeSocraticState(parsed.socratic);
      if (!study || !socratic) throw new Error('schema');
      saveStudyState(study);
      saveSocraticState(socratic);
      setStatus(locale === 'zh' ? '已导入题目记录与苏格拉底学习进度。' : 'Question history and Socratic progress imported.');
    } catch {
      setStatus(locale === 'zh' ? '文件不是有效的 NEUROSCI 366 学习记录。' : 'This file is not a valid NEUROSCI 366 study record.');
    }
  }

  function reset() {
    if (!window.confirm(locale === 'zh' ? '重置全部题目记录与苏格拉底学习进度？' : 'Reset all question history and Socratic progress?')) return;
    clearStudyState();
    clearSocraticState();
    setStatus(locale === 'zh' ? '已重置全部学习记录。' : 'All study history has been reset.');
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
