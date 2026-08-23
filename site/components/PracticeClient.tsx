'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import courseJson from '@/content/course.json';
import questionsJson from '@/content/questions.json';
import { loadStudyState, selectQuestionIds } from '@/lib/study-state';
import { practiceTopics, questionMatchesTopic } from '@/lib/topics';
import type { CourseSummary, Question } from '@/lib/types';
import { QuestionBlock } from './QuestionBlock';

const course = courseJson as CourseSummary[];
const questions = questionsJson as unknown as Question[];

type Mode = 'lecture' | 'topic' | 'cumulative' | 'difficult' | 'unseen';

export function PracticeClient({ initialMode = 'lecture' }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [lecture, setLecture] = useState(1);
  const [topic, setTopic] = useState<string>(practiceTopics[0].value);
  const [difficulty, setDifficulty] = useState(0);
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(27);
  const [count, setCount] = useState(10);
  const [sessionSeed, setSessionSeed] = useState('practice');
  const [selected, setSelected] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const value = Number(new URLSearchParams(location.search).get('lecture'));
    // URL-derived controls are synchronized after the statically rendered shell hydrates.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value >= 1 && value <= 27) { setLecture(value); setMode('lecture'); }
  }, []);

  const completed = Object.keys(answers).length;
  const correct = Object.values(answers).filter(Boolean).length;

  const topicPool = useMemo(() => {
    const selectedTopic = practiceTopics.find((item) => item.value === topic) ?? practiceTopics[0];
    return questions.filter((question) => questionMatchesTopic(question, selectedTopic));
  }, [topic]);

  function start() {
    const state = loadStudyState();
    let pool = questions;
    if (mode === 'lecture') pool = pool.filter((question) => question.lecture === lecture);
    if (mode === 'topic') pool = topicPool;
    if (mode === 'cumulative') pool = pool.filter((question) => question.lecture >= rangeStart && question.lecture <= rangeEnd);
    if (mode === 'difficult') pool = pool.filter((question) => state.questions[question.id]?.lastCorrect === false);
    if (mode === 'unseen') pool = pool.filter((question) => !state.questions[question.id]);
    if (difficulty) pool = pool.filter((question) => question.difficulty === difficulty);
    if (!pool.length) {
      setSelected([]);
      setMessage(mode === 'difficult' ? '当前没有答错记录。' : '当前筛选条件没有可用题目。');
      return;
    }
    const seed = `${state.installationSeed}:practice:${mode}:${Date.now()}`;
    const ids = selectQuestionIds(pool, state, Math.min(count, pool.length), seed);
    setSessionSeed(seed);
    setSelected(ids.map((id) => pool.find((question) => question.id === id)).filter(Boolean) as Question[]);
    setAnswers({});
    setMessage('');
  }

  const missedTags = selected.filter((question) => answers[question.id] === false).flatMap((question) => question.conceptTags).filter((tag, index, all) => all.indexOf(tag) === index).slice(0, 8);

  return (
    <div>
      <div className="practice-controls">
        <label>模式<select value={mode} onChange={(event) => setMode(event.target.value as Mode)}>
          <option value="lecture">单讲</option><option value="topic">主题</option><option value="cumulative">累计</option><option value="difficult">答错题</option><option value="unseen">未见题</option>
        </select></label>
        {mode === 'lecture' && <label>讲次<select value={lecture} onChange={(event) => setLecture(Number(event.target.value))}>{course.map((item) => <option value={item.lecture} key={item.lecture}>{item.lecture} · {item.zhTitle}</option>)}</select></label>}
        {mode === 'topic' && <label>主题<select value={topic} onChange={(event) => setTopic(event.target.value)}>{practiceTopics.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></label>}
        {mode === 'cumulative' && <><label>起始讲<input type="number" min="1" max="27" value={rangeStart} onChange={(event) => setRangeStart(Number(event.target.value))} /></label><label>结束讲<input type="number" min="1" max="27" value={rangeEnd} onChange={(event) => setRangeEnd(Number(event.target.value))} /></label></>}
        <label>难度<select value={difficulty} onChange={(event) => setDifficulty(Number(event.target.value))}><option value="0">全部</option>{[1, 2, 3, 4, 5].map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
        <label>题数<select value={count} onChange={(event) => setCount(Number(event.target.value))}><option value="10">10</option><option value="15">15</option><option value="25">25</option></select></label>
        <button type="button" onClick={start}>开始练习</button>
      </div>
      {message && <p role="status">{message}</p>}
      {selected.length > 0 && (
        <div className="practice-session">
          <p className="practice-status">已答 {completed}/{selected.length}{completed ? ` · 正确 ${correct}` : ''}</p>
          {selected.map((question) => <QuestionBlock key={`${sessionSeed}-${question.id}`} question={question} seed={sessionSeed} showSourceLink={false} onSubmit={(isCorrect) => setAnswers((current) => ({ ...current, [question.id]: isCorrect }))} />)}
          {completed === selected.length && (
            <section className="practice-summary" aria-live="polite">
              <h2>结果</h2>
              <p>{correct} / {selected.length}</p>
              {missedTags.length > 0 && <><h3>需要回看的概念</h3><ul>{missedTags.map((tag) => <li key={tag}>{tag}</li>)}</ul></>}
              <h3>正文链接</h3>
              <ul>{selected.filter((question) => answers[question.id] === false).map((question) => <li key={question.id}><Link href={`/lectures/${String(question.lecture).padStart(2, '0')}/#${question.sectionId}`}>第 {question.lecture} 讲 · {question.stem}</Link></li>)}</ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
