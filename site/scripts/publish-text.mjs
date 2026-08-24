const chinesePageNumber = String.raw`(?:\d+|[一二三四五六七八九十两]+)`;
const chinesePageRange = String.raw`${chinesePageNumber}(?:\s*[–—-]\s*${chinesePageNumber})?`;
const englishPageNumber = String.raw`(?:\d+(?:st|nd|rd|th)?|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)`;
const pageRange = String.raw`${englishPageNumber}(?:\s*[–—-]\s*${englishPageNumber})?`;
const contextualReplacement = (match, replacement) => /^[A-Z]/.test(match)
  ? `${replacement[0].toUpperCase()}${replacement.slice(1)}`
  : replacement;

/**
 * Remove the archival voice used while reconstructing the notes. Published
 * lessons should sound like a teacher continuing an explanation, not like a
 * concordance that announces where a statement appeared on a PDF page.
 */
export function removeSourceFraming(value = '') {
  const sourceText = String(value);
  const chineseContext = /[\u3400-\u9fff]/.test(sourceText);
  const sectionPhrase = chineseContext ? '这一段讲解' : 'this section';
  const previousPhrase = chineseContext ? '前面的讨论' : 'the preceding discussion';
  const nextPhrase = chineseContext ? '接下来的内容' : 'the next step';
  const lessonPhrase = chineseContext ? '本讲' : 'this lesson';
  const lessonPossessive = chineseContext ? '本讲的' : "this lesson's";
  const codeLocation = chineseContext ? '示例代码中的对应位置' : 'the corresponding line in the example code';
  const materialPhrase = chineseContext ? '相关材料' : 'the lesson material';

  return sourceText
    .replace(/；?\s*明确这是\s*UPDATE\s*新增核心内容。?/g, '。')
    .replace(/,?\s*explicitly identifying this as major new UPDATE material\.?/gi, '.')
    .replace(new RegExp(`UPDATE\\s*第\\s*${chinesePageRange}\\s*页`, 'gi'), '更新版本')
    .replace(new RegExp(`(?:旧版|先前版本)\\s*第\\s*${chinesePageRange}\\s*页`, 'g'), '旧版')
    .replace(new RegExp(`(?:课程原稿|原始讲义|原始|原讲义|讲义原稿|原稿|讲义|原笔记|笔记)?\\s*第\\s*${chinesePageRange}\\s*页`, 'g'), '这一段讲解')
    .replace(/(?:上一页|前一页)/g, '前面的讨论')
    .replace(/(?:下一页|后一页)/g, '接下来')
    .replace(/(?:本页|这一页)/g, '这里')
    .replace(/原页/g, '这里')
    .replace(/课程原稿给出的/g, '这里采用的')
    .replace(/(?:原始讲义|原讲义|讲义原稿|原笔记|课程原稿|原稿)(?=\s*(?:中|里|给出|指出|采用|使用|写出|写成|把|将|没有|未|的))/g, '这里')
    .replace(/独立于原稿/g, '独立于前述')
    .replace(/采用原稿/g, '这里采用的')
    .replace(/保持原稿/g, '保持上述')
    .replace(/原稿强调/g, '需要注意')
    .replace(/原稿以/g, '这里以')
    .replace(/原稿保留/g, '这里保留')
    .replace(/原稿列出的/g, '这里列出的')
    .replace(/(?:原始讲义|原讲义|讲义原稿|原笔记|课程原稿|原稿)/g, '这里')
    .replace(/来源公式/g, '所述公式')
    .replace(/\b[A-Za-z0-9][A-Za-z0-9_.()-]*\.(?:m|py)\s+(?:lines?\s+\d+(?:\s*[–—-]\s*\d+)?)/gi, codeLocation)
    .replace(/\b(?:Solutions?|Notes?|Exercises?)\s+p\.?\s*\d+(?:\s*[–—-]\s*\d+)?\s*的?/gi, '')
    .replace(/\bp\.?\s*\d+(?:\s*[–—-]\s*\d+)?\b/gi, chineseContext ? '对应位置' : 'the relevant point')
    .replace(/\b[A-Za-z0-9][A-Za-z0-9_.()-]*\.pdf\b/gi, materialPhrase)
    .replace(/\b[A-Za-z0-9][A-Za-z0-9_.()-]*\.(?:m|py)\b/gi, chineseContext ? '示例代码' : 'the example code')
    .replace(new RegExp(`\\b(?:on|from|in|at)\\s+(?:the\\s+)?(?:(?:original|course)\\s+)?(?:(?:notes?|exercise|source)\\s+)?pages?\\s+${pageRange}\\b`, 'gi'), '')
    .replace(new RegExp(`\\b(?:the\\s+)?(?:(?:original|course)\\s+)?(?:(?:notes?|exercise|source)\\s+)?pages?\\s+${pageRange}\\b`, 'gi'), (match) => contextualReplacement(match, sectionPhrase))
    .replace(new RegExp(`\\b(?:the\\s+)?${englishPageNumber}\\s+(?:(?:notes?|exercise|source)\\s+)?page\\b`, 'gi'), (match) => contextualReplacement(match, sectionPhrase))
    .replace(/\b(?:the\s+)?(?:previous|preceding)\s+page\b/gi, (match) => contextualReplacement(match, previousPhrase))
    .replace(/\b(?:the\s+)?(?:next|following)\s+page\b/gi, (match) => contextualReplacement(match, nextPhrase))
    .replace(/\b(?:the\s+)?source\s+page's\b/gi, (match) => contextualReplacement(match, lessonPossessive))
    .replace(/\b(?:the\s+)?source\s+page\b/gi, (match) => contextualReplacement(match, lessonPhrase))
    .replace(/\b(?:the\s+)?(?:source|original|course|updated|earlier|previous)\s+(?:notes?|handout)(?:'s|')?\b/gi, (match) => contextualReplacement(match, lessonPhrase))
    .replace(/\bsource formula\b/gi, chineseContext ? '所述公式' : 'stated formula')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const untouchedKeys = new Set(['file', 'href', 'sourceFile', 'companionFile', 'companionHref', 'codeSources']);

/** Recursively clean prose while preserving file names, URLs, and source code. */
export function sanitizePublishedValue(value, key = '') {
  if (untouchedKeys.has(key)) return value;
  if (Array.isArray(value)) return value.map((item) => sanitizePublishedValue(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, sanitizePublishedValue(childValue, childKey)]));
  }
  return typeof value === 'string' ? removeSourceFraming(value) : value;
}

/** Point public links at teaching modules instead of retired source-page units. */
export function alignPublishedSections(value) {
  const lecture = structuredClone(value);
  const modules = lecture.studyGuide?.modules ?? [];
  const moduleIds = new Set(modules.map((studyModule) => studyModule.id));
  const units = new Map((lecture.sourceUnits ?? []).map((unit) => [unit.id, unit]));

  const matchingModuleId = (item, explicitAnchor) => {
    if (moduleIds.has(item.sectionId)) return item.sectionId;
    const unit = units.get(item.sectionId);
    const file = explicitAnchor?.file ?? item.sourceFile ?? unit?.sourceFile;
    const page = explicitAnchor?.page ?? item.sourcePage ?? unit?.page;
    const exact = modules.find((studyModule) => studyModule.sourceRefs?.some((ref) => ref.file === file && ref.page === page));
    const sameFile = modules.find((studyModule) => studyModule.sourceRefs?.some((ref) => ref.file === file));
    return exact?.id ?? sameFile?.id ?? modules[0]?.id ?? item.sectionId;
  };

  lecture.questions = (lecture.questions ?? []).map((question) => {
    const sectionId = matchingModuleId(question, question.sourceAnchors?.[0]);
    return {
      ...question,
      sectionId,
      sourceAnchors: (question.sourceAnchors ?? []).map((anchor) => ({ ...anchor, section: sectionId })),
    };
  });
  lecture.formulas = (lecture.formulas ?? []).map((formula) => ({ ...formula, sectionId: matchingModuleId(formula) }));
  lecture.glossary = (lecture.glossary ?? []).map((entry) => ({ ...entry, sectionId: matchingModuleId(entry) }));
  lecture.errata = (lecture.errata ?? []).map((item) => ({ ...item, sectionId: matchingModuleId(item) }));
  return lecture;
}
