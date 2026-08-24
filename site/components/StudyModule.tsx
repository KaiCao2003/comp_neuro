'use client';

import katex from 'katex';
import { type ReactNode, useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import { assetPath } from '@/lib/site';
import {
  getSocraticModuleProgress,
  recordSocraticProgress,
  removeSocraticModuleProgress,
  type SocraticMastery,
} from '@/lib/socratic-state';
import type { FigureIndexEntry, StudyModule as StudyModuleData } from '@/lib/types';
import { ScientificFigure } from './ScientificFigure';
import styles from './StudyModule.module.css';

function MathStep({ latex, label }: { latex: string; label: string }) {
  return <div className="study-math" aria-label={label} dangerouslySetInnerHTML={{ __html: katex.renderToString(latex, { throwOnError: false, displayMode: true, output: 'htmlAndMathml' }) }} />;
}

function StepLead({ number, title, children, id }: { number: number; title: string; children?: ReactNode; id?: string }) {
  return <div className={styles.sectionLead}><p className={styles.stepNumber}>{number}</p><div><h4 id={id}>{title}</h4>{children}</div></div>;
}

function AttemptField({ id, label, placeholder, value, onChange, paper, onPaper, paperLabel, buttonLabel, onCommit }: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  paper: boolean;
  onPaper: (value: boolean) => void;
  paperLabel: string;
  buttonLabel: string;
  onCommit: () => void;
}) {
  const ready = paper || value.trim().replace(/\s+/g, ' ').length >= 20;
  return <div className={styles.attemptBox}>
    <label className={styles.textareaLabel} htmlFor={id}>{label}</label>
    <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={5} />
    <label className={styles.paperOption}><input type="checkbox" checked={paper} onChange={(event) => onPaper(event.target.checked)} /><span>{paperLabel}</span></label>
    <button type="button" onClick={onCommit} disabled={!ready}>{buttonLabel}</button>
  </div>;
}

type UiProgress = {
  opened: boolean;
  direct: boolean;
  example: boolean;
  selfCheck: boolean;
  mastery: SocraticMastery | null;
  confidence: 1 | 2 | 3 | 4 | 5;
  restored: boolean;
};

const initialProgress: UiProgress = { opened: false, direct: false, example: false, selfCheck: false, mastery: null, confidence: 3, restored: false };

export function StudyModule({ module, locale = 'zh', figures = [], afterFigure }: { module: StudyModuleData; locale?: Locale; figures?: FigureIndexEntry[]; afterFigure?: ReactNode }) {
  const zh = locale === 'zh';
  const t = (chinese: string, english: string) => zh ? chinese : english;
  const [progress, setProgress] = useState<UiProgress>(initialProgress);
  const [drafts, setDrafts] = useState({ prediction: '', example: '', selfCheck: '' });
  const [paper, setPaper] = useState({ prediction: false, example: false, selfCheck: false });
  const [hintLevel, setHintLevel] = useState(0);

  const hints = [
    t('先列出对象、变量、方向和可观测量，不要急着写结论。', 'First list the objects, variables, directions, and observables; do not rush to the conclusion.'),
    module.derivation?.symbolNotes[0] ?? t('把口头结论改写成“输入 → 变换或动力学 → 可观测输出”。', 'Rewrite the claim as “input → transformation or dynamics → observable output.”'),
    module.keyPoints[0],
  ];

  useEffect(() => {
    const saved = getSocraticModuleProgress(module.id);
    if (!saved) return;
    // Browser-only evidence is applied after static hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress({
      opened: saved.predictionCommitted,
      direct: saved.openedDirectly === true,
      example: saved.exampleAttempted,
      selfCheck: saved.selfCheckCompared,
      mastery: saved.mastery ?? null,
      confidence: saved.initialConfidence ?? 3,
      restored: true,
    });
  }, [module.id]);

  function enterLesson(direct: boolean) {
    const next = { ...progress, opened: true, direct };
    setProgress(next);
    recordSocraticProgress(module.id, { predictionCommitted: true, openedDirectly: direct, initialConfidence: progress.confidence });
  }

  function revealExample() {
    setProgress((current) => ({ ...current, example: true }));
    recordSocraticProgress(module.id, { exampleAttempted: true });
  }

  function revealSelfCheck() {
    setProgress((current) => ({ ...current, selfCheck: true }));
    recordSocraticProgress(module.id, { selfCheckCompared: true });
  }

  function recordMastery(mastery: SocraticMastery) {
    if (mastery === 'independent' && progress.direct) return;
    setProgress((current) => ({ ...current, mastery }));
    recordSocraticProgress(module.id, { mastery });
  }

  function reset() {
    removeSocraticModuleProgress(module.id);
    setProgress(initialProgress);
    setDrafts({ prediction: '', example: '', selfCheck: '' });
    setPaper({ prediction: false, example: false, selfCheck: false });
    setHintLevel(0);
  }

  const predictionReady = paper.prediction || drafts.prediction.trim().replace(/\s+/g, ' ').length >= 20;
  const masteryMessage = progress.mastery === 'independent'
    ? t('已记录为“可独立迁移”；题库仍会安排延迟复习。', 'Recorded as independent transfer mastery; the question bank will still schedule delayed review.')
    : progress.mastery === 'with-support'
      ? t('已标记为需要提示；稍后闭卷重做例题和自检。', 'Marked for prompted review; reattempt the example and self-check closed-book later.')
      : progress.mastery === 'not-yet'
        ? t('已标记为尚未掌握；回到变量、假设和可证伪预测后再试。', 'Marked as not yet mastered; return to the variables, assumptions, and falsifiable prediction.')
        : null;

  return <article className={`study-module ${styles.module}`} id={module.id}>
    <header>
      <p className={styles.phaseLabel}>{t('苏格拉底学习环 · 预测 → 追问 → 学习 → 练习 → 迁移', 'Socratic loop · Predict → Probe → Learn → Practice → Transfer')}</p>
      <h3>{module.title}</h3>
      <p className="study-source-refs">{module.sourceRefs.map((ref, index) => <span key={`${ref.file}-${ref.page}`}>{index > 0 ? ' · ' : ''}<a href={`${assetPath(`/resources/original/${encodeURIComponent(ref.file)}`)}#page=${ref.page}`} target="_blank" rel="noreferrer">{ref.file}{t(`，第 ${ref.page} 页`, `, p. ${ref.page}`)}</a></span>)}</p>
    </header>

    <noscript><style>{`.${styles.concealed},.${styles.solutionConcealed}{display:block!important}`}</style><p className={styles.noScript}>{t('浏览器未运行 JavaScript，因此已显示全部教材；请仍先在纸上作答。', 'JavaScript is unavailable, so all lesson content is visible; still answer on paper before reading each solution.')}</p></noscript>

    <section className={styles.entry} aria-labelledby={`${module.id}-entry`}>
      <div className={styles.entryHeader}><StepLead number={1} id={`${module.id}-entry`} title={t('先作答，再看讲解', 'Commit an answer before reading')} />{progress.opened && <button type="button" className={styles.resetButton} onClick={reset}>{t('重做本单元', 'Restart module')}</button>}</div>
      {progress.restored && <p className={styles.restored} role="status">{progress.mastery === 'independent' && !progress.direct ? t('此前已完成本单元，可随时重做。', 'Previously completed; restart at any time.') : t('此前已学习，但尚未留下独立迁移证据。', 'Previously studied, but independent transfer evidence is incomplete.')}</p>}
      <p className="guiding-question"><strong>{t('核心问题：', 'Core question: ')}</strong>{module.guidingQuestion}</p>
      {!progress.opened && <>
        <p>{t('不要查正文。写下目前最好的、可被数据推翻的解释；输入文字不会被保存或自动评分。', 'Do not consult the lesson. Write your best testable account; entered text is neither stored nor automatically graded.')}</p>
        <div className={styles.probes}><h5>{t('继续追问自己', 'Probe your account')}</h5><ol>
          <li>{t('哪些量是输入、状态与输出？哪些条件保持不变？', 'Which quantities are inputs, states, and outputs? What is held fixed?')}</li>
          <li>{t('结论依赖什么假设？删掉该假设会怎样？', 'Which assumption makes the conclusion valid? What changes if it is removed?')}</li>
          <li>{t('什么数据、反例或极限情况会证明解释错了？', 'What data, counterexample, or limiting case would falsify the account?')}</li>
        </ol></div>
        <label className={styles.textareaLabel} htmlFor={`${module.id}-prediction`}>{t('你的初始解释', 'Your initial explanation')}</label>
        <textarea id={`${module.id}-prediction`} value={drafts.prediction} onChange={(event) => setDrafts((current) => ({ ...current, prediction: event.target.value }))} placeholder={t('写出变量、推理链、关键假设和可证伪观察……', 'Name the variables, reasoning chain, key assumptions, and a falsifying observation…')} rows={6} />
        <label className={styles.paperOption}><input type="checkbox" checked={paper.prediction} onChange={(event) => setPaper((current) => ({ ...current, prediction: event.target.checked }))} /><span>{t('我已在纸上完整作答', 'I completed a full answer on paper')}</span></label>
        <label className={styles.confidenceLabel} htmlFor={`${module.id}-confidence`}><span>{t('作答前信心', 'Confidence before instruction')}</span><select id={`${module.id}-confidence`} value={progress.confidence} onChange={(event) => setProgress((current) => ({ ...current, confidence: Number(event.target.value) as UiProgress['confidence'] }))}><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></label>
        {hintLevel > 0 && <ol className={styles.hints} aria-live="polite">{hints.slice(0, hintLevel).map((hint, index) => <li key={`${module.id}-hint-${index}`}>{hint}</li>)}</ol>}
        <div className={styles.actions}>
          <button type="button" className="text-button" onClick={() => setHintLevel((value) => Math.min(hints.length, value + 1))} disabled={hintLevel >= hints.length}>{t('给一个分层提示', 'Reveal a staged hint')}</button>
          <button type="button" onClick={() => enterLesson(false)} disabled={!predictionReady}>{t('提交解释并进入正文', 'Commit and enter the lesson')}</button>
          <button type="button" className={styles.directButton} onClick={() => enterLesson(true)}>{t('直接展开（不计掌握）', 'Open directly (not mastery evidence)')}</button>
        </div>
      </>}
    </section>

    <div className={progress.opened ? styles.revealed : styles.concealed}>
      <section className={styles.teaching} aria-labelledby={`${module.id}-teaching`}>
        <StepLead number={2} id={`${module.id}-teaching`} title={t('检验并修正你的模型', 'Test and revise your model')}><p>{t('比较正文与你的初始解释：哪里被支持、限制或推翻？', 'Compare the lesson with your initial account: what is supported, constrained, or overturned?')}</p></StepLead>
        {progress.direct && <p className={styles.directNotice}>{t('这是参考阅读路径，不会计为独立掌握。', 'This reference-reading path does not count as independent mastery.')}</p>}
        {module.paragraphs.map((paragraph, index) => <p key={`${module.id}-p-${index}`}>{paragraph}</p>)}
        {figures.map((figure) => <ScientificFigure locale={locale} figure={figure} key={figure.id} />)}
        {figures.length > 0 && afterFigure}
        <div className="study-key-points"><h4>{t('读完应能独立解释', 'Explain independently after reading')}</h4><ul>{module.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul></div>
      </section>

      {module.derivation && <section className="study-derivation" aria-labelledby={`${module.id}-derivation`}>
        <StepLead number={3} id={`${module.id}-derivation`} title={module.derivation.title}><p>{module.derivation.setup}</p><p className={styles.instruction}>{t('只先看每步标题，预测下一步后再展开。', 'Read each step title, predict the next move, then expand it.')}</p></StepLead>
        <ol className={`derivation-steps ${styles.derivationSteps}`}>{module.derivation.steps.map((step, index) => <li key={`${module.id}-step-${index}`}><details><summary><strong>{step.title}</strong></summary><p>{step.explanation}</p>{step.latex && <MathStep latex={step.latex} label={`${module.derivation?.title}: ${step.title}`} />}</details></li>)}</ol>
        <dl className="derivation-checks"><div><dt>{t('符号', 'Symbols')}</dt><dd><ul>{module.derivation.symbolNotes.map((note) => <li key={note}>{note}</li>)}</ul></dd></div><div><dt>{t('单位检查', 'Units check')}</dt><dd>{module.derivation.unitsCheck}</dd></div><div><dt>{t('极限检查', 'Limit check')}</dt><dd>{module.derivation.limitCheck}</dd></div></dl>
      </section>}

      <section className={`worked-example ${styles.worked}`} aria-labelledby={`${module.id}-example`}>
        <StepLead number={module.derivation ? 4 : 3} id={`${module.id}-example`} title={`${t('例题：', 'Worked example: ')}${module.workedExample.title}`}><p>{t('先写已知量、目标、第一步和检查方法，再看解答。', 'Identify givens, target, first step, and a check before revealing the solution.')}</p></StepLead>
        <p><strong>{t('题目。', 'Problem. ')}</strong>{module.workedExample.problem}</p>
        {!progress.example && <AttemptField id={`${module.id}-example-draft`} label={t('你的解题草稿', 'Your solution draft')} placeholder={t('列式、画图、写伪代码或文字说明均可……', 'Equations, sketches, pseudocode, or prose are acceptable…')} value={drafts.example} onChange={(value) => setDrafts((current) => ({ ...current, example: value }))} paper={paper.example} onPaper={(value) => setPaper((current) => ({ ...current, example: value }))} paperLabel={t('我已在纸上独立尝试', 'I attempted it independently on paper')} buttonLabel={t('提交尝试并查看解答', 'Commit attempt and reveal solution')} onCommit={revealExample} />}
        <div className={progress.example ? styles.solutionRevealed : styles.solutionConcealed}><h5>{t('逐步解答', 'Step-by-step solution')}</h5><ol>{module.workedExample.steps.map((step) => <li key={step}>{step}</li>)}</ol><p><strong>{t('答案。', 'Result. ')}</strong>{module.workedExample.result}</p><p><strong>{t('检查。', 'Check. ')}</strong>{module.workedExample.sanityCheck}</p></div>
      </section>

      <aside className={`study-self-check ${styles.selfCheck}`} aria-labelledby={`${module.id}-self-check`}>
        <StepLead number={module.derivation ? 5 : 4} id={`${module.id}-self-check`} title={t('闭卷复述与迁移检查', 'Closed-book explanation and transfer check')}><p>{t('不要上滚查看正文；说明为什么，而不只是写结论。', 'Do not scroll back; explain why rather than stating only the conclusion.')}</p></StepLead>
        <p className={styles.selfPrompt}>{module.selfCheck.prompt}</p>
        {!progress.selfCheck && <AttemptField id={`${module.id}-self-check-draft`} label={t('你的回答', 'Your answer')} placeholder={t('写出机制、推理链或计算依据……', 'State the mechanism, reasoning chain, or computational basis…')} value={drafts.selfCheck} onChange={(value) => setDrafts((current) => ({ ...current, selfCheck: value }))} paper={paper.selfCheck} onPaper={(value) => setPaper((current) => ({ ...current, selfCheck: value }))} paperLabel={t('我已在纸上回答', 'I answered on paper')} buttonLabel={t('提交并比较参考答案', 'Commit and compare with reference')} onCommit={revealSelfCheck} />}
        <div className={progress.selfCheck ? styles.solutionRevealed : styles.solutionConcealed}><h5>{t('参考答案', 'Reference answer')}</h5><p>{module.selfCheck.answer}</p><p className={styles.comparePrompt}>{t('逐句比较：遗漏的是概念、假设、推导步骤，还是迁移能力？', 'Compare sentence by sentence: did you miss a concept, assumption, derivation step, or transfer ability?')}</p></div>
      </aside>

      <div className="study-pitfalls"><h4>{t('用反例检查常见错误', 'Test common failure modes')}</h4><ul>{module.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}</ul></div>

      <section className={`${styles.mastery} ${progress.selfCheck ? styles.revealed : styles.concealed}`} aria-labelledby={`${module.id}-mastery`}>
        <h4 id={`${module.id}-mastery`}>{t('记录掌握证据', 'Record mastery evidence')}</h4>
        <p>{t('不看正文时，能否解释机制、重建推理，并预测条件改变后的结果？', 'Without looking back, can you explain the mechanism, reconstruct the reasoning, and predict changed conditions?')}</p>
        <div className={styles.masteryChoices} role="group" aria-label={t('掌握程度', 'Mastery level')}>
          <button type="button" aria-pressed={progress.mastery === 'independent'} onClick={() => recordMastery('independent')} disabled={progress.direct}>{t('能独立解释并迁移', 'Independent explanation and transfer')}</button>
          <button type="button" aria-pressed={progress.mastery === 'with-support'} onClick={() => recordMastery('with-support')}>{t('理解，但仍需提示', 'Understand, but still need prompts')}</button>
          <button type="button" aria-pressed={progress.mastery === 'not-yet'} onClick={() => recordMastery('not-yet')}>{t('还不能稳定完成', 'Not yet reliable')}</button>
        </div>
        {masteryMessage && <p className={styles.masteryMessage} role="status">{masteryMessage}</p>}
      </section>
    </div>
  </article>;
}
