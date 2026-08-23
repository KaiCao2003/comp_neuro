'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { assetPath } from '@/lib/site';
import { recordQuestionAttempt, recordQuestionExposure, seededShuffle } from '@/lib/study-state';
import type { Question } from '@/lib/types';

const questionTypeLabel: Record<Question['type'], string> = {
  concept: '概念',
  equation: '公式',
  calculation: '计算',
  figure: '图示',
  code: '代码',
  assumption: '假设',
  transfer: '迁移',
  comparison: '比较',
  debug: '调试',
  cross_lecture: '跨讲',
};

export function QuestionBlock({ question, seed, showSourceLink = true, onSubmit }: { question: Question; seed: string; showSourceLink?: boolean; onSubmit?: (correct: boolean) => void }) {
  const blockRef = useRef<HTMLElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const choices = useMemo(() => seededShuffle(question.choices, `${seed}:${question.id}:choices`), [question, seed]);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState<string[]>([]);
  const correct = selected === question.correctChoiceId;

  useEffect(() => {
    const element = blockRef.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) {
      recordQuestionExposure(question.id, `${seed}:${question.id}`);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      recordQuestionExposure(question.id, `${seed}:${question.id}`);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [question.id, seed]);

  const sourceAnchor = question.sourceAnchors[0];
  const sectionHref = showSourceLink ? `#${question.sectionId}` : `/lectures/${String(question.lecture).padStart(2, '0')}/#${question.sectionId}`;
  const sourceHref = sourceAnchor ? `${assetPath(`/resources/original/${encodeURIComponent(sourceAnchor.file)}`)}#page=${sourceAnchor.page}` : null;

  function submit() {
    if (!selected || submitted) return;
    const isCorrect = selected === question.correctChoiceId;
    recordQuestionAttempt(question.id, isCorrect);
    if (!isCorrect && wrongAttempts.length === 0) {
      setWrongAttempts([selected]);
      setSelected(null);
      requestAnimationFrame(() => fieldsetRef.current?.querySelector<HTMLInputElement>('input')?.focus());
      return;
    }
    setSubmitted(true);
    onSubmit?.(isCorrect && wrongAttempts.length === 0);
    requestAnimationFrame(() => feedbackRef.current?.focus());
  }

  return (
    <aside className="question-block" aria-labelledby={`${question.id}-stem`} ref={blockRef}>
      <p className="exercise-label">练习 · {questionTypeLabel[question.type]} · 难度 {question.difficulty}</p>
      <p className="question-stem" id={`${question.id}-stem`}>{question.stem}</p>
      <fieldset disabled={submitted} ref={fieldsetRef}>
        <legend className="sr-only">选择一个答案</legend>
        {choices.map((choice) => (
          <label className="answer-choice" key={choice.id}>
            <input type="radio" name={question.id} value={choice.id} checked={selected === choice.id} onChange={() => setSelected(choice.id)} />
            <span>{choice.text}</span>
          </label>
        ))}
      </fieldset>
      {!submitted && <button className="text-button" type="button" onClick={submit} disabled={!selected}>{wrongAttempts.length ? '再次提交' : '提交答案'}</button>}
      {!submitted && wrongAttempts.length > 0 && (
        <div className="answer-feedback retry-feedback" role="status">
          <p className="answer-status">第一次答案不正确，再试一次</p>
          <p>{question.wrongChoiceExplanations[wrongAttempts[0]]}</p>
        </div>
      )}
      {submitted && (
        <div className="answer-feedback" role="status" tabIndex={-1} ref={feedbackRef}>
          <p className="answer-status">{correct ? (wrongAttempts.length ? '第二次答对了' : '正确') : '第二次仍不正确'}</p>
          <p><strong>正确答案：</strong>{question.choices.find((choice) => choice.id === question.correctChoiceId)?.text}</p>
          <p>{question.explanation}</p>
          <details>
            <summary>其他选项为什么不对</summary>
            <ul>
              {choices.filter((choice) => choice.id !== question.correctChoiceId).map((choice) => (
                <li key={choice.id}><span>{choice.text}</span><br />{question.wrongChoiceExplanations[choice.id]}</li>
              ))}
            </ul>
          </details>
          <p className="question-source"><Link href={sectionHref}>正文</Link>{sourceHref && sourceAnchor && <> · <a href={sourceHref} target="_blank" rel="noreferrer">原始讲义第 {sourceAnchor.page} 页</a></>}</p>
        </div>
      )}
      <div className="print-answer-key">
        <strong>答案：</strong> {question.choices.find((choice) => choice.id === question.correctChoiceId)?.text}。{question.explanation}
      </div>
    </aside>
  );
}
