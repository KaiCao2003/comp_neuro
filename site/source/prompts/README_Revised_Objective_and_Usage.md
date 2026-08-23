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
