'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { localizedHref, type Locale } from '@/lib/i18n';
import { balanceQuestionPoolByLecture, loadStudyState, selectQuestionIds } from '@/lib/study-state';
import { practiceTopics, questionMatchesTopic } from '@/lib/topics';
import type { CourseSummary, Question } from '@/lib/types';
import { QuestionBlock } from './QuestionBlock';
import { ScientificText } from './ScientificText';

type Mode = 'lecture' | 'topic' | 'cumulative' | 'difficult' | 'unseen';

export function PracticeClient({ locale, course, questions, initialMode = 'lecture' }: { locale: Locale; course: CourseSummary[]; questions: Question[]; initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const firstLecture = course[0]?.lecture ?? 2;
  const [lecture, setLecture] = useState(firstLecture);
  const [topic, setTopic] = useState<string>(practiceTopics[0].value);
  const [difficulty, setDifficulty] = useState(0);
  const [rangeStart, setRangeStart] = useState(firstLecture);
  const [rangeEnd, setRangeEnd] = useState(27);
  const [count, setCount] = useState(5);
  const [sessionSeed, setSessionSeed] = useState('practice');
  const [selected, setSelected] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const value = Number(new URLSearchParams(location.search).get('lecture'));
    // URL-derived controls are synchronized after the statically rendered shell hydrates.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (course.some((item) => item.lecture === value)) { setLecture(value); setMode('lecture'); }
  }, [course]);

  const completed = Object.keys(answers).length;
  const correct = Object.values(answers).filter(Boolean).length;

  const topicPool = useMemo(() => {
    const selectedTopic = practiceTopics.find((item) => item.value === topic) ?? practiceTopics[0];
    return questions.filter((question) => questionMatchesTopic(question, selectedTopic));
  }, [questions, topic]);

  function start() {
    const state = loadStudyState();
    let pool = questions;
    if (mode === 'lecture') pool = pool.filter((question) => question.lecture === lecture);
    if (mode === 'topic') pool = topicPool;
    if (mode === 'cumulative') pool = pool.filter((question) => question.lecture >= rangeStart && question.lecture <= rangeEnd);
    if (mode === 'difficult') pool = pool.filter((question) => state.questions[question.id]?.needsReview === true);
    if (mode === 'unseen') pool = pool.filter((question) => !state.questions[question.id]);
    if (difficulty) pool = pool.filter((question) => question.difficulty === difficulty);
    if (!pool.length) {
      setSelected([]);
      setMessage(mode === 'difficult'
        ? (locale === 'zh' ? '当前没有答错记录。' : 'There are no missed questions to review.')
        : (locale === 'zh' ? '当前筛选条件没有可用题目。' : 'No questions match these filters.'));
      return;
    }
    const seed = `${state.installationSeed}:practice:${mode}:${Date.now()}`;
    if (mode === 'cumulative') pool = balanceQuestionPoolByLecture(pool, seed);
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
        <label>{locale === 'zh' ? '模式' : 'Mode'}<select value={mode} onChange={(event) => setMode(event.target.value as Mode)}>
          <option value="lecture">{locale === 'zh' ? '单讲' : 'One lecture'}</option><option value="topic">{locale === 'zh' ? '主题' : 'Topic'}</option><option value="cumulative">{locale === 'zh' ? '累计' : 'Cumulative'}</option><option value="difficult">{locale === 'zh' ? '答错题' : 'Missed'}</option><option value="unseen">{locale === 'zh' ? '未见题' : 'Unseen'}</option>
        </select></label>
        {mode === 'lecture' && <label>{locale === 'zh' ? '讲次' : 'Lecture'}<select value={lecture} onChange={(event) => setLecture(Number(event.target.value))}>{course.map((item) => <option value={item.lecture} key={item.lecture}>{item.lecture} · {locale === 'zh' ? item.zhTitle : item.enTitle}</option>)}</select></label>}
        {mode === 'topic' && <label>{locale === 'zh' ? '主题' : 'Topic'}<select value={topic} onChange={(event) => setTopic(event.target.value)}>{practiceTopics.map((item) => <option value={item.value} key={item.value}>{item.labels[locale]}</option>)}</select></label>}
        {mode === 'cumulative' && <><label>{locale === 'zh' ? '起始讲' : 'From lecture'}<input type="number" min={firstLecture} max="27" value={rangeStart} onChange={(event) => setRangeStart(Number(event.target.value))} /></label><label>{locale === 'zh' ? '结束讲' : 'To lecture'}<input type="number" min={firstLecture} max="27" value={rangeEnd} onChange={(event) => setRangeEnd(Number(event.target.value))} /></label></>}
        <label>{locale === 'zh' ? '难度' : 'Difficulty'}<select value={difficulty} onChange={(event) => setDifficulty(Number(event.target.value))}><option value="0">{locale === 'zh' ? '全部' : 'All'}</option>{[1, 2, 3, 4, 5].map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
        <label>{locale === 'zh' ? '题数' : 'Questions'}<select value={count} onChange={(event) => setCount(Number(event.target.value))}><option value="5">5</option><option value="10">10</option><option value="15">15</option></select></label>
        <button type="button" onClick={start}>{locale === 'zh' ? '开始练习' : 'Start practice'}</button>
      </div>
      {message && <p role="status">{message}</p>}
      {selected.length > 0 && (
        <div className="practice-session">
          <p className="practice-status">{locale === 'zh' ? `已答 ${completed}/${selected.length}${completed ? ` · 首答正确 ${correct}` : ''}` : `Answered ${completed}/${selected.length}${completed ? ` · Correct on first attempt ${correct}` : ''}`}</p>
          {selected.map((question) => <QuestionBlock locale={locale} key={`${sessionSeed}-${question.id}`} question={question} seed={sessionSeed} showSourceLink={false} onSubmit={(isCorrect) => setAnswers((current) => ({ ...current, [question.id]: isCorrect }))} />)}
          {completed === selected.length && (
            <section className="practice-summary" aria-live="polite">
              <h2>{locale === 'zh' ? '结果' : 'Results'}</h2>
              <p>{locale === 'zh' ? `首答正确 ${correct} / ${selected.length}` : `Correct on first attempt: ${correct} / ${selected.length}`}</p>
              {missedTags.length > 0 && <><h3>{locale === 'zh' ? '需要回看的概念' : 'Concepts to revisit'}</h3><ul>{missedTags.map((tag) => <li key={tag}>{tag}</li>)}</ul></>}
              <h3>{locale === 'zh' ? '正文链接' : 'Lesson links'}</h3>
              <ul>{selected.filter((question) => answers[question.id] === false).map((question) => <li key={question.id}><Link href={localizedHref(locale, `/lectures/${String(question.lecture).padStart(2, '0')}/#${question.sectionId}`)}>{locale === 'zh' ? `第 ${question.lecture} 讲` : `Lecture ${question.lecture}`} · <ScientificText text={question.stem} /></Link></li>)}</ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
