import type { Question } from './types';

export const practiceTopics = [
  { value: 'probability', labels: { zh: '概率', en: 'Probability' }, terms: ['probability', '概率', 'Bayes', 'Bernoulli', 'likelihood', 'posterior'], lectures: [2, 6, 7] },
  { value: 'ode', labels: { zh: '微分方程', en: 'Differential equations' }, terms: ['ODE', '微分方程', 'differential equation', 'Euler', 'nullcline'], lectures: [3, 4, 5, 9, 18, 20, 21, 23] },
  { value: 'lif', labels: { zh: 'LIF', en: 'LIF' }, terms: ['LIF', 'leaky integrate-and-fire', 'integrate-and-fire'], lectures: [4, 5] },
  { value: 'hodgkin', labels: { zh: 'Hodgkin-Huxley', en: 'Hodgkin–Huxley' }, terms: ['Hodgkin', 'Huxley', 'HH model'], lectures: [5] },
  { value: 'fisher', labels: { zh: 'Fisher information', en: 'Fisher information' }, terms: ['Fisher information', 'Fisher 信息', 'Cramér-Rao'], lectures: [6, 7] },
  { value: 'recurrent', labels: { zh: '递归网络', en: 'Recurrent networks' }, terms: ['recurrent', '递归网络', '反馈网络'], lectures: [8, 9, 17, 18, 20, 21, 23, 26] },
  { value: 'plasticity', labels: { zh: '可塑性', en: 'Plasticity' }, terms: ['plasticity', '可塑性', 'Hebbian', 'STDP'], lectures: [10, 24, 25, 26] },
  { value: 'machine-learning', labels: { zh: '机器学习', en: 'Machine learning' }, terms: ['machine learning', '机器学习', 'regression', 'backpropagation'], lectures: [11, 19, 22, 27] },
  { value: 'receptive-field', labels: { zh: '感受野', en: 'Receptive fields' }, terms: ['receptive field', '感受野', 'LNP'], lectures: [12, 13, 14, 17] },
  { value: 'sta-stc-glm', labels: { zh: 'STA / STC / GLM', en: 'STA / STC / GLM' }, terms: ['STA', 'STC', 'GLM', 'spike-triggered'], lectures: [13, 14] },
  { value: 'information', labels: { zh: '高效编码', en: 'Efficient coding' }, terms: ['efficient coding', '高效编码', 'mutual information', 'entropy'], lectures: [15] },
  { value: 'fourier', labels: { zh: 'Fourier', en: 'Fourier analysis' }, terms: ['Fourier', 'power spectrum', '频谱'], lectures: [16] },
  { value: 'pca', labels: { zh: 'PCA', en: 'PCA' }, terms: ['PCA', 'principal component', '主成分'], lectures: [19, 22] },
  { value: 'dynamics', labels: { zh: '动力学', en: 'Dynamics' }, terms: ['dynamics', '动力学', 'eigenvalue', 'phase plane'], lectures: [18, 20, 21, 22, 23] },
  { value: 'cpg', labels: { zh: 'CPG', en: 'CPG' }, terms: ['CPG', 'central pattern generator', '中央模式发生器'], lectures: [20] },
  { value: 'decision', labels: { zh: '决策', en: 'Decision-making' }, terms: ['decision', '决策', 'drift diffusion', 'evidence accumulation'], lectures: [23] },
  { value: 'reward', labels: { zh: '奖励学习', en: 'Reward learning' }, terms: ['reward', '奖励', 'RPE', 'prediction error'], lectures: [24, 25] },
  { value: 'q-learning', labels: { zh: 'Q-learning', en: 'Q-learning' }, terms: ['Q-learning', 'Bellman', 'MDP'], lectures: [25] },
  { value: 'hopfield', labels: { zh: 'Hopfield', en: 'Hopfield networks' }, terms: ['Hopfield', 'associative memory', '联想记忆'], lectures: [26] },
  { value: 'consolidation', labels: { zh: '巩固与泛化', en: 'Consolidation and generalization' }, terms: ['consolidation', '巩固', 'generalization', '泛化'], lectures: [27] },
] as const;

export type PracticeTopic = (typeof practiceTopics)[number];

function includesTerm(text: string, term: string) {
  if (/[\u3400-\u9fff]/.test(term)) return text.toLocaleLowerCase().includes(term.toLocaleLowerCase());
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(text);
}

export function questionMatchesTopic(question: Question, topic: PracticeTopic) {
  if ((topic.lectures as readonly number[]).includes(question.lecture)) return true;
  const searchable = `${question.stem} ${question.explanation} ${question.conceptTags.join(' ')}`;
  return topic.terms.some((term) => includesTerm(searchable, term));
}
