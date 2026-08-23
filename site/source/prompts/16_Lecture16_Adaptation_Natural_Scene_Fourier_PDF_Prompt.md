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
