import katex from 'katex';
import { parseScientificText } from '../lib/scientific-text';

function renderInlineMath(source: string) {
  try {
    return katex.renderToString(source, {
      displayMode: false,
      output: 'htmlAndMathml',
      strict: 'ignore',
      throwOnError: true,
    });
  } catch {
    return null;
  }
}

function InlineMath({ source }: { source: string }) {
  const html = renderInlineMath(source);
  if (!html) return <span>{source}</span>;
  const scrollable = source.length > 20;
  return <span className={`scientific-inline-math${scrollable ? ' scientific-inline-math-scroll' : ''}`} data-math-source={source} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function ScientificText({ text }: { text: string }) {
  return <>{parseScientificText(text).map((segment, index) => {
    if (segment.kind === 'math') return <InlineMath source={segment.value} key={`${index}-${segment.value}`} />;
    if (segment.kind === 'code') return <code className="scientific-inline-code" key={`${index}-${segment.value}`}>{segment.value}</code>;
    return segment.value;
  })}</>;
}
