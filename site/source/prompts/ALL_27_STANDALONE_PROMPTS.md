# NEUROSCI 366：27 个独立的 Source-Aligned PDF 生成 Prompt

## 修订后的正确目标

本项目的目标不是用一条 master prompt 开启 27 课的长期聊天教学，而是：

> **为 Lecture 1–27 各提供一条完全独立、可单独复制到 ChatGPT Pro 的 prompt。每条 prompt 只处理一课，读取该课的真实笔记/代码/答案文件，最终生成一份静态、只读、可打印、可搜索、可脱离聊天独立使用，并能逐页对照原笔记的高密度 PDF 教材。**

每课最终只有一个 PDF。互动学习不是通过 fillable PDF 或必须持续聊天完成，而是被写进静态教材的结构中：

`Stop & Predict → Micro-check → 分层 Hint Bank → Self-reflection → Cumulative Quiz → 独立 Answer Key`

“只读”在这些 prompt 中被定义为 static/non-interactive，而不是密码锁或禁止复制：PDF 不含表单、JavaScript 或动态按钮，但文字可搜索/选择，打印后可以手写作答。

## 每条 prompt 的共同硬性目标

- 逐页视觉读取手写 PDF，而不是只靠 OCR；
- 沿原笔记页序建立 source-page 对照；
- 清洁重排公式、重绘图，并补齐推导；
- 面向 neuroscience 本科毕业、但仅高中数学熟练度的读者；
- 主要中文，保留并训练英文专业术语；
- 利用可见历史进行 generation-time personalization；无历史时使用内置默认画像；
- 在同一 PDF 中加入习题、分层提示与完整答案；
- 检查笔记笔误、代码 bug、符号与维度；
- 生成后重新渲染所有页面，检查乱码、裁切、公式与图；
- 最终交付实际 PDF，而不是 outline、聊天课或另一条 prompt。

## 使用方式

1. 在一个新 ChatGPT Pro 对话中上传完整 `NEUROSCI366.zip`，或只上传该 prompt 列出的精确 source files。
2. 打开对应 `.md` 文件，复制全部内容并发送。
3. 每条 prompt 都是 standalone；不需要先发送 README、master prompt 或前一课 prompt。
4. 推荐一课一个新对话，便于文件与成品管理。
5. 若要让成品利用以前的答题表现，可在同一对话中保留相关历史；否则 prompt 会采用默认学习者画像。

## 文件说明

- `01_...md` 至 `27_...md`：27 条独立 prompt。
- `ALL_27_STANDALONE_PROMPTS.md`：同样内容的合并版，仅用于搜索与总览；真正使用时仍建议复制单课文件。
- `PROMPT_INDEX.md`：课程、源文件、prompt 文件与目标 PDF 文件名的索引。




---

# 独立任务：NEUROSCI 366 Lecture 01 — 课程导论 / Course Introduction

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 1：计算神经科学导论 / Course Introduction**
- 最终文件名：`NEUROSCI366_Lecture01_Course_Introduction_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture1-Course-Introduction.pdf` — 4 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：课堂与教师介绍；课程的跨学科定位。
- Page 2：什么是 computational neuroscience；computers、data analysis、machine learning、modeling、simulation；核心脑计算问题；engineering 与 medicine 的相关性。
- Page 3：syllabus / course logistics。把它作为 2025 课程档案简洁记录，不要把行政事项扩写成学术内容。
- Page 4：mathematics、programming、MATLAB/Python 的作用；flipped-classroom logic 与学习方法。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 严格区分 computational neuroscience、data science、machine learning、neural-network engineering 与 nervous-system modeling；解释它们的交集和非同义关系。
- 围绕四个课程级问题建立全课路线图：感觉信息提取、身体控制、记忆存取、智能系统的形成。
- 解释为什么数学用于精确定义假设、推导预测和检验可证伪性，为什么 programming 用于 simulation 与 data analysis。
- 以神经电生理、receptive-field mapping、head-direction coding 等为补充例子，但不要替代原笔记的定义。
- 将 administrative notes 与 enduring academic content 清楚分开，并标注原课程日期背景。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：本课不应凭空塞入大量公式；只建立 model、variable、prediction、simulation、data、inference 等基本语言，并用一个极小的神经元输入-输出模型示范“从语言问题到计算问题”的转换。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：把 Page 2 的领域/问题关系和 Page 4 的 math-programming-learning workflow 重构成两张干净的概念图。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：这是一份导论 PDF，不要写成 40 页的泛化计算神经科学百科；重点是忠实、清晰地建立后续 26 课的依赖地图。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：8–12 个问题，重点考查概念边界、研究问题识别、模型与数据的区别，以及把一个神经科学问题改写成可计算问题。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 02 — 向量、矩阵与概率基础 / Vectors, Matrices, and Probability

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 2：向量、矩阵与概率基础 / Vectors, Matrices, and Probability**
- 最终文件名：`NEUROSCI366_Lecture02_Vectors_Matrices_Probability_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture2-FC_NEUROSCI_366_F2025.pdf` — 4 pages；练习题主文件；正文必须先按题目顺序教学。
- `Lecture2-FC_Solutions_NEUROSCI_366_F2025.pdf` — 5 pages；核对与答案来源；答案不得紧邻题目泄露。
- `Lecture2-FC_Solutions_NEUROSCI_366_F2025.m` — MATLAB source；所有代码必须逐行审计。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Exercise Page 1：scalar/vector/matrix objects；维度规则；sum、inner product、norm、outer product、matrix-vector 与 matrix-matrix multiplication。
- Exercise Page 2：identity、transpose、vector-as-matrix、inverse、singularity、determinant、Hadamard product；Bernoulli distribution；exponential distribution 开始。
- Exercise Page 3：exponential CDF/mean/median/mode/standard deviation；bivariate normal；covariance matrix；marginal、independence、conditional distribution。
- Exercise Page 4：Bayes rule。
- Solutions Pages 1–5 与 `.m`：逐题核对、MATLAB 输出、错误信息与数学解释。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 使用题目中给定的 s、u、v、w、A、B、C，不要另造一套例子取代原练习。
- 对每个运算标注 shape，并解释“数学上未定义”与“MATLAB 允许 broadcasting/implicit expansion”不是一回事。
- 完整覆盖 dot product、norm、outer product、identity、transpose、inverse、determinant、singular matrix、Hadamard product，以及 `*`、`.*`、`'`、`inv`、`det`、`eye`。
- 完整推导 Bernoulli mean/variance；exponential PDF、CDF、mean、median、mode、standard deviation，并给出 integration by parts 的最小支架。
- 逐项解释 bivariate Gaussian 的 mean vector、covariance matrix、determinant、inverse、correlation coefficient；用图形解释 covariance 的符号。
- 完整讲 marginalization、independence、conditional probability、product rule 与 Bayes rule；严格区分 probability、likelihood、prior、posterior。
- 答案册必须放在 PDF 后部，先给 hints，再给完整解答；正文中保留可打印作答空间。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：从对象类型和 shape reasoning 开始；所有矩阵乘法逐项展开一次。概率部分既要直觉也要正式公式，并用简单数值分布检查归一化、均值和条件概率。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘向量/矩阵 shape 图、Bernoulli PMF/CDF、exponential PDF/CDF、不同相关系数的 bivariate-Gaussian 等高线和 conditional slice。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：审计 `.m` 中 `clear all`、`inv` 等写法：忠实解释课程代码，同时指出数值计算中通常更偏好线性求解而非显式求逆。将 MATLAB 的 scalar-plus-matrix 行为与抽象线性代数严格分开。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：18–25 个混合题，必须包含 shape 判断、手算、MATLAB 输出预测、找错、概率推导和 Bayes transfer problem。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 03 — 微分方程与 Euler 数值模拟 / Differential Equations and Euler Simulation

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 3：微分方程与 Euler 数值模拟 / Differential Equations and Euler Simulation**
- 最终文件名：`NEUROSCI366_Lecture03_Differential_Equations_Euler_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture3-Differential-Equations.pdf` — 4 pages；手写主讲义。
- `Lecture3_Diff_Eq_MATLAB.pdf` — 1 page；MATLAB exercise/printout。
- `Lecture3_Diff_Eq_MATLAB.m` — MATLAB source；两部分模拟的权威代码。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Notes Page 1：function、derivative、integral、first-order ODE、initial condition；最简单积分解；两个 canonical examples。
- Notes Page 2：验证解；separation of variables；指数增长；神经科学常见方程 `tau dx/dt=-x+I` 的变量替换。
- Notes Page 3：解析解、exponential decay/approach、time constant；Euler method 的差分推导。
- Notes Page 4：second-order ODE 改写为 coupled first-order equations；harmonic oscillator。
- MATLAB PDF/.m Part 1：piecewise input 驱动一阶系统；Part 2：二阶振荡器的一阶耦合实现。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 从“导数是瞬时变化率、微分方程用变化规律定义函数”搭桥，但最终给出正式 notation。
- 逐行推导 separation of variables 和 `x(t)=x0 e^{-t/tau}+(1-e^{-t/tau})I`；解释 steady state、initial gap、time constant 和 limiting cases。
- 从导数定义推导 Euler update；解释 truncation error、步长、稳定性和为什么要使用上一时刻的右端项。
- 对 `tau dx/dt=-x+I` 给出解析解与 Euler 解的对照，并展示不同 `dt/tau` 下准确、振荡、发散的行为。
- 完整解释如何把 `d²x/dt²=-x` 改成 `dx/dt=y, dy/dt=-x`，以及 phase-space 含义。
- 逐行解释 `.m`：变量单位、array shape、piecewise branches、loop indexing、plot prediction。
- 必须审计终点 `t=T=0.250` 的 branch 是否给 `I(end)` 赋值、`t0` 注释与实际用途是否一致，以及 NaN 传播等边界问题。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：为 derivative、integral、exponential、natural log、separation 和 coupled equations 提供高中数学可达的梯子；所有推导一行一步，并用代回原 ODE 验证。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 step/piecewise input、exponential response、Euler-versus-exact curves、harmonic oscillator time traces 与 phase portrait。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：不要只解释代码语法。必须把每一行 MATLAB 与对应 differential equation、离散更新和图形联系起来；源代码中的潜在 bug/注释错误必须单独列出。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：15–22 个问题，包含导数直觉、解析解、Euler 手算三步、稳定性预测、代码 debug、从二阶到一阶耦合的转换。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 04 — 神经元 I：膜电位、电路与 Integrate-and-Fire / Neurons I: Membrane Voltage, Circuits, and Integrate-and-Fire

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 4：神经元 I——膜电位、电路与 Integrate-and-Fire**
- 最终文件名：`NEUROSCI366_Lecture04_Neurons1_Membrane_Circuit_IF_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture4-Neurons1.pdf` — 6 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：cell membrane、ions、charge separation、electric force/potential energy/potential、membrane voltage、diffusion。
- Page 2：ion-selective channels、Boltzmann distribution、Nernst/equilibrium potentials、action potential。
- Page 3：Hodgkin–Huxley equivalent circuit 与各支路含义。
- Page 4：Kirchhoff current law、charge conservation、capacitor、capacitive current。
- Page 5：pure-capacitor current integration、current step、integrate-and-fire、threshold/reset、F–I curve。
- Page 6：leak resistance、battery/reversal potential、Ohm’s law、leaky-integrator equation。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 从 charge、force、potential energy 到 voltage 建立清晰链条，并说明膜内外电位差的符号约定。
- 解释 diffusion 与 electric force 如何共同决定 equilibrium potential；逐步推导 Nernst equation，并解释 ion valence、concentration ratio、temperature。
- 说明 Na+, K+, Ca2+, Cl− reversal potential 的符号和 action-potential trajectory，但不要把 equilibrium potential 误写成实际瞬时膜电位。
- 把 membrane、channels、concentration gradients 映射到 capacitor、conductance、battery；逐支路解释 HH circuit。
- 从 Kirchhoff current law 推到 `C dV/dt = I_e`，再推到 pure integrate-and-fire 的 ramp、threshold crossing、reset 和 F–I relation。
- 从 resistor+battery 推导 leak current `I_L=G_L(V_m-E_L)` 与 LIF equation；解释每一项的方向和单位。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：必要数学包括 `F=-∇U` 的一维直觉、Boltzmann ratio、自然对数、`Q=CV`、`I=dQ/dt`、Ohm’s law 与一阶 ODE。量纲检查必须贯穿全课。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘膜/离子图、Nernst 平衡图、action potential、电路图、capacitor step response、IF sawtooth 与 F–I curve。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：本课只铺到 LIF equation；不要提前吞并 Lecture 5 的完整 LIF closed-form solution 与 HH gating dynamics，但可在结尾给出明确预告。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：14–20 个问题，包含符号方向、Nernst 数值检查、电路对应、current-step 曲线预测、F–I slope 与单位。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 05 — 神经元 II：LIF 解析解与 Hodgkin–Huxley / Neurons II: LIF Solution and Hodgkin–Huxley

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 5：神经元 II——LIF 解析解与 Hodgkin–Huxley**
- 最终文件名：`NEUROSCI366_Lecture05_Neurons2_LIF_Hodgkin_Huxley_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture5-Neurons2.pdf` — 7 pages；唯一主讲义；Pages 1–2 与 Lecture 4 有意重叠。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：capacitor integrate-and-fire 回顾。
- Page 2：leak current 与 LIF equation 回顾。
- Page 3：LIF time constant、steady state、current-step response、threshold current。
- Page 4：threshold-crossing time 与 exact F–I curve；threshold-linear approximation。
- Page 5：Na/K conductances、HH equation、m/h/n gating dynamics。
- Page 6：activation/inactivation curves、refractory period、saturating F–I。
- Page 7：area normalization、cable/multicompartment models、subthreshold attenuation、AP propagation、cellular diversity。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 将 Pages 1–2 标为 retrieval bridge：简洁但完整核对，不得假装它们是新内容，也不得完全跳过。
- 逐步将 LIF equation 化为 `tau dV/dt=-V+V_inf`，推导 exact step response、threshold current、interspike interval 与 firing-rate formula。
- 解释 threshold-linear approximation 为什么有 bias、在哪个电流区间近似合理，以及 refractory period 如何改变高电流极限。
- 逐项解释 HH membrane equation、maximal conductances、reversal potentials、`m^3h`、`n^4` 和 voltage-dependent alpha/beta kinetics。
- 解释 activation、inactivation、recovery 和 refractory period 的因果链，不要把 gating variable 当作 channel count。
- 说明按 membrane area 归一化的意义；给出 cable equation/multicompartment 的概念桥，区分 passive attenuation 与 regenerative propagation。
- 强调 HH 是框架而非所有神经元的单一固定模型，并讨论 cellular diversity。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：完整推导 LIF closed form 和 F–I equation；为 exponential threshold crossing、log ratio 和 gating ODE 提供逐步支架。对每个电流与 conductance 项做单位检查。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 LIF exponential approach、threshold crossings、exact/approximate F–I、Na/K conductance time courses、m∞/h∞/n∞ curves、refractory saturation。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：明确区分 membrane time constant、interspike interval 和 refractory period；明确区分 channel activation probability、conductance 与 ionic current。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：18–24 个问题，包含 LIF 推导、数值 threshold crossing、F–I 极限、gating 曲线解释、HH 项的符号与生理意义。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 06 — 神经编码 I：Poisson 脉冲与最大似然 / Neural Coding I: Poisson Spikes and Maximum Likelihood

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 6：神经编码 I——Poisson 脉冲与最大似然**
- 最终文件名：`NEUROSCI366_Lecture06_Neural_Coding1_Poisson_ML_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture6-Neurons3-NeuralCoding1.pdf` — 7 pages；唯一主讲义；Pages 1–2 延续 Lecture 5。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：activation/inactivation 与 refractory/F–I 回顾。
- Page 2：area normalization、cable、cell diversity 回顾。
- Page 3：neural coding 问题；random-dot kinematogram；in-vivo electrophysiology；voltage/spike train/raster/PSTH。
- Page 4：trial-to-trial variability；Fano factor；Poisson counts；ISI、exponential distribution、CV。
- Page 5：Poisson point process。
- Page 6：encoding model、tuning curve、`P(n|s)`、independent population likelihood。
- Page 7：maximum-likelihood decoding、log likelihood、curvature、asymptotic normality、Fisher information。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- Pages 1–2 作为必要 retrieval bridge，随后清楚转入 coding problem。
- 按实验流程解释 random-dot stimulus、motion coherence、recording、spike detection、repeated trials、raster 与 PSTH。
- 严格区分 instantaneous voltage、spike times、binned count、trial-averaged firing rate。
- 推导 Poisson PMF 的 mean/variance、Fano factor≈1、exponential ISI、CV≈1；解释这些是模型预测而非所有神经元的普遍事实。
- 解释 homogeneous Poisson point process 的独立增量、连续 spike time 与 small-bin approximation。
- 建立 MT direction tuning 的 Poisson encoding model；从独立神经元写出 joint likelihood。
- 逐步从 likelihood 到 log-likelihood、MLE、second derivative 和 Fisher information；解释 curvature 与 estimator variance 的关系。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：需要概率分布、log product-to-sum、derivative/curvature 和 asymptotic normal approximation 的支架。每个随机变量与 conditioning bar 都要解释。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 random-dot task、extracellular trace→spikes→raster→PSTH、Fano plot、ISI histogram、tuning curve、likelihood curvature。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：不得把 firing rate 当作直接观察到的连续信号；强调它通常是统计模型或估计量。使用用户熟悉的 Neuropixels/HD-cell 数据作为 transfer example，但保留 MT 原例。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：16–22 个问题，包含 raster/PSTH interpretation、Poisson hand calculations、Fano/CV diagnosis、joint likelihood 和 MLE curvature。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 07 — 神经编码 II：群体解码、Fisher 信息与 Bayesian 解码 / Neural Coding II: Population Decoding, Fisher Information, and Bayes

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 7：神经编码 II——Population Decoding, Fisher Information, and Bayes**
- 最终文件名：`NEUROSCI366_Lecture07_Neural_Coding2_Population_Fisher_Bayes_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture7-NeuralCoding2.pdf` — 6 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：single-neuron ambiguity、population likelihood、uniform preferred directions、log-likelihood derivatives。
- Page 2：Fisher information 的 population derivation、sum-to-integral、N/T scaling。
- Page 3：Cramér–Rao bound、perceptual error、noise correlations。
- Page 4：left/right pooling statistics；correlated Gaussian encoding model、covariance matrix/inverse。
- Page 5：information-limiting correlations、biological saturation、suboptimal decoder。
- Page 6：biased decoding、bias–variance decomposition、modified CRLB、Bayesian decoder。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 解释 population code 如何打破单神经元 tuning ambiguity；逐步构建 independent Poisson joint likelihood。
- 完整推导 first/second derivative、在 true stimulus 处取 expectation、Fisher information，并说明 uniform preferred-direction sum 如何近似积分。
- 解释 `J∝NT` 的条件与意义，以及 decoder variance 的 `1/J` scaling。
- 准确陈述 Cramér–Rao lower bound 的 unbiased/regularity assumptions；不要把 bound 说成任何有限样本 decoder 都必然达到。
- 解释 Pearson noise correlation、positive/negative/zero correlation 和 shared variability；区分 signal correlation。
- 逐步推导 left/right pooled-count mean/variance，并引入 multivariate Gaussian、covariance inverse 与 Mahalanobis geometry。
- 解释 information-limiting correlations 与 decoder mismatch/suboptimality；避免把所有 saturation 都归因于单一机制。
- 推导 bias–variance decomposition，解释 modified CRLB；将 Bayesian prior 视为 regularization，并区分 likelihood 与 posterior。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：核心是求导、期望、sum-to-integral、matrix covariance/inverse、quadratic form 和 bias–variance。所有 N、T、tuning width、noise covariance 的 scaling 都要检查。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 population tuning curves、Fisher scaling、psychometric curve、correlation scatter、Gaussian ellipses、information saturation、bias/variance target plots。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：明确区分 three levels：neural encoding distribution、decoder algorithm、behavioral performance；相关性存在不等于某个 decoder 一定使用或不使用它。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：18–25 个问题，包含 Fisher derivation steps、CRLB assumptions、covariance geometry、correlation counterexamples、Bayesian posterior transfer。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 08 — 神经网络 I：脉冲表示、卷积与 E/I 平衡 / Neural Networks I: Spikes, Convolution, and E/I Balance

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 8：神经网络 I——Spikes, Convolution, and E/I Balance**
- 最终文件名：`NEUROSCI366_Lecture08_Neural_Networks1_Spikes_Balance_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture8-NeuralNetworks1.pdf` — 6 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：recurrent/input weights、population architecture、coupled spiking-network equations。
- Page 2：spike-train delta representation、Dirac delta、kernel sum、convolution。
- Page 3：compact convolution form 的 coupled equations。
- Page 4：stochastic E/I Poisson inputs；total charge/current mean。
- Page 5：variance of independent inputs；large-N `1/N` scaling 的 failure；E/I balance。
- Page 6：`1/sqrt(N)` balanced scaling、irregular spiking、dynamically balanced recurrent networks。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 逐项定义 recurrent weight `W_ij` 与 input weight `U_ij` 的方向 convention、matrix shape 和 biological meaning。
- 解释 spike train 作为 Dirac-delta sum；强调 delta 不是普通函数；逐步证明 kernel sum 等于 convolution。
- 将原始 spike-time sum 改写为 compact network equations，并解释每一项如何从 presynaptic spikes 产生 current。
- 对 E/I Poisson input 逐步计算 finite-bin total charge 的 mean 与 variance。
- 严格推导 `W∝1/N` 时 mean finite 但 variance→0，为何网络趋于规则/静默而失去 Poisson-like fluctuations。
- 推导 excitation-inhibition cancellation 和 `W∝1/sqrt(N)` scaling，说明大 excitatory/inhibitory currents 如何相减留下 O(1) mean 与 O(1) variance。
- 解释 balanced state 与 dynamically generated balance；不要把“平均 E=I”误写成每个时刻完全相等。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：为 Dirac delta、integral identity、convolution、Poisson sum、variance addition 与 order-of-magnitude scaling 提供完整支架。所有 N-dependence 一步步保留。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 network architecture、delta spikes与kernel、E/I input diagram、regular/no-spiking/irregular traces、dynamic balance loop。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：这是全课程最容易因 scaling 跳步而失真的一课。禁止只报结论；必须把 mean 与 variance 分别计算，并明确独立性假设。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：16–23 个问题，包含 delta integral、convolution rewrite、shape reasoning、mean/variance scaling、E/I balance prediction。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 09 — 神经网络 II：突触动力学与 firing-rate 模型 / Neural Networks II: Synaptic Dynamics and Rate Models

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 9：神经网络 II——Synaptic Dynamics and Firing-Rate Models**
- 最终文件名：`NEUROSCI366_Lecture09_Neural_Networks2_Rate_Models_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture9-NeuralNetworks2.pdf` — 5 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：time-dependent linear ODE 的 integrating-factor solution；exponential kernel 与 convolution。
- Page 2：exponential synapse；synaptic-current ODE；spiking network 的 2N coupled equations。
- Page 3：从 Poisson spike variability averaging 到 firing-rate model；F–I function choices。
- Page 4：加入 firing-rate response time；三种 rate-model approximations。
- Page 5：feedforward layered networks 与 deep neural-network foundation。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 完整推导 `tau dx/dt=-x+I(t)` 的 integrating-factor solution 和 causal exponential kernel；解释过去输入的加权记忆。
- 证明 exponential convolution 可等价写成 first-order synaptic-current ODE，并区分 membrane time constant、synaptic time constant、rate-response time constant。
- 把 spiking network 写成 voltage-current 两套 coupled ODE，并说明 integrate-and-fire reset 如何额外耦合。
- 解释 temporal averaging 如何从 spike counts 得到 rate equations；明确 approximation 所需的 time-scale assumptions。
- 比较 threshold-linear、sigmoid、linear、tanh F–I functions 的范围、饱和、负值和生物解释。
- 逐项比较笔记中的三种 rate-model forms：最一般、fast rate/slow synapse、fast synapse 等近似。
- 从 `W=0` steady state 引出 feedforward layer composition，并连接 deep networks，但不要提前进入 Lecture 11 的训练算法。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：核心是 integrating factor、causal kernel、convolution↔ODE、time-scale separation 和 vector notation。每次近似都要写明被忽略的导数或快变量。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 exponential kernel、synaptic response、四类 F–I curves、三种 time-scale model diagram、feedforward layers。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：必须区分“spike-rate statistical description”和“dynamical firing-rate variable”；两者相关但并非自动相同。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：14–20 个问题，包含 convolution interpretation、ODE equivalence、time constants、approximation selection、F–I comparison、layer shape。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 10 — 突触可塑性 / Synaptic Plasticity

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 10：突触可塑性 / Synaptic Plasticity**
- 最终文件名：`NEUROSCI366_Lecture10_Synaptic_Plasticity_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture10-SynapticPlasticity.pdf` — 6 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：Hebb、LTP/LTD、STDP、AMPA/NMDA/Ca2+ mechanism。
- Page 2：firing-rate Hebbian rules、covariance rules、feedforward example。
- Page 3：expected weight dynamics；positive feedback；eigenvector primer。
- Page 4：symmetric/PSD covariance matrix；eigenmode Hebbian growth。
- Page 5：synaptic scaling、Oja rule、BCM rule。
- Page 6：unsupervised、supervised、reward learning、three-factor rules。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 从 Hebb’s postulate 到 LTP/LTD/STDP，解释 timing curve 和 AMPA insertion/deletion、NMDA Mg2+ block、postsynaptic Ca2+ 的机制链。
- 比较 basic Hebb rule 与三种 covariance-centered rules；解释减均值为何允许 depression。
- 对 feedforward linear neuron 写出 vector/matrix weight dynamics，并由输入统计得到 covariance matrix。
- 为 eigenvector/eigenvalue、left/right eigenvector、symmetric matrix 建立支架；证明 covariance matrix symmetric positive semidefinite。
- 解释 basic Hebbian dynamics 的 positive feedback 与 exponential growth，以及 principal eigenvector/PCA connection。
- 比较 synaptic scaling、Oja normalization 和 BCM sliding threshold 的稳定化方式与生物含义。
- 清楚区分 unsupervised、supervised、reward-based learning；解释 error/reward 的 third factor。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：核心是 covariance algebra、matrix eigenmodes、PSD proof、exponential weight dynamics、Oja/BCM differential equations。所有 vector orientation 和 transpose 要明确。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 LTP/STDP curves、NMDA mechanism、feedforward neuron、eigenvector geometry、weight blow-up、Oja normalization、BCM threshold。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：明确 Hebbian learning 与 PCA 的联系是特定线性、统计和稳定化条件下的结果，不要把“Hebbian = PCA”写成普遍同义。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：18–24 个问题，包含 STDP prediction、covariance calculation、PSD proof scaffold、eigenmode growth、Oja/BCM comparison、three-factor transfer。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 11 — 机器学习：回归、梯度下降与反向传播 / Machine Learning: Regression, Gradient Descent, and Backpropagation

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 11：机器学习——Regression, Gradient Descent, and Backpropagation**
- 最终文件名：`NEUROSCI366_Lecture11_Machine_Learning_Regression_Backprop_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture11-MachineLearning.pdf` — 6 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：supervised learning、classification/regression、architecture/loss/learning rule、deep network notation。
- Page 2：linear regression、squared loss、Taylor expansion、gradient descent、learning rule。
- Page 3：Hebbian/stabilization decomposition；closed-form regression solution。
- Page 4：deep linear regression 与 backprop setup。
- Page 5：repeated chain-rule derivation、backpropagated error。
- Page 6：nonlinear activation derivative 与 backprop summary。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 用 digit classification 与 optic-flow regression 解释 supervised dataset `(x,y)`；区分 architecture、loss、optimization/learning rule。
- 逐步写出 multilayer notation 与每层 vector/matrix shape。
- 从 squared-error loss 和 first-order Taylor expansion 推导 gradient descent；解释 gradient、learning rate、loss contours。
- 完整推导 linear-regression gradient，并解释它分解为 data-dependent Hebbian-like term 与 weight-dependent stabilization term。
- 推导 normal-equation/closed-form least-squares solution，说明 invertibility、pseudoinverse/regularization 作为必要背景但不要偏离笔记。
- 解释 deep linear network 的整体映射仍线性但 parameterization/learning dynamics 非线性。
- 逐索引推导 backprop chain rule；明确 local derivative、weight transpose、error signal、activation derivative 的作用。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：提供 gradient、Taylor expansion、matrix calculus、chain rule 的逐步支架。每个 tensor/index 的范围与 shape 必须清楚，避免只用箭头口述 backprop。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 architecture/loss/learning triangle、loss contours、gradient vector、deep network forward/backward graph。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：不要把 backprop 描述成“误差直接传回神经元”的生物机制；清楚标为训练算法，并讨论与 three-factor plasticity 的形式联系和机制差异。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：18–25 个问题，包含手算 gradient step、shape checks、closed-form derivation、chain-rule completion、backprop debug、biology-versus-algorithm critique。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 12 — 视觉导论：层级、感受野与 LNP 模型 / Introduction to Vision: Hierarchy, Receptive Fields, and LNP Models

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 12：视觉导论——Hierarchy, Receptive Fields, and LNP Models**
- 最终文件名：`NEUROSCI366_Lecture12_Introduction_to_Vision_LNP_RF_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture12-IntroToVision.pdf` — 6 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：visual hierarchy、retina→V1→dorsal/ventral streams、feature selectivity、RF size/complexity。
- Page 2：LNP model、contrast、ON/OFF RGC、spatial convolution、Difference of Gaussians。
- Page 3：threshold-linear rectification、ON/OFF feature maps、CNN connection。
- Page 4：V1 simple cell、orientation tuning、Gabor kernel、rotation、saturating nonlinearity、wavelet/JPEG。
- Page 5：spatiotemporal RF、separable/nonseparable temporal kernels、motion in spacetime、direction selectivity。
- Page 6：rightward-motion receptive-field example。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 建立 photoreceptors/RGC/V1/MT/IT/LIP 的层级与 dorsal/ventral stream；区分 anatomical hierarchy 与 computational abstraction。
- 定义 feature selectivity 与 receptive field，并解释层级上 RF size、feature complexity、history dependence 和 invariance 的变化。
- 逐项解释 LNP：linear filter、nonlinearity、Poisson output；定义 contrast 而非 raw luminance。
- 推导 spatial convolution notation，重构 ON/OFF center-surround Difference-of-Gaussians，并解释参数/符号。
- 解释 threshold-linear rectification 如何生成 feature maps，以及与 CNN convolution 的形式联系。
- 逐项解释 Gabor kernel、rotated coordinates、orientation/phase、rectification/saturation 与 wavelet representation。
- 扩展到 spatiotemporal convolution；比较 separable 与 nonseparable RF，解释 motion 作为 spacetime orientation。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：为 2D/3D integrals、convolution、Gaussian、coordinate rotation、cosine carrier、separability 提供图形化支架；每个 kernel 参数和单位要定义。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 visual hierarchy、ON/OFF RF、DoG cross-section、feature maps、Gabor/simple-cell tuning、temporal kernels、space-time motion diagrams。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：不要把 receptive field 只说成屏幕上的“位置”；它是刺激到响应关系。说明 linear RF、classical RF 与实验定义的差异。可用 sparse-noise RF mapping 作为个性化 transfer。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：16–22 个问题，包含 hierarchy mapping、kernel sign prediction、convolution intuition、Gabor rotation、separability、motion direction prediction。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 13 — 脉冲触发平均与白噪声系统辨识 / Spike-Triggered Average and White-Noise System Identification

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 13：Spike-Triggered Average 与 White-Noise System Identification**
- 最终文件名：`NEUROSCI366_Lecture13_Spike_Triggered_Average_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture13-SpikeTriggeredAverage-UPDATE.pdf` — 6 pages；唯一主版本；文件本身为 UPDATE。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：white-noise LNP system identification；STA experimental procedure。
- Page 2：continuous、pixelized 与 matrix notation。
- Page 3：linear neuron、least-squares system identification、loss contours/Hessian。
- Page 4：white-noise covariance、isotropic Hessian。
- Page 5：kernel estimator 到 spike-triggered average 的完整推导。
- Page 6：恢复 nonlinearity、标准 workflow、heuristic success/failure。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 从“已知 stimulus 和 spikes，如何反推 linear filter 与 nonlinearity”定义 system-identification problem。
- 逐步解释 white-noise stimulus、spike-triggered ensemble、average preceding spike 和 STA 的实验意义。
- 统一 continuous convolution、pixel index notation 和 matrix form；给出 `S`、`K`、`h` 的 shape。
- 从 linear neuron 的 mean-squared loss 推导 normal equations 与 Hessian；解释 circular/elliptical loss geometry。
- 从 white Gaussian stimulus covariance 推导 `SS^T≈Tσ_s²I`，再逐步推导 kernel estimate 与 STA 的 proportionality，包括 bin width 与 spike count scaling。
- 解释 small-Δt Poisson/Bernoulli approximation，如何从 empirical spike probability 恢复 nonlinearity。
- 给出完整 LNP fitting workflow，并深入解释 STA 可能 catastrophically fail 的条件：multiple relevant dimensions、symmetric nonlinearities、correlated/non-Gaussian stimuli、insufficient data 等。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：核心是 least squares、Hessian、covariance、white-noise isotropy、small-bin approximation 和 conditional averaging。每个近似符号都要说明大样本/小 bin 条件。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 checkerboard white noise、spike-triggered frames、STA、loss contours、matrix geometry、nonlinearity estimation curve。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：区分 STA 作为 descriptive average、linear-filter estimator 和 LNP model component；三者在特定假设下联系，但不是无条件等价。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：18–25 个问题，包含 notation conversion、least-squares derivation、white covariance、STA scaling、failure-case diagnosis、RF-mapping transfer。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 14 — Spike-Triggered Covariance 与广义线性模型 / Spike-Triggered Covariance and Generalized Linear Models

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 14：Spike-Triggered Covariance 与 Generalized Linear Models**
- 最终文件名：`NEUROSCI366_Lecture14_STC_and_GLM_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture14-STC-GLM.pdf` — 6 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：H1 blowfly motion example、multiple linear features、STC、stimulus-correlation correction。
- Page 2：GLM 三要素与 exponential-family canonical form。
- Page 3：unit-normal Gaussian GLM / ordinary linear regression；Poisson GLM 开始。
- Page 4：Poisson log link 与 log likelihood。
- Page 5：Pillow–Simoncelli retinal population GLM、stimulus/history/coupling filters。
- Page 6：Bernoulli GLM、logistic regression、log odds、cross-entropy。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 说明 stimulus 不必是光强图像；用 H1 velocity model 引出 wide-field feature 与 multiple relevant filters。
- 从 spike-triggered covariance matrix 的定义解释 eigenvectors 如何找到额外 feature；说明 correlated stimuli 下为何需要 whitening/correction。
- 系统讲 GLM 的 response distribution、linear predictor、link function，并在不压垮读者的前提下解释 exponential family/canonical parameter。
- 分别推导 Gaussian/identity-link、Poisson/log-link、Bernoulli/logit-link 的 likelihood 与 log likelihood。
- 解释 maximizing Gaussian log likelihood 等价于 minimizing MSE；Poisson regression 的 `exp` 保证非负 rate；logistic sigmoid 产生 probability。
- 逐项重构 Pillow retinal GLM：stimulus filters、self-history refractory/burst filters、cross-neuron coupling filters，以及 simultaneous fitting。
- 严格区分 Poisson count model、Bernoulli small-bin model 和 logistic classification。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：需要 covariance eigendecomposition、exponential-family notation、log likelihood、log link、log odds、sigmoid 与 cross-entropy 的逐步支架。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 H1 feature space、STC eigenfeatures、GLM block diagram、Gaussian/Poisson/Bernoulli links、retinal coupled-filter network。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：不要把 GLM 的“linear”理解成 response mean 必须线性；linear 指 predictor，对 mean 的关系由 link 决定。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：20–27 个问题，包含 distribution/link matching、log-likelihood derivation、STC interpretation、history-filter prediction、GLM model selection。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 15 — 高效编码与信息论 / Efficient Coding and Information Theory

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 15：高效编码与信息论 / Efficient Coding and Information Theory**
- 最终文件名：`NEUROSCI366_Lecture15_Efficient_Coding_Information_Theory_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture15-EfficientCoding.pdf` — 6 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：Barlow efficient-coding hypothesis、three hypotheses、redundancy reduction。
- Page 2：surprise、logarithm properties、entropy、conditional entropy、mutual information motivation。
- Page 3：mutual-information identities、independence、continuous extension 与 differential entropy caveat。
- Page 4：Atick–Redlich retinal model、Gaussian signal/noise、covariance propagation。
- Page 5：Gaussian mutual information determinant、information constraint、redundancy objective、channel capacity。
- Page 6：decorrelation、orthogonal nonuniqueness、rotational symmetry 与 center-surround solution。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 准确呈现 Barlow 的三种假设并说明 efficient coding 是 normative hypothesis，不是每个视网膜特征的唯一解释。
- 从 surprise 的三条要求推导 `-log p`；解释 log base、bits/nats。
- 推导 entropy、conditional entropy、mutual information 的等价形式，并证明 independence 时 MI=0；解释 converse 的条件。
- 对 continuous variables 引入 density 与 differential entropy，明确其可为负且不是离散 surprise 的简单复制；MI 仍具有稳定意义。
- 重构 Atick–Redlich noisy retina：signal/noise covariances、linear transform A、output covariance。
- 逐步解释 Gaussian mutual-information determinant expression、fixed-information constraint、output channel capacity 和 redundancy objective。
- 解释 decorrelated output、orthogonal rotation nonuniqueness，以及为什么 rotationally symmetric constraint 选出 center-surround RF。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：为 logarithm、expectation、joint/conditional distributions、determinant、Gaussian covariance transformation 与 matrix mutual information 提供层级支架。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 surprise curve、entropy distributions、Venn-like information relations（注明仅作直觉）、retinal noisy channel、covariance/decorrelation、center-surround filter。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：区分 entropy、differential entropy、mutual information、redundancy 与 channel capacity；不要用“更多 entropy 就更好”这类无条件结论。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：18–25 个问题，包含 surprise derivation、entropy/MI calculations、independence tests、covariance propagation、normative-model critique。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 16 — 适应、自然场景统计与 Fourier 分析 / Adaptation, Natural Scene Statistics, and Fourier Analysis

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 16：适应、自然场景统计与 Fourier 分析**
- 最终文件名：`NEUROSCI366_Lecture16_Adaptation_Natural_Scene_Fourier_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture16-Adaptation.pdf` — 5 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：SNR、high/intermediate/low SNR 下 center-surround 与 averaging。
- Page 2：natural-scene structure、translation-invariant correlation function、Fourier transform。
- Page 3：complex exponential、Euler identity、convolution theorem、frequency-domain RF。
- Page 4：power spectrum、natural-image `1/|xi|²`、perfect decorrelation filter、photoreceptor low-pass 与 SNR adaptation。
- Page 5：LNP model 中的 adaptation measurement。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 从 Atick–Redlich 延续解释 SNR 如何在 redundancy reduction 与 denoising 之间改变 optimal filter。
- 分别解释 high-SNR strong surround/decorrelation、low-SNR spatial averaging、intermediate interpolation，并用图形预测。
- 定义 translation invariance 与 correlation function；解释为何自然图像可用 displacement statistics 描述。
- 从 sine/cosine 和 Euler identity 引入 complex exponential；逐项解释 Fourier transform 的 spatial-frequency vector。
- 逐步推导 convolution theorem，并将 spatial RF filtering 转为 frequency-domain multiplication。
- 解释 power spectrum 与 natural-image approximate `1/|xi|²` scaling；推导 perfect-whitening filter 的频率趋势。
- 说明 photoreceptor/optical low-pass 与 output noise 如何改变 efficient filter，并连接 light-level adaptation。
- 解释如何用 white-noise fitting 比较不同 light/stimulus statistics 下的 LNP parameters。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：为 complex number、Euler formula、dot product in phase、Fourier pair、convolution theorem、power spectrum 提供高中数学入口，但保留正式积分。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 SNR-dependent center-surround profiles、translation invariance、sinusoidal basis、frequency response、natural power law、predicted adaptation curves。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：不要把 Fourier transform 教成纯公式表。必须始终回答 spatial frequency 对图像和 receptive field 的物理含义，以及 amplitude/phase 分别表示什么。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：18–24 个问题，包含 SNR filter prediction、Fourier basis intuition、convolution theorem steps、power-spectrum slope、adaptation experiment design。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 17 — 视觉网络：级联、复杂细胞与循环动力学 / Visual Networks: Cascades, Complex Cells, and Recurrence

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 17：视觉网络——Cascades, Complex Cells, and Recurrence**
- 最终文件名：`NEUROSCI366_Lecture17_Visual_Networks_Energy_Recurrence_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture17-VisualNetworks.pdf` — 5 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：LNP cascades、Hubel–Wiesel simple-cell construction、complex-cell zero STA。
- Page 2：STC features、energy model、quadrature pair、phase invariance。
- Page 3：performance-optimized object-classification models 与 neural predictivity。
- Page 4：recurrence、surround suppression、E/I rate-network model。
- Page 5：steady-state nullclines、surround-induced shifts、inhibition-stabilized network。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 解释 LNP cascades 如何产生 hierarchy、selectivity 与 invariance；区分 descriptive cascade 与 biological mechanism。
- 重构 Hubel–Wiesel simple-cell pooling 与 complex-cell phase invariance；说明 complex cell 为什么 linear STA 可为零。
- 逐步解释 energy model、quadrature filters、square-and-sum 与 phase invariance；连接 STC multiple features。
- 解释 performance-optimized deep network 的两阶段：先优化任务，再拟合/比较 biological responses；区分 task accuracy 与 neural predictivity。
- 分析 surround suppression 不必等于更多 inhibition：可由 excitation decrease more than inhibition 产生。
- 写出 E/I rate equations、fixed-point conditions 与 nullclines；解释 surround input 如何移位 nullcline并降低 E/I rates。
- 给出 inhibition-stabilized network 的定义、直觉和为何名称容易被误解。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：核心是 quadrature trigonometric identity、nonlinear feature combination、coupled rate ODE、fixed points 与 nullcline geometry。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 simple/complex RF、energy model、phase-response curves、task-vs-neural predictivity、surround tuning、E/I circuit/nullclines。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：明确“复杂细胞 STA=0”不等于“没有 stimulus selectivity”；这是理解 nonlinear system identification 的关键反例。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：16–22 个问题，包含 phase-invariance proof、STA failure diagnosis、model comparison、surround mechanism、nullcline shift prediction。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 18 — 运动系统与线性神经动力学 / Motor Systems and Linear Neural Dynamics

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 18：运动系统与线性神经动力学 / Motor Systems and Linear Neural Dynamics**
- 最终文件名：`NEUROSCI366_Lecture18_Motor_Systems_Linear_Dynamics_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture18-IntroToMotorSystemsAndDynamics.pdf` — 5 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：brain-body-environment coupling、feedforward/feedback control、motor rhythms、motor regions、distributed activity。
- Page 2：linear recurrent network equations。
- Page 3：eigenvectors/eigenvalues、matrix diagonalization、change of basis、decoupled modes。
- Page 4：mode solution、effective time constants、stable/unstable feedback。
- Page 5：fixed points、perfect integrator、leaky integrator、memory timescale。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 解释 brain、body、environment 是 coupled dynamical system；比较 feedforward 与 feedback/proprioceptive control。
- 梳理 spinal cord、brainstem、cerebellum、basal ganglia、motor cortex 的课程级功能定位，不扩写成解剖百科。
- 从 familiar one-neuron linear ODE 推广到 recurrent population `tau dh/dt=-h+Wh+I`。
- 从矩阵形式完整推导 eigenbasis transformation、diagonalization 与 decoupled mode equations；标注所有 shape。
- 推导 mode-specific effective time constant `tau/(1-lambda_i)`，解释 lambda<1、=1、>1 的 stability/decay/growth。
- 用 derivative field/fixed-point 图解释 stable vs unstable；区分 positive feedback、perfect integration 和 runaway instability。
- 解释 lambda 接近 1 如何产生 long memory，以及有限误差如何造成 leaky integrator。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：为 matrix diagonalization、basis change、eigenmodes、linear ODE solution、fixed-point stability 提供直觉和正式推导；说明 diagonalizable assumption。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 brain-body loop、motor hierarchy、recurrent network、neuron-space↔mode-space、stable/unstable vector fields、integrator responses。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：始终区分 individual neuron activity、population mode coordinate 和 behavioral state；不要把 eigenmode 当成单个“特殊神经元”。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：17–23 个问题，包含 matrix shape、eigenmode interpretation、effective tau calculation、stability prediction、motor-control transfer。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 19 — 群体活动与主成分分析 / Population Activity and Principal Component Analysis

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 19：群体活动与主成分分析 / Population Activity and PCA**
- 最终文件名：`NEUROSCI366_Lecture19_Population_Activity_PCA_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture19-PopulationActivity-PCA-UPDATE.pdf` — 6 pages；主版本。
- `Lecture19-PopulationActivity-PCA.pdf` — 5 pages；旧版；必须逐页比较独有内容。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- UPDATE Page 1：symmetric two-neuron network、eigenvalues/eigenvectors、common/difference modes。
- UPDATE Page 2：coupling regimes、mode time constants、population trajectories。
- UPDATE Page 3：activity-space/mode-space basis、approximately one-dimensional dynamics。
- UPDATE Page 4：PCA motivation、projected variance、covariance eigenvectors。
- UPDATE Page 5：top-K PCA、orthogonality、algorithm、denoised reconstruction。
- UPDATE Page 6：eigenvalue cliff、cumulative variance explained、dimension cutoff。
- Original Pages 1–5：与 UPDATE 比较；任何旧版独有文字/符号必须保留并标记。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 完整求解 two-neuron weight matrix 的 eigenvalues/eigenvectors，规范化 common/difference modes，并变换输入。
- 按 `w0` 的符号/大小分析 stable、unstable、perfect/leaky integrator regimes。
- 解释 neural activity space 与 mode-coordinate space 的同一轨迹表示；说明 approximate one-dimensionality 如何来自 difference mode decay。
- 从 centered activity covariance 和 projection variance 推导 PC1 是最大 eigenvalue eigenvector；再推广到 orthogonal top-K PCs。
- 解释 projection、discarded dimensions 和 denoised reconstruction，给出 shape 与数值小例子。
- 讲解 scree/eigenvalue cliff、cumulative variance explained 和 cutoff arbitrariness/limitations。
- 必须明确区分 eigenvectors of recurrent weight matrix W（dynamical modes）与 eigenvectors of covariance C（principal components）；它们不一般相同。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：two-by-two eigensystem、orthonormal basis、covariance、Rayleigh quotient/variance maximization、projection/reconstruction。每个 coordinate transformation 都要可手算。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 common/difference axes、activity trajectories、data cloud/PC axes、scree plot、cumulative variance curve、reconstruction diagram。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：以 UPDATE 为主并明确记录它新增 Page 6。不要把 PCA 说成自动发现 causal dynamics；它只按 variance 排序，可能混合 signal、noise、condition structure。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：18–25 个问题，包含 two-neuron eigensystem、basis transform、trajectory interpretation、PCA projection、dimension-selection critique。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 20 — 中央模式发生器与振荡 / Central Pattern Generators and Oscillations

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 20：中央模式发生器与振荡 / Central Pattern Generators and Oscillations**
- 最终文件名：`NEUROSCI366_Lecture20_Central_Pattern_Generators_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture20-CentralPatternGenerators.pdf` — 6 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：intrinsic pacemaker/follower、network-generated half-center oscillator、respiration/locomotion。
- Page 2：linear two-neuron oscillator、complex eigenvalues、Euler formula、damped oscillations。
- Page 3：Morris–Lecar equations、V/N nullclines、fixed points。
- Page 4：relaxation oscillation cycle、inhibitory coupled Morris–Lecar half-center。
- Page 5：sharp synaptic threshold、intrinsic release 与 intrinsic escape。
- Page 6：half-center firing-rate model extension。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 比较 cell-intrinsic pacemaker 与 network-generated rhythm；解释 synapse block 的诊断逻辑。
- 完整求 two-neuron inhibitory/excitatory weight matrix 的 complex eigenvalues，并用 Euler formula 解释 damped oscillatory components。
- 明确线性系统中的 complex eigenvalues 不自动产生 sustained limit cycle；衰减/增长由 real part 决定。
- 逐项解释 Morris–Lecar voltage/recovery equations、sigmoidal steady-state functions、fast-slow separation。
- 从 nullclines 和 fixed-point stability 解释 relaxation oscillation的四阶段 trajectory。
- 分析 mutually inhibitory half-center with synaptic threshold；逐步区分 intrinsic release 和 intrinsic escape。
- 说明如何在 firing-rate model 中用 adaptation/recovery variable 复现同类 geometry。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：complex numbers、Euler identity、complex eigenvalues、phase plane、nullclines、fast-slow systems、nonlinear limit cycles。用几何直觉后再给正式方程。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 pacemaker/half-center diagnostics、complex-plane oscillation、Morris–Lecar nullclines、relaxation loop、release/escape cycles。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：不要把所有 rhythmic activity 都归为 CPG，也不要把 damped linear oscillation与 autonomous nonlinear oscillator混为一谈。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：17–24 个问题，包含 complex eigenvalue interpretation、nullcline reading、cycle ordering、release-vs-escape diagnosis、model transfer。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 21 — 眼动积分器、参数退化与 sloppy models / Oculomotor Integrator, Degeneracy, and Sloppy Models

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 21：眼动积分器、参数退化与 Sloppy Models**
- 最终文件名：`NEUROSCI366_Lecture21_Oculomotor_Integrator_Sloppiness_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture21-OculomotorIntegrator.pdf` — 5 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：eye velocity→position integration、brainstem/cerebellar architecture、linear position tuning。
- Page 2：two-neuron weight matrix、eigenvalues、perfect-integrator requirement、family of solutions。
- Page 3：biological parameter variability、Marder/Goldman logic、nonlinear synaptic functions、fitting setup。
- Page 4：nonlinear fitting rewritten as linear regression、loss/Hessian。
- Page 5：Hessian eigenbasis、stiff/sloppy parameter dimensions、ensemble interpretation。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 解释为何 saccade velocity command 必须被积分为 persistent eye position；连接 long-timescale mode。
- 重构 bilateral excitatory/inhibitory architecture 与 left/right linear tuning curves。
- 完整推导 general 2×2 weight matrix eigenvalues，并说明 perfect integrator 需要 dominant eigenvalue=1；推导 notes 中的 one-parameter family relation。
- 解释 many-to-one mapping：许多 synaptic weight combinations 可产生相同 integration dynamics；区分 parameter degeneracy 与 measurement noise。
- 从 measured F–I inverse 与 nonlinear synaptic functions 重写 fitting problem；标注 all indices/shapes。
- 逐步完成 quadratic loss、least-squares solution、Hessian decomposition；解释 Hessian eigenvalues 代表 parameter sensitivity。
- 解释 stiff vs sloppy directions、elongated error contours 和为何应分析 adequate-model ensembles 而非唯一 best fit。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：2×2 characteristic polynomial、eigenvalue constraints、nonlinear-to-linear reparameterization、least squares、Hessian eigendecomposition 和 parameter-space geometry。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 oculomotor circuit、position tuning、integrator eigenmode、parameter ensemble、synaptic nonlinearity、stiff/sloppy spectrum与error contours。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：清楚区分 neural-state low dimensionality 与 parameter-space sloppiness；它们是不同空间中的不同概念。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：18–25 个问题，包含 eigenvalue algebra、weight-family reasoning、fit-shape checks、Hessian interpretation、degeneracy transfer。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 22 — 运动皮层潜在动力学与脑机接口 / Motor Cortex Latent Dynamics and Brain–Machine Interfaces

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 22：运动皮层潜在动力学与 Brain–Machine Interfaces**
- 最终文件名：`NEUROSCI366_Lecture22_Motor_Cortex_Latent_Dynamics_BMI_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture22-MotorCortex-UPDATE.pdf` — 5 pages；主版本。
- `Lecture22-MotorCortex.pdf` — 4 pages；旧版；逐页比较独有内容。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- UPDATE Page 1：center-out reach、direction tuning、low-dimensional variance/PCA。
- UPDATE Page 2：dynamical-mode perspective、latent factor space、neural activity embedding、GPFA observation model。
- UPDATE Page 3：Gaussian-process temporal covariance、parameter fitting、delayed-reach latent trajectories。
- UPDATE Page 4：preparatory activity、movement modes、linear readout、output-null space。
- UPDATE Page 5：neural decoding、feedforward/closed-loop BMI、latent-aligned cross-day stability。
- Original Pages 1–4：与 UPDATE 比较；旧版独有内容纳入。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 说明 center-out directional tuning 的经典解释及 tuning may be epiphenomenal 的现代动力学视角。
- 从 PCA variance decomposition 引出 low-dimensional population activity，但不把 low variance dimensions 自动视为无用。
- 区分 latent factor space 与 observed neural activity space；解释 high-dimensional embedding。
- 逐项解释 GPFA observation model `P(r_t|alpha_t)=N(C alpha_t+d,Sigma)` 与 latent Gaussian-process temporal covariance。
- 解释 smoothness、noise、scale non-identifiability、maximum-likelihood fitting 和 factor-analysis versus GPFA。
- 分析 delayed-reach task：target-specific preparatory trajectories、go-cue、movement trajectories。
- 推导 linear readout、null space 与 output-null preparatory activity；说明 `Ur=0` 不等于 `r=0`。
- 解释 feedforward versus closed-loop BMI、sensory feedback、latent-aligned decoders 和跨日 stability；明确这是 UPDATE 新增核心内容。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：PCA recap、Gaussian observation model、temporal covariance matrix、latent linear algebra、null-space dimension与readout。所有 `C,d,Sigma,U` shape 必须标注。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 center-out task/tuning、variance curve、latent embedding、GPFA covariance/trajectories、prep/movement/null modes、closed-loop BMI、cross-day accuracy。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：明确区分 tuning curve、principal components、latent factors、dynamical modes 和 decoder axes；这些概念可相关但不可互换。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：18–25 个问题，包含 PCA/GPFA comparison、matrix shapes、null-space reasoning、delayed-reach interpretation、BMI feedback and stability。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 23 — 短时记忆与知觉决策 / Short-Term Memory and Perceptual Decisions

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 23：短时记忆与知觉决策 / Short-Term Memory and Perceptual Decisions**
- 最终文件名：`NEUROSCI366_Lecture23_Short_Term_Memory_Perceptual_Decisions_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture23-Intro-ShortTermMemory-PerceptualDecisions.pdf` — 6 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：cognition working definition；decision、STM/working memory、learning/LTM/generalization。
- Page 2：delayed match-to-sample、parametric working memory、Romo vibration task。
- Page 3：persistent PFC activity、population modes、linear recurrent-memory dynamics。
- Page 4：random-dot decision、evidence accumulation、drift–diffusion model。
- Page 5：behavioral psychometric/chronometric curves、LIP neural correlates。
- Page 6：long integration modes、Wong–Wang nonlinear attractor model、phase planes。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 准确呈现 cognition 的课程 working definition：使脑状态不只由 present input 决定；说明其局限。
- 比较 delayed match-to-sample 与 parametric working memory；逐步解释 Romo task 的 sample、delay、comparison、choice。
- 解释 persistent activity 的 single-cell 与 population-mode views；说明 STM 不必依赖当场 synaptic plasticity。
- 用 recurrent eigenmode/leaky integrator 解释 graded persistent activity 与 long time constants。
- 逐项解释 drift–diffusion equation 的 decision variable、drift/evidence、leak、bounds、bias、noise、reaction time，以及 collapsing/sticky bounds 等变体。
- 重构 psychometric 与 chronometric predictions；解释 LIP ramping correlates 与 behavior-model variables 的关系，避免 correlation=mechanism。
- 解释 Wong–Wang reduced nonlinear recurrent model、two nullclines、stable/unstable fixed points、separatrix、weak/strong evidence 与 stochastic choice。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：stochastic differential-equation intuition、integration time constant、first-passage-to-bound、psychometric/chronometric curves、2D phase-plane attractors。无需高级随机微积分，但正式定义要准确。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 DMS/Romo timelines、persistent traces、DDM trajectories/bounds、psychometric/chronometric curves、LIP ramps、Wong–Wang nullclines。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：区分 working-memory content、neural correlate、persistent mode 与 synaptic memory；区分 descriptive DDM 与 biophysical attractor model。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：20–27 个问题，包含 task sequence、persistent-mode prediction、DDM parameter effects、curve interpretation、LIP causality critique、phase-plane choices。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 24 — 从奖励中学习 / Learning from Rewards

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 24：从奖励中学习 / Learning from Rewards**
- 最终文件名：`NEUROSCI366_Lecture24_Learning_from_Rewards_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture24-LearningFromRewards.pdf` — 6 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：learned decisions、stimulus-reward association、three-factor plasticity、dopamine。
- Page 2：covariance-based reward plasticity、reward-baseline subtraction、matching condition derivation。
- Page 3：matching law、fly foraging neural model。
- Page 4：value prediction、Rescorla–Wagner、blocking、temporal difference/discounting。
- Page 5：temporally extended features、state-action value/Q。
- Page 6：dopamine reward-prediction error patterns、value/Q signals、action selection。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 用 foraging 示例解释 stimulus/action/reward association 与 three-factor plasticity；明确 dopamine 是 canonical candidate third factor而非所有 reward learning 的唯一机制。
- 从 naive reward-gated Hebb rule 引出 over-strengthening，再推导 reward-baseline subtraction 和 covariance form。
- 逐步推导 matching condition：choice-conditioned expected rewards 相等如何导出 choice ratio≈reward ratio；说明 assumptions。
- 重构 fly mushroom-body model、stochastic choice 与 baseline reward estimate；解释 matching 的行为与神经实现层次。
- 从 linear value prediction 和 squared prediction error 推导 Rescorla–Wagner；用 blocking 解释 zero prediction error。
- 从 delayed rewards 推导 discounted return、value function 和 TD error `delta=R-V+gamma V_next`。
- 解释 temporal features/state representation、Q value 与 greedy action selection。
- 重绘 dopamine RPE 的 early reward、cue transfer、omitted reward 三种模式，并区分 RPE、value 和 salience alternative。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：covariance learning、conditional expectation、matching ratios、gradient-descent value learning、discounted sums、TD error 和 Q notation。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 foraging task、three-factor synapse、matching behavior curves、fly circuit、blocking timeline、TD/RPE traces、dopamine transfer/omission。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：Lecture 24 是 biological/reward-learning bridge，Lecture 25 才系统化 MDP/RL。不要提前让 Bellman/Q-learning 淹没本课的 plasticity 与 dopamine 逻辑。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：18–25 个问题，包含 baseline necessity、matching derivation、blocking prediction、TD-error calculation、dopamine trace interpretation、three-factor transfer。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 25 — 强化学习：MDP、Bellman 方程与 Q-learning / Reinforcement Learning: MDPs, Bellman Equations, and Q-Learning

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 25：强化学习——MDP, Bellman Equations, and Q-Learning**
- 最终文件名：`NEUROSCI366_Lecture25_Reinforcement_Learning_MDP_Q_Learning_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture25-ReinforcementLearning.pdf` — 6 pages；唯一主讲义；扫描/手写页必须逐页视觉读取。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：squirrel example、agent/environment/state/action/reward、Markov property、interaction loop。
- Page 2：discounted return、gamma、myopic/far-sighted、state value、policy、Q value、optimal policy。
- Page 3：Bellman optimality equation 的逐步推导。
- Page 4：Q-learning、Bellman error、update、exploration–exploitation、epsilon-greedy。
- Page 5：Tolman maze、generative model、hippocampal state representation、planning。
- Page 6：model-based RL、simulated experience、hippocampal replay、sample efficiency。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 从 squirrel environment 精确定义 agent、environment、state、action、reward、transition distribution 和 policy。
- 解释 Markov property 是关于 state representation 的条件独立性，不等于环境“没有历史”。
- 逐项推导 discounted return；解释 gamma→0 与 gamma→1 的行为和 continuing/episodic caveats。
- 严格区分 `V_pi(s)`、`Q_pi(s,a)`、`V*(s)`、`Q*(s,a)` 与 optimal policy。
- 按笔记步骤完整推导 Bellman optimality equation：当前 reward + next-state optimal value；保留 transition expectation。
- 从 Bellman error 推导 tabular Q-learning update；解释 learning rate、bootstrap、off-policy target 和 convergence assumptions 的适当背景。
- 分析 exploration–exploitation 与 epsilon-greedy 的优缺点。
- 用 Tolman maze 解释 generative/model-based representation；连接 hippocampal place/state coding、planning、replay 与 simulated experience。
- 比较 model-free vs model-based RL 的 computation、sample efficiency、flexibility 和 failure modes。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：conditional expectation、recursive decomposition、transition sums、argmax、stochastic update。使用小型 2–4 state MDP 完整手算一轮。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 agent-environment loop、discount horizon、value/Q relations、Bellman backup、Q-learning update、Tolman detour、model-based loop、replay path。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：不要把 Q-learning 与所有 TD learning 同义化；不要把 hippocampal replay 直接等同于精确 Bellman backup，必须标明 evidence 与 inference 的层级。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：20–28 个问题，包含 Markov diagnosis、return/Q calculations、Bellman derivation、Q update、epsilon-greedy choices、model-free/model-based transfer。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 26 — Hopfield 联想记忆模型 / Hopfield Associative Memory

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 26：Hopfield 联想记忆模型 / Hopfield Associative Memory**
- 最终文件名：`NEUROSCI366_Lecture26_Hopfield_Associative_Memory_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture26-Memory-HopfieldModel.pdf` — 6 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：explicit memory、Hebbian assemblies、encoding/retrieval、pattern completion、engram。
- Page 2：Hopfield binary network、asynchronous update、stored random patterns。
- Page 3：Ising energy、symmetric Hebbian weights、P=1 retrieval derivation、basins/spurious attractors。
- Page 4：odd-mixture states、memory capacity、signal-plus-interference decomposition。
- Page 5：Gaussian approximation、error probability、P∝N、critical alpha≈0.138、spin-glass transition。
- Page 6：sparse/stochastic associative-memory alternative、global inhibition、near-optimal capacity。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 从 Hebbian cell assembly 解释 encoding、partial cue、retrieval、pattern completion 和 attractor basin；区分 biological hypothesis 与 abstract binary model。
- 精确定义 binary states、random patterns、asynchronous single-neuron update 和 convergence procedure。
- 解释 Ising energy，证明 symmetric weights/asynchronous updates 使 energy non-increasing；说明 synchronous update 的差异。
- 从 Hebbian weight rule 完整推导 P=1 时 stored pattern 为 attractor，并分析 aligned/anti-aligned/spurious states。
- 解释 odd-mixture spurious attractors及 basin of attraction。
- 对 P>1 做 signal-plus-crosstalk decomposition；逐步计算 interference mean/variance，并用 Gaussian approximation得到 error tendency。
- 解释 capacity proportional to N、loading alpha=P/N、critical `alpha_c≈0.138` 和 spin-glass transition；说明该常数依赖经典模型假设。
- 比较 sparse `{0,1}` stochastic model、global inhibition、temperature 与 information capacity。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：sign function、dot-product overlap、energy difference、random sums、mean/variance、Gaussian tail、order-of-N scaling。推导必须以小 N pattern 手算开始。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 assembly encoding/retrieval、attractor landscape/basins、binary patterns、energy descent、mixture state、signal/noise distribution、capacity transition。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：明确“memory capacity 0.138N”只属于经典 dense random-pattern Hopfield model 的稳定-retrieval criterion，不是大脑记忆容量结论。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：20–28 个问题，包含 asynchronous updates、energy proof、P=1 retrieval、overlap/basin、capacity scaling、spurious-state diagnosis。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。



---

# 独立任务：NEUROSCI 366 Lecture 27 — 系统巩固与泛化 / Systems Consolidation and Generalization

你现在是 **computational neuroscience professor、mathematical tutor、textbook author、scientific illustrator、assessment designer 与 PDF production editor**。这是一个**独立、一次性、完整的出版任务**。本提示词不依赖任何其他 lecture prompt，也不要把任务改造成连续聊天课程。

## 1. 不可更改的最终目标

读取本提示列出的原始课程文件，创建**恰好一份**高密度、standalone、source-aligned 的静态 PDF 教材：

- PDF 标题：**NEUROSCI 366 Lecture 27：系统巩固与泛化 / Systems Consolidation and Generalization**
- 最终文件名：`NEUROSCI366_Lecture27_Systems_Consolidation_Generalization_Companion.pdf`
- 最终效果：读者即使不看聊天记录，也能仅凭这份 PDF 达到“认真上完并掌握这一课”的水平；同时可以拿着原手写笔记逐页对照。
- 这不是 summary、lecture outline、slide deck、聊天转录、flash-card dump，也不是另一条 prompt。
- 不要先向我提诊断问题、不要等待多轮互动、不要只在聊天中输出正文；直接完成 source audit、教材编写、PDF 生成与质量验证。
- 可以使用当前对话中真实可见的学习记录来调整解释重点；若看不到历史，直接使用下面的默认学习者画像，不得因此中止。

“只读 PDF”在这里指**静态、非交互式成品**：不要加入 fillable form fields、JavaScript、隐藏答案按钮或动态组件；也不要加密码或 DRM。正文必须可搜索、可选择文字，公式与图应尽量为矢量或高分辨率，纸上可直接书写答案。

## 2. 必须读取的源文件

- `Lecture27-SystemsConsolidation-Generalization.pdf` — 5 pages；唯一主讲义。

如果这些文件位于 `NEUROSCI366.zip` 中，先在当前环境解压并定位精确文件名。只有在文件确实不存在或无法访问时才向用户报告；不得从文件名或本提示的主题清单反向编造未读内容。

## 3. 默认学习者画像与语言

目标读者：

- 已完成大学本科层次的 neuroscience education；
- 熟悉 neuron、action potential、synapse、spike train、firing rate、PSTH、receptive field、basic electrophysiology；
- 数学按高中水平起步：可用 algebra、functions、exponents、logs、basic trigonometry，但不要默认熟练 calculus、linear algebra、probability、differential equations、Fourier analysis 或 optimization；
- 最终标准仍是本科高年级 computational neuroscience，不允许因数学基础有限而删掉正式模型或推导；
- 熟悉 MATLAB/Python 基础，并对 Neuropixels、head-direction cells、visual receptive-field mapping、population decoding 等例子较有亲和力。

语言规范：

- 主体用清晰、自然、严谨的中文；
- 专业词首次出现写成 `中文名称（English term, abbreviation/symbol）`，之后可中英混用；
- 公式、变量、brain regions、model names 与经典实验名保留标准英文；
- 不做逐句双语翻译；在定义、图注、公式表和 glossary 中强化英文术语；
- supplemental personalized examples 可使用 HD cells、ADN、RF mapping 或 electrophysiology，但必须先完整保留原笔记的例子，且不要写入用户姓名或私人信息。

## 4. Source audit：禁止遗漏的读取流程

在写作前完成内部 coverage ledger：

1. 将每个 PDF 的每一页渲染为至少 180–220 dpi 图像并逐页视觉检查。大部分讲义是手写扫描页，禁止只依赖 OCR 或 text extraction。
2. 对每页记录：标题/概念、每条独立陈述、公式、符号、图、坐标轴、箭头、例子、实验、边注、假设、限制和跨页延续。
3. 对代码文件逐行读取，不得只看 PDF 截图或函数名。
4. 不能辨认的手写内容要在 PDF 的 **Uncertainty Log** 中注明文件、页码、局部位置、可能解释和置信度；不得以流畅文字掩盖猜测。
5. 若发现疑似笔误、符号不一致、维度错误或 code bug：先忠实写出原稿，再标记 `【原笔记疑似错误】`，给出可验证的修正与理由；不得静默修正。
6. 原笔记是内容权威。必要的数学背景可补充；外部资料只用于核对或补足前置，并放入 endnotes，不能替代原稿。
7. 最终 appendix 必须给出逐页 coverage table，证明每一源页均已处理。重复页也要标为 recap/duplicate，而不是消失。

## 5. 本课逐页对照地图

以下地图是最低核验清单，不可替代真实视觉读取：

- Page 1：memory locus/quality over time、patient E.P.、standard systems consolidation、hippocampal replay、episodic/semantic。
- Page 2：Teacher–Student–Notebook framework、generative teacher、neocortical student、hippocampal one-shot notebook。
- Page 3：autoassociative notebook、pattern separation/completion、student–notebook Hebbian interactions。
- Page 4：linear teacher/student model、memory error、generalization error、standard complementary learning systems。
- Page 5：overfitting unpredictable components、stopping consolidation、Go-CLS、predictability/SNR、lesion predictions。

PDF 的主体必须沿原笔记页序推进。每个 source-page 单元至少包含：

- `Original-note anchor`：文件名与原页码；如技术允许，放一个不喧宾夺主的小缩略图或关键 crop；
- `Clean reconstruction`：将手写定义、公式和图重新排版/重绘；
- `What the note is saying`：逐条准确解释；
- `Why it follows`：补齐省略的数学、生物学或逻辑步骤；
- `Figure reading`：轴、曲线、参数、方向、预测与不能证明的内容；
- `Stop & Predict`：在给出结论前插入一个静态主动思考题；
- `Source reference`：统一写成 `[Source: exact filename, p. N]`。

不要机械地为每页重复相同开场；要在保持页码对应的同时形成连贯教材。

## 6. 本课必须完整覆盖的内容

- 解释 memories 的 anatomical locus 与 psychological character 随时间改变；准确呈现 patient E.P. 与 recent/remote amnesia evidence，不夸大单案例。
- 比较 recent vivid episodic detail 与 remote gist/semantic character；说明 standard systems-consolidation account。
- 解释 hippocampal replay、compressed trajectories 与 neocortical reactivation之间的 hypothesized link。
- 逐项重构 Teacher–Student–Notebook：teacher/environment generative model、student/neocortex predictive learner、notebook/hippocampus one-shot autoassociative memory。
- 解释 notebook 的 pattern separation、pattern completion、Hebbian student↔notebook interaction与seeding。
- 从 linear teacher/student model 定义 memory error 与 population generalization error；说明 fast notebook memory 与 slow student generalization 的 tradeoff。
- 解释 standard CLS 在 noise/unpredictable components 下可能 overfit；推导/解释停止巩固的必要性。
- 讲解 generalization-optimized CLS (Go-CLS)、predictability/SNR-controlled transfer、lesion predictions，以及为什么 unpredictable episodic details remain hippocampus-dependent。

这是 minimum coverage inventory。凡原页中出现而清单没有写出的实质信息，仍必须纳入。不要为了“延伸”而挤掉原材料；必要背景与扩展分别标为 `【必要前置】`、`【跨课连接】` 或 `【延伸】`。

## 7. 数学支架与严谨性

本课数学重点：generative model notation、linear regression intuition、training/memory error vs expected generalization error、signal-plus-noise/predictability ratio和learning curves。

每个重要公式必须依次回答：

1. 它解决什么问题？
2. 每个符号是什么，单位/取值范围/shape 是什么？
3. 它依赖哪些 assumptions？
4. 从上一行到下一行使用了哪条代数、概率或微积分规则？
5. 结果的 geometric/computational intuition 是什么？
6. biological interpretation 是什么？
7. limiting cases、sign、units 与 dimensions 是否合理？
8. 用一个小型 numerical example 如何验证？
9. 在什么条件下会失败？

禁止用“显然”“容易得到”“经过一些代数”跳过关键步骤。新数学工具按 `问题 → 直觉 → 极小数值例子 → 正式定义 → 本课应用` 的顺序引入。矩阵运算必须标 shape；dynamical equation 必须标 state、input、parameter、time constant、fixed point 与 stability。

## 8. 图、代码与实验

重点图形要求：重绘 consolidation timeline、replay、Teacher–Student–Notebook graph、attractor notebook、memory/generalization curves、Go-CLS stopping、lesion prediction curves。

- 原笔记中的每幅有意义的图都要解释或重绘；不要用模糊截图代替教学。
- 重新绘制的曲线必须忠实于概念，不可伪造精确数据点；示意图明确标 `schematic`。
- 对实验说明 stimulus/task、recording/manipulation、measured quantity、main result、model interpretation 与 limitation。
- 如有 MATLAB：逐行解释目的、syntax、shape、单位、预期输出、indexing、numerical stability、edge cases 与可改写方式；原始写法和改写不能混淆。
- 如本课没有源代码，最多加入一个短小、可选的 computational illustration；不得让代码淹没原课。

特别风险与边界：明确区分 empirical observations、standard theory、Teacher–Student–Notebook formal model 和 Go-CLS predictions；不要把模型预测写成已证实事实。

## 9. 将“互动式教学”嵌入静态 PDF

PDF 虽然静态，但必须促进 active learning：

- 在关键结论之前安排 **Stop & Predict**；
- 每个主要数学段落后安排 **Micro-check**；
- 每个大章节末安排 **Explain in your own words** 与 **Self-reflection**；
- 设计三级提示：Hint 1 只给方向，Hint 2 给中间支架，Hint 3 给近完整结构；提示放在后部 Hint Bank，不紧挨题目；
- 完整答案与评分要点放在最后的 Answer Key，至少跨一个明确 page break；
- 为打印作答保留适量空白，但不要牺牲知识密度；
- 用“常见错误诊断”说明 conceptual confusion、symbol confusion、algebra error、assumption omission 与 correlation/causation error 分别长什么样。

本课 assessment 规格：18–25 个问题，包含 evidence/theory separation、framework mapping、memory-vs-generalization curves、overfitting diagnosis、lesion predictions、cross-lecture synthesis。

## 10. PDF 的固定结构

按以下顺序组织成品；可按本课需要细分，但不得删除：

1. Cover page：中英标题、source files、版本日期；
2. How to use this companion；
3. Learning objectives 与 prerequisite dependency map；
4. Five-minute prerequisite diagnostic（带页码跳转建议，不需要聊天反馈）；
5. Source-aligned lesson，按原笔记页序展开；
6. Cross-page synthesis：把零散页连成一个因果/数学链；
7. Worked examples 与至少一个 novel neuroscience transfer example；
8. Formula and notation sheet；
9. Bilingual glossary；
10. Common traps / model assumptions / limitations；
11. Cumulative knowledge check；
12. Hint Bank；
13. Complete Answer Key with reasoning；
14. Source-page concordance and coverage audit；
15. Errata / uncertainty log / external endnotes。

PDF 必须 standalone：若使用前课概念，给足够的 concise prerequisite bridge；不要只写“见 Lecture X”。同时避免把前课完整复制进来。

## 11. 排版与可打印性

- 使用 US Letter portrait（8.5×11 in），布局在 A4 缩放打印时也安全；
- 正文约 10.5–11.5 pt，行距舒适，边距不小于约 0.6 in；
- 高知识密度但避免巨型文字墙：使用清晰 heading、equation blocks、compact tables、callout boxes；
- 色彩只作辅助，所有图在 grayscale 下仍可辨认；不要仅靠红/绿区分；
- 使用支持中文与数学的字体，确保没有方框、乱码、上下标丢失；
- 所有页有 header/footer、lecture title、source-page anchors 与 PDF page number；
- 生成 bookmarks/TOC；
- 不得有 clipped text、公式越界、重叠、孤行、低分辨率图或过小图注；
- 不设武断页数上限。完整性与可读性决定长度，禁止用重复话术凑页。

## 12. 最终 QA 与交付

完成后必须：

1. 将最终 PDF 全部页重新渲染并逐页检查；
2. 核对 CJK glyphs、equations、tables、figures、page references、TOC/bookmarks；
3. 对照内部 ledger，确认所有 source pages、公式、图、例子与代码均已覆盖；
4. 确认成品只有一份 PDF，不拆成讲义/答案两个文件；
5. 不在聊天中粘贴整本教材。

最终聊天回复只需要提供：

- 可下载的 PDF 链接与精确文件名；
- 一句 coverage status；
- 若存在无法辨认或未解决的问题，列出准确文件与页码。

现在开始读取源文件并生成实际 PDF。不要停在计划、提纲、样章或“我可以为你生成”的承诺上。
