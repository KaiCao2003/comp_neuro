import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { QuestionBlock } from '../components/QuestionBlock';
import { ScientificFigure } from '../components/ScientificFigure';
import { ScientificText } from '../components/ScientificText';
import { StudyModule } from '../components/StudyModule';
import {
  inferScientificText as parseScientificText,
  normalizeScientificLatex,
  parseScientificText as parseExplicitScientificText,
} from '../lib/scientific-text';

const rawRegressionParagraph = '分离变量得到 dy/y=−dt/τ，积分后 ln|y|=−t/τ+C，再指数化为 y=Ae^{−t/τ}。利用 y(0)=x₀−I 可知 A=x₀−I，因此 x(t)=I+(x₀−I)e^{−t/τ}。公式由稳态 I 与逐渐消失的初值记忆组成，二者含义比孤立背诵表达式更重要。';
const regressionParagraph = '分离变量得到 \\(dy/y=-dt/\\tau\\)，积分后 \\(\\ln|y|=-t/\\tau +C\\)，再指数化为 \\(y=Ae^{-t/\\tau }\\)。利用 \\(y(0)=x_{0}-I\\) 可知 \\(A=x_{0}-I\\)，因此 \\(x(t)=I+(x_{0}-I)e^{-t/\\tau }\\)。公式由稳态 I 与逐渐消失的初值记忆组成，二者含义比孤立背诵表达式更重要。';

const positiveFixtures: Array<[string, string]> = [
  ['因此 x(t)=I+(x₀−I)e^{−t/τ}。', 'x(t)=I+(x₀−I)e^{−t/τ}'],
  ['模型 r(s) = [ws + b]+ ≡ max(0, ws + b)。', 'r(s) = [ws + b]+ ≡ max(0, ws + b)'],
  ['更新 x_{n+1}=x_n+Δt f(x_n,t_n)。', 'x_{n+1}=x_n+Δt f(x_n,t_n)'],
  ['定义 e_i=r_i−r_hat_i。', 'e_i=r_i−r_hat_i'],
  ['若 V_m=φ_in−φ_out，则内侧更低。', 'V_m=φ_in−φ_out'],
  ['支路满足 I_ion=G_ion(V_m−E_ion)。', 'I_ion=G_ion(V_m−E_ion)'],
  ['于是 P(X>0.2)=exp(−λ·0.2)=exp(−1)≈0.368。', 'P(X>0.2)=exp(−λ·0.2)=exp(−1)≈0.368'],
  ['稳定要求 0<Δt/τ<2。', '0<Δt/τ<2'],
  ['因为 det(C)=3·8−4·6=0，所以不可逆。', 'det(C)=3·8−4·6=0'],
  ['所以 E[X²]−E[X]²=p−p²=p(1−p)。', 'E[X²]−E[X]²=p−p²=p(1−p)'],
  ['令 λ=5 s⁻¹。', 'λ=5 s⁻¹'],
  ['得到 x(10 ms)≈3.16。', 'x(10 ms)≈3.16'],
  ['其中 criticalalpha_c≈0.138。', 'criticalalpha_c≈0.138'],
  ['因为 C(4,−3)ᵀ=(0,0)ᵀ。', 'C(4,−3)ᵀ=(0,0)ᵀ'],
  ['链为 s→n→y。', 's→n→y'],
];

const negativeFixtures = [
  'A continuous first-order state has trial-to-trial variability.',
  'E/I balance is not instantaneous equality.',
  'Na/K conductances shape the waveform.',
  'Cells A/B alternate at 2 Hz.',
  'Lines 1-3 — Reset.',
  'Course date 2025-08-23.',
  'Avoid correlation=mechanism.',
  '“Hebbian=PCA” is not universal.',
  'Use `time<0.250` and `x(i)=x(i-1)+dt*(-x(i-1)+I(i-1))/tau`.',
  'Open Lecture3_Diff_Eq_MATLAB.m for the source.',
];

describe('scientific inline text', () => {
  it('migrates every equation in the original lecture 3 regression paragraph', () => {
    const math = parseScientificText(rawRegressionParagraph)
      .filter((segment) => segment.kind === 'math')
      .map((segment) => segment.value);

    expect(math).toEqual([
      'dy/y=−dt/τ',
      'ln|y|=−t/τ+C',
      'y=Ae^{−t/τ}',
      'y(0)=x₀−I',
      'A=x₀−I',
      'x(t)=I+(x₀−I)e^{−t/τ}',
    ]);
  });

  it('renders only explicitly delimited formulas at runtime', () => {
    expect(parseExplicitScientificText(rawRegressionParagraph)).toEqual([{ kind: 'text', value: rawRegressionParagraph }]);
    expect(parseExplicitScientificText(regressionParagraph).filter((segment) => segment.kind === 'math').map((segment) => segment.value)).toEqual([
      'dy/y=-dt/\\tau',
      '\\ln|y|=-t/\\tau +C',
      'y=Ae^{-t/\\tau }',
      'y(0)=x_{0}-I',
      'A=x_{0}-I',
      'x(t)=I+(x_{0}-I)e^{-t/\\tau }',
    ]);
  });

  it('supports explicit TeX and preserves backtick code', () => {
    expect(parseExplicitScientificText('由 \\(x_0=e^{-t/\\tau}\\) 得到 `time<0.250`。')).toEqual([
      { kind: 'text', value: '由 ' },
      { kind: 'math', value: 'x_0=e^{-t/\\tau}' },
      { kind: 'text', value: ' 得到 ' },
      { kind: 'code', value: 'time<0.250' },
      { kind: 'text', value: '。' },
    ]);
  });

  it('normalizes Unicode scripts, Greek symbols, and MATLAB left division to LaTeX', () => {
    expect(normalizeScientificLatex('x₀=e⁻¹, τ=10, d²x/dt², B\\y, K̂, x∈ℝ')).toBe('x_{0}=e^{-1}, \\tau =10, d^{2}x/dt^{2}, B\\backslash y, \\hat{K}, x\\in \\mathbb{R}');
    expect(normalizeScientificLatex('x(t) = I + (x0 − I)e−t/τ, V_inf, τeff')).toBe('x(t) = I + (x_{0} - I)e^{-t/\\tau }, V_{\\mathrm{inf}}, \\tau _{\\mathrm{eff}}');
    expect(parseScientificText('设 x∈ℝ，估计量为 K̂。').filter((segment) => segment.kind === 'math').map((segment) => segment.value)).toEqual(['x∈ℝ', 'K̂']);
  });

  it('preserves scientific multiplication and exponential semantics during normalization', () => {
    expect(normalizeScientificLatex('A∈R⁴ˣ²')).toBe('A\\in \\mathbb{R}^{4\\times 2}');
    expect(normalizeScientificLatex('e^{at}, e^{−rt}, e^{-kt}')).toBe('e^{at}, e^{-rt}, e^{-kt}');
    expect(normalizeScientificLatex('f(x)=λexp(−λx)')).toBe('f(x)=\\lambda \\exp(-\\lambda x)');
    expect(normalizeScientificLatex('V_m=inside−outside')).toBe('V_{m}=\\mathrm{inside}-\\mathrm{outside}');
    expect(normalizeScientificLatex('A_ij=Wii+uvᵀ+rad⁻²')).toBe('A_{ij}=W_{ii}+uv^{\\mathrm{T}}+\\mathrm{rad}^{-2}');
    expect(normalizeScientificLatex('e−i2πξ·x')).toBe('e^{-i2\\pi \\xi }\\cdot x');
    expect(normalizeScientificLatex('Ca²+')).toBe('\\mathrm{Ca}^{2+}');
  });

  it('normalizes balanced source notation without changing adjacent products', () => {
    expect(normalizeScientificLatex('e^(−t/τ)')).toBe('e^{-t/\\tau }');
    expect(normalizeScientificLatex('ξ^(μ)')).toBe('\\xi ^{\\mu }');
    expect(normalizeScientificLatex('σ=1/√(NT)')).toBe('\\sigma =1/\\sqrt{NT}');
    expect(normalizeScientificLatex('√(x²+y²)')).toBe('\\sqrt{x^{2}+y^{2}}');
    expect(normalizeScientificLatex('V∞=V_T')).toBe('V_{\\infty }=V_{T}');
    expect(normalizeScientificLatex('e^{ibt}=cos(bt)+i sin(bt)')).toBe('e^{ibt}=\\cos(bt)+i \\sin(bt)');
    expect(normalizeScientificLatex('W11W22+ACA^T')).toBe('W_{11}W_{22}+ACA^\\mathrm{T}');
    expect(normalizeScientificLatex('J≈NTj_f')).toBe('J\\approx NTj_{f}');
    expect(normalizeScientificLatex('L1=Acosφ')).toBe('L_{1}=A\\cos\\phi ');
    expect(normalizeScientificLatex('λ_ka_k+W_ijh_j+e^{λ_kt/τ_w}')).toBe('\\lambda _{k}a_{k}+W_{ij}h_{j}+e^{\\lambda _{k}t/\\tau _{w}}');
    expect(normalizeScientificLatex('V_m=φ_in−φ_out')).toBe('V_{m}=\\phi _{\\mathrm{in}}-\\phi _{\\mathrm{out}}');
    expect(normalizeScientificLatex('c_out/c_in=1')).toBe('c_{\\mathrm{out}}/c_{\\mathrm{in}}=1');
    expect(normalizeScientificLatex('|K̂|²P_in=4')).toBe('|\\hat{K}|^{2}P_{\\mathrm{in}}=4');
    expect(normalizeScientificLatex('z̃_i=Σ_jV_ijξ_j')).toBe('\\widetilde{z}_i=\\sum _jV_{ij}\\xi _{j}');
  });

  it('normalizes high-risk scientific notation to exact semantic LaTeX', () => {
    const cases: Array<[string, string]> = [
      ['E_Na+G_Na+n_Na', 'E_{\\mathrm{Na}}+G_{\\mathrm{Na}}+n_{\\mathrm{Na}}'],
      ['w_EE+w_EI+w_IE+w_II', 'w_{\\mathrm{EE}}+w_{\\mathrm{EI}}+w_{\\mathrm{IE}}+w_{\\mathrm{II}}'],
      ['[K]out/[K]in', '[K]_{\\mathrm{out}}/[K]_{\\mathrm{in}}'],
      ['Σ_jWijS_j', '\\sum _j W_{ij} S_{j}'],
      ['WijS_iS_j', 'W_{ij}S_{i}S_{j}'],
      ['Δw=A_+e^{-Δt/τ_+}', '\\Delta w=A_{+}e^{-\\Delta t/\\tau _{+}}'],
      ['(-1±4i)/0.2=-5±20i s^-1', '(-1\\pm 4i)/0.2=-5\\pm 20i s^{-1}'],
      ['λ1≥λ2≥...≥λN', '\\lambda _{1}\\ge \\lambda _{2}\\ge \\cdots \\ge \\lambda _{N}'],
      ['Vπ(s)=Eπ[Gt|st=s]', 'V_{\\pi }(s)=E_{\\pi }[G_{t}|s_{t}=s]'],
      ['Vπ(s)=Σaπ(a|s)Qπ(s,a)', 'V_{\\pi }(s)=\\sum _{a}\\pi (a|s)Q_{\\pi }(s,a)'],
      ['y = Ax + ηᵧ', 'y = Ax + \\eta _{y}'],
      ['A Cₓ Aᵀ', 'A C_{x} A^{\\mathrm{T}}'],
    ];
    for (const [source, expected] of cases) expect(normalizeScientificLatex(source), source).toBe(expected);
  });

  it('keeps high-risk formula candidates whole during authored-content migration', () => {
    const cases: Array<[string, string[]]> = [
      ['Use [K]in>[K]out.', ['[K]in>[K]out']],
      ['The interaction is Σ_jWijS_j.', ['Σ_jWijS_j']],
      ['The energy term is WijS_iS_j.', ['WijS_iS_j']],
      ['The eigenvalues are (-1±4i)/0.2=-5±20i s^-1.', ['(-1±4i)/0.2=-5±20i s^-1']],
      ['The steady state I* is distinct from the input.', ['I*']],
      ['Other neurons use Σ cᵢⱼ * yⱼ.', ['Σ cᵢⱼ * yⱼ']],
      ['The covariance is A Cₓ Aᵀ.', ['A Cₓ Aᵀ']],
      ['The policy identity is Vπ(s)=Σaπ(a|s)Qπ(s,a).', ['Vπ(s)=Σaπ(a|s)Qπ(s,a)']],
      ['The numerator terms are 4·(−4) and 4·4.', ['4·(−4)', '4·4']],
      ['Check dt/tau before interpreting the Euler trace.', ['dt/tau']],
      ['Adding Σ acknowledges residual trial noise.', ['Σ']],
      ['Concluding from diagonal Σ that neurons are independent is incorrect.', ['Σ']],
    ];
    for (const [text, expected] of cases) {
      expect(parseScientificText(text).filter((segment) => segment.kind === 'math').map((segment) => segment.value), text).toEqual(expected);
    }
    expect(parseScientificText('Rapid Na⁺-channel opening changes the current.')).toEqual([{ kind: 'text', value: 'Rapid Na⁺-channel opening changes the current.' }]);
    expect(normalizeScientificLatex('Σ')).toBe('\\Sigma ');
  });

  it('does not absorb English lead-ins into equations', () => {
    const cases: Array<[string, string[]]> = [
      ['If λ=1, the mode persists.', ['λ=1']],
      ['Let x(t)=I+(x0−I)e−t/τ.', ['x(t)=I+(x0−I)e−t/τ']],
      ['For τ>0 the solution is stable.', ['τ>0']],
      ['At α+=0 and β-=1, compare the modes.', ['α+=0', 'β-=1']],
      ['For s≤s0, keep the numbered symbol intact.', ['s≤s0']],
    ];
    for (const [text, expectedMath] of cases) {
      expect(parseScientificText(text).filter((segment) => segment.kind === 'math').map((segment) => segment.value), text).toEqual(expectedMath);
    }
  });

  it('does not reinterpret the English word that as a hatted variable', () => {
    const cases: Array<[string, string[]]> = [
      ['Concluding from STA=0 that there is no relevant feature.', ['STA=0']],
      ['Forgetting that nS·mV=pA does not preserve units.', ['nS·mV=pA']],
    ];
    for (const [text, expectedMath] of cases) {
      const segments = parseScientificText(text);
      expect(segments.filter((segment) => segment.kind === 'math').map((segment) => segment.value), text).toEqual(expectedMath);
      expect(segments.filter((segment) => segment.kind === 'math').map((segment) => normalizeScientificLatex(segment.value)).join(' '), text).not.toContain('\\hat{t}');
    }
  });

  it('keeps differential coefficients, unit chains, and scripted operands whole', () => {
    const cases: Array<[string, string[]]> = [
      ['由 C dV/dt=I_e−G_L(V−E_L) 得到斜率。', ['C dV/dt=I_e−G_L(V−E_L)']],
      ['因此 τ_m dV/dt=−V+I。', ['τ_m dV/dt=−V+I']],
      ['系统满足 τ_h dh/dt=−h+F(I)。', ['τ_h dh/dt=−h+F(I)']],
      ['计算 dV/dt=−250 pA/200 pF=−1.25 V/s。', ['dV/dt=−250 pA/200 pF=−1.25 V/s']],
      ['矩阵满足 Wii=0 且 STA=0。', ['Wii=0', 'STA=0']],
      ['单位关系 nS·mV=pA。', ['nS·mV=pA']],
      ['阈值由 ws+b=0 决定。', ['ws+b=0']],
      ['乘积 uvᵀ 与 rad⁻² 以及 Ĩᵢ 都保留后缀。', ['uvᵀ', 'rad⁻²', 'Ĩᵢ']],
    ];
    for (const [text, expectedMath] of cases) {
      expect(parseScientificText(text).filter((segment) => segment.kind === 'math').map((segment) => segment.value), text).toEqual(expectedMath);
    }
    expect(parseScientificText('驱动² 只是中文标签，不能产生孤立上标。').filter((segment) => segment.kind === 'math')).toEqual([]);
    expect(parseScientificText('转置符号 ᵀ 表示 transpose。').filter((segment) => segment.kind === 'math').map((segment) => segment.value)).toEqual(['ᵀ']);
  });

  it('keeps compact derivatives, Teacher/Student notation, and indexed products whole', () => {
    const cases: Array<[string, string[]]> = [
      ['The equations are τ dh1/dt=-h1+w0h2+I1 and τ dh2/dt=-h2+w0h1+I2.', ['τ dh1/dt=-h1+w0h2+I1', 'τ dh2/dt=-h2+w0h1+I2']],
      ['Transforming gives τ dα+/dt=-(1-w0)α++β+ and τ dα-/dt=-(1+w0)α-+β-.', ['τ dα+/dt=-(1-w0)α++β+', 'τ dα-/dt=-(1+w0)α-+β-']],
      ['A minimal pair is τh dhi/dt=-hi+F(Ii-w hj-a_i).', ['τh dhi/dt=-hi+F(Ii-w hj-a_i)']],
      ['The Student predicts ŷ=wS^T x.', ['ŷ=wS^T x']],
      ['Memory error is e_m²=(1/P)Σ_μ(y_μ-wS^T x tilde_μ)².', ['e_m²=(1/P)Σ_μ(y_μ-wS^T x tilde_μ)²']],
      ['The flux is zF(φ_in−φ_out)=RT ln(c_out/c_in).', ['zF(φ_in−φ_out)=RT ln(c_out/c_in)']],
      ['The backup uses max_{a′}Q*(s′,a′).', ['max_{a′}Q*(s′,a′)']],
      ['Products satisfy λ_ka_k=1 and (Wh)_i=Σ_j W_ijh_j.', ['λ_ka_k=1', '(Wh)_i=Σ_j W_ijh_j']],
    ];
    for (const [text, expectedMath] of cases) {
      expect(parseScientificText(text).filter((segment) => segment.kind === 'math').map((segment) => segment.value), text).toEqual(expectedMath);
    }
  });

  it('keeps spaced logarithms and trigonometric functions inside their equations', () => {
    const cases: Array<[string, string[]]> = [
      ['Chemical potential satisfies μ=μ⁰+RT ln c+zFφ.', ['μ=μ⁰+RT ln c+zFφ']],
      ['Taking logs gives −t/τ=ln a.', ['−t/τ=ln a']],
      ['Because ln a<0, the time t=−τ ln a is positive.', ['ln a<0', 't=−τ ln a']],
      ['The rotation is x′ = x cos θ + y sin θ.', ['x′ = x cos θ + y sin θ']],
    ];
    for (const [text, expectedMath] of cases) {
      expect(parseScientificText(text).filter((segment) => segment.kind === 'math').map((segment) => segment.value), text).toEqual(expectedMath);
    }
  });

  it('recognizes compact scientific identifiers but not prose hyphens', () => {
    const text = 'Use wT=2, wS=3, maxQnext=4, Khat=K, what=Xy, yhat=Mx, at=a, trace=1.5, det=0.5, and Fano≈1.';
    expect(parseScientificText(text).filter((segment) => segment.kind === 'math').map((segment) => segment.value)).toEqual([
      'wT=2', 'wS=3', 'maxQnext=4', 'Khat=K', 'what=Xy', 'yhat=Mx', 'at=a', 'trace=1.5', 'det=0.5', 'Fano≈1',
    ]);
    for (const prose of ['A high-λ component transfers later.', 'Use a small-Δt approximation.', 'The low-λ component stops earlier.']) {
      expect(parseScientificText(prose).filter((segment) => segment.kind === 'math'), prose).toEqual([]);
    }
  });

  it('recognizes standalone scientific operators and stops signed mode labels before prose', () => {
    const cases: Array<[string, string[]]> = [
      ['As |c|→1, the correlation strengthens.', ['|c|→1']],
      ['Let N→∞ while variance falls.', ['N→∞']],
      ['The scale is 1/√J.', ['1/√J']],
      ['The gradient is ∂L/∂W.', ['∂L/∂W']],
      ['The steady state is V∞.', ['V∞']],
      ['The α± and β± are modal coordinates; τ± has time units.', ['α±', 'β±', 'τ±']],
      ['The equation is XX^T what=Xy and the prediction is yhat=Mx.', ['XX^T what=Xy', 'yhat=Mx']],
    ];
    for (const [text, expectedMath] of cases) {
      expect(parseScientificText(text).filter((segment) => segment.kind === 'math').map((segment) => segment.value), text).toEqual(expectedMath);
    }
  });

  it('keeps the full scientific fixture corpus lossless and correctly classified', () => {
    for (const [text, expectedMath] of positiveFixtures) {
      const segments = parseScientificText(text);
      expect(segments.map((segment) => segment.value).join(''), text).toBe(text);
      expect(segments.filter((segment) => segment.kind === 'math').map((segment) => segment.value), text).toEqual([expectedMath]);
      expect(() => katex.renderToString(normalizeScientificLatex(expectedMath), { throwOnError: true, strict: 'ignore' }), text).not.toThrow();
    }

    for (const text of negativeFixtures) {
      const segments = parseScientificText(text);
      const reconstructed = segments.map((segment) => segment.kind === 'code' ? `\`${segment.value}\`` : segment.value).join('');
      expect(reconstructed, text).toBe(text);
      expect(segments.filter((segment) => segment.kind === 'math'), text).toEqual([]);
    }

    const codeSegments = parseScientificText(negativeFixtures[8]).filter((segment) => segment.kind === 'code');
    expect(codeSegments.map((segment) => segment.value)).toEqual([
      'time<0.250',
      'x(i)=x(i-1)+dt*(-x(i-1)+I(i-1))/tau',
    ]);
  });

  it('recognizes Unicode subscripts and named scientific functions without partial salvage', () => {
    const cases = [
      ['总电流 ΣGₓ(Vₘ−Eₓ)=0。', 'ΣGₓ(Vₘ−Eₓ)=0'],
      ['噪声写成 ηᵢ(t)=0。', 'ηᵢ(t)=0'],
      ['阈值条件 Iₑ≤I_T。', 'Iₑ≤I_T'],
      ['计数满足 N_i|θ∼Poisson(f_i(θ)T)。', 'N_i|θ∼Poisson(f_i(θ)T)'],
      ['协方差 Cov(X,Y)=E[XY]−E[X]E[Y]。', 'Cov(X,Y)=E[XY]−E[X]E[Y]'],
    ];
    for (const [text, expectedMath] of cases) {
      expect(parseScientificText(text).filter((segment) => segment.kind === 'math').map((segment) => segment.value), text).toEqual([expectedMath]);
      expect(() => katex.renderToString(normalizeScientificLatex(expectedMath), { throwOnError: true, strict: 'ignore' }), text).not.toThrow();
    }
  });

  it('keeps a spaced equation whole and separates its prose condition', () => {
    expect(parseScientificText('x(t) = I + (x0 − I)e−t/τ. I is constant and τ>0')).toEqual([
      { kind: 'math', value: 'x(t) = I + (x0 − I)e−t/τ' },
      { kind: 'text', value: '. I is constant and ' },
      { kind: 'math', value: 'τ>0' },
    ]);
  });

  it('does not mistake prose, probability labels, or MATLAB identifiers for math', () => {
    const prose = [
      'first-order source-page shape/units voltage+current',
      'A psychometric function plots P(choice|signed coherence).',
      'Forgetting that current=conductance×driving force; increasing a gate does not by itself determine current direction.',
      'elseif t_values(t) < 0.250',
      'the strict condition < 0.250 leaves the endpoint undefined',
      'Use x(:,1) and x(:,2) as state columns.',
      'Open Lecture2-FC_NEUROSCI_366_F2025.pdf for the source.',
    ];
    for (const text of prose) expect(parseScientificText(text), text).toEqual([{ kind: 'text', value: text }]);
  });

  it('stops equations at explanatory colons without losing the equation', () => {
    expect(parseScientificText('由 V_m=φ_in−φ_out: if the inside is lower, V_m<0.').filter((segment) => segment.kind === 'math').map((segment) => segment.value)).toEqual([
      'V_m=φ_in−φ_out',
      'V_m<0',
    ]);
    expect(parseScientificText('λ < 1: leak').filter((segment) => segment.kind === 'math').map((segment) => segment.value)).toEqual(['λ < 1']);
  });

  it('keeps leading and trailing prose outside formulas and preserves absolute-value bars', () => {
    const cases = [
      ['Because −x+I<0, the state decreases.', '−x+I<0'],
      ['Require |1−Δt/τ|<1 for convergence.', '|1−Δt/τ|<1'],
      ['Mg²+ block is voltage dependent.', 'Mg²+'],
      ['The stages are F(L) + spike generation.', 'F(L)'],
      ['Standard descent lets η||∇L|| determine the step length.', 'η||∇L||'],
      ['The mode has λ=1 → weight-family degeneracy.', 'λ=1'],
      ['Loss L(w) (normalized) is plotted.', 'L(w)'],
    ];
    for (const [text, expectedMath] of cases) {
      expect(parseScientificText(text).filter((segment) => segment.kind === 'math').map((segment) => segment.value), text).toEqual([expectedMath]);
    }
  });

  it('renders explicit equations as accessible KaTeX instead of literal braces', () => {
    const html = renderToStaticMarkup(<p><ScientificText text={regressionParagraph} /></p>);
    expect(html).toContain('class="katex"');
    expect(html).toContain('class="katex-mathml"');
    expect(html).toContain('data-math-source="y=Ae^{-t/\\tau }"');
    expect(html).not.toContain('katex-error');
  });

  it('renders explicitly marked SVG labels with KaTeX and leaves unmarked lookalikes as SVG text', () => {
    const root = path.resolve(import.meta.dirname, '..');
    const lecture = JSON.parse(fs.readFileSync(path.join(root, 'content/lectures/03.json'), 'utf8'));
    const figure = lecture.figures.find((item: { id: string }) => item.id === 'L03-FIG-A1');
    expect(figure).toBeTruthy();

    const explicitHtml = renderToStaticMarkup(<ScientificFigure figure={figure} locale="zh" />);
    expect(explicitHtml).toContain('<foreignObject');
    expect(explicitHtml).toContain('class="katex"');
    expect(explicitHtml).toContain('class="katex-mathml"');
    expect(explicitHtml).toContain('data-math-source="e^{-t/\\tau }"');
    expect(explicitHtml).not.toContain('<title id="L03-FIG-A1-svg-title">一阶指数衰减的精确解与步长为半个时间常数的 Euler 离散点对比图 \\(');

    const unmarked = structuredClone(figure);
    unmarked.xLabel = '时间 t / 3τ';
    unmarked.yLabel = '归一化状态 x(t) / x₀';
    unmarked.curves = unmarked.curves.map((curve: { label: string }, index: number) => ({ ...curve, label: index ? 'Euler' : '精确解 e^(−t/τ)' }));
    unmarked.caption = '未标记的说明文字。';
    const unmarkedHtml = renderToStaticMarkup(<ScientificFigure figure={unmarked} locale="zh" />);
    expect(unmarkedHtml).not.toContain('<foreignObject');
    expect(unmarkedHtml).not.toContain('class="katex"');
    expect(unmarkedHtml).toContain('精确解 e^(−t/τ)');
  });

  it('keeps long inline formulas in scroll containers without creating nested tab stops', () => {
    const longHtml = renderToStaticMarkup(<ScientificText text={'\\(x(t)=I+(x_0-I)e^{-t/\\tau}+a+b+c+d+e+f\\)'} />);
    const shortHtml = renderToStaticMarkup(<ScientificText text={'\\(x=1\\)'} />);
    expect(longHtml).toContain('scientific-inline-math-scroll');
    expect(longHtml).not.toContain('tabindex=');
    expect(shortHtml).not.toContain('scientific-inline-math-scroll');
    expect(shortHtml).not.toContain('tabindex=');
  });

  it('renders the real lecture module and practice explanation through the shared component', () => {
    const root = path.resolve(import.meta.dirname, '..');
    const lecture = JSON.parse(fs.readFileSync(path.join(root, 'content/lectures/03.json'), 'utf8'));
    const englishLecture = JSON.parse(fs.readFileSync(path.join(root, 'content/en/lectures/03.json'), 'utf8'));
    const studyModule = lecture.studyGuide.modules.find((item: { paragraphs: string[] }) => item.paragraphs.includes(regressionParagraph));
    const question = englishLecture.questions.find((item: { explanation: string }) => parseExplicitScientificText(item.explanation).some((segment) => segment.kind === 'math' && segment.value === 'x(t) = I + (x_{0} - I)e^{-t/\\tau }'));

    expect(studyModule).toBeTruthy();
    expect(question).toBeTruthy();
    const moduleHtml = renderToStaticMarkup(<StudyModule module={studyModule} locale="zh" />);
    const questionHtml = renderToStaticMarkup(<QuestionBlock question={question} seed="scientific-text-regression" locale="en" />);
    expect(moduleHtml).toContain('data-math-source="y=Ae^{-t/\\tau }"');
    expect(questionHtml).toContain('data-math-source="x(t) = I + (x_{0} - I)e^{-t/\\tau }"');
    expect(moduleHtml + questionHtml).not.toContain('katex-error');
  });

  it('keeps every explicit equation in both published languages canonical and KaTeX-valid', () => {
    const root = path.resolve(import.meta.dirname, '..');
    const uniqueMath = new Set<string>();
    const unmarked: Array<{ source: string; text: string }> = [];
    const skippedKeys = new Set(['latex', 'expression', 'href', 'file', 'id']);

    function visit(value: unknown, key = '', trail: string[] = []) {
      if (typeof value === 'string') {
        if (skippedKeys.has(key) || trail.includes('codeSources')) return;
        for (const segment of parseExplicitScientificText(value)) {
          if (segment.kind === 'math') uniqueMath.add(segment.value);
          else if (segment.kind === 'text') {
            for (const inferred of parseScientificText(segment.value)) {
              if (inferred.kind === 'math') unmarked.push({ source: inferred.value, text: value });
            }
          }
        }
      } else if (Array.isArray(value)) {
        value.forEach((item) => visit(item, key, trail));
      } else if (value && typeof value === 'object') {
        Object.entries(value).forEach(([childKey, child]) => visit(child, childKey, [...trail, childKey]));
      }
    }

    for (const directory of ['content/lectures', 'content/en/lectures']) {
      for (const file of fs.readdirSync(path.join(root, directory)).filter((item) => item.endsWith('.json'))) {
        visit(JSON.parse(fs.readFileSync(path.join(root, directory, file), 'utf8')));
      }
    }

    for (const expected of [
      'dy/y=-dt/\\tau',
      '\\ln|y|=-t/\\tau +C',
      'y=Ae^{-t/\\tau }',
      'y(0)=x_{0}-I',
      'A=x_{0}-I',
      'x(t)=I+(x_{0}-I)e^{-t/\\tau }',
      '\\ln([K]_{\\mathrm{out}}/[K]_{\\mathrm{in}})',
      '(-1\\pm 4i)/0.2=-5\\pm 20i s^{-1}',
      'V_{\\pi }(s)=E_{\\pi }[G_{t}|s_{t}=s]',
      'Q=W_{\\mathrm{E}}\\sum_{j=1}^{N_{\\mathrm{E}}}K_{j}-W_{\\mathrm{I}}\\sum_{j=1}^{N_{\\mathrm{I}}}K_{j}',
    ]) expect(uniqueMath.has(expected), expected).toBe(true);
    expect(unmarked).toEqual([]);
    const invalid: Array<{ source: string; normalized: string; error: string }> = [];
    for (const source of uniqueMath) {
      const normalized = normalizeScientificLatex(source);
      if (normalized !== source) invalid.push({ source, normalized, error: 'formula is not canonical' });
      try {
        katex.renderToString(source, { output: 'htmlAndMathml', throwOnError: true, strict: 'error' });
      } catch (error) {
        invalid.push({ source, normalized, error: error instanceof Error ? error.message : String(error) });
      }
    }
    expect(invalid).toEqual([]);
  });
});
