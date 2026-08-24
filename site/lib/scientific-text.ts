export type ScientificTextSegment = {
  kind: 'text' | 'math' | 'code';
  value: string;
};

const EXPLICIT_TOKEN = /\\\(([\s\S]*?)\\\)|`([^`\n]+)`/g;
const GREEK = /[Α-Ωα-ωϑϕϵ]/u;
const UNICODE_SCRIPT = /[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁱⁿᵃᵇᶜᵈᵉᶠᵍʰʲᵏˡᵐᵒᵖʳˢᵗᵘᵛʷˣʸᶻ₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₒₓₕₖₗₘₙₚₛₜᵢⱼᵣᵤᵥᵦᵧᵨᵩᵪᵀ′″]/u;
const RELATION_OR_LARGE_OPERATOR = /[=<>≈≠≤≥→←↔⇒↑↓∞±∓∑∫√∈∝∼∂∇≪≫⊙∥⊥≡]/u;
const COMBINING_MARK = /[̂̇́̄̃]/u;
const SAFE_NAMED_IDENTIFIER = new Set(['argmax', 'argmin', 'bernoulli', 'binomial', 'cos', 'cov', 'det', 'diag', 'exp', 'exponential', 'inf', 'inv', 'ln', 'log', 'max', 'mean', 'min', 'mod', 'nan', 'norm', 'normal', 'poisson', 'rank', 'relu', 'sgn', 'sigmoid', 'sign', 'sin', 'softmax', 'sqrt', 'sum', 'tan', 'tr', 'trace', 'var', 'vec']);
const ROMAN_SUBSCRIPT = new Set(['crit', 'eff', 'eq', 'ext', 'half', 'hat', 'inf', 'in', 'int', 'ion', 'leak', 'max', 'mean', 'mem', 'min', 'out', 'post', 'pre', 'pref', 'reset', 'rest', 'rev', 'ss', 'syn', 'th']);
const ROMAN_IDENTIFIER = new Set(['bias', 'choice', 'criticalalpha', 'factor', 'fano', 'gradient', 'greedy', 'inside', 'input', 'modulus', 'noise', 'normalized', 'outside', 'output', 'prediction', 'random', 'rate', 'residual', 'signal', 'spike', 'variance']);
const UNIT_IDENTIFIER = new Set(['cm', 'deg', 'hz', 'khz', 'mm', 'ms', 'mv', 'na', 'nf', 'nm', 'ns', 'pa', 'pf', 'rad', 'uf', 'μm', 'μs']);
const CODE_IDENTIFIER = new Set(['elseif', 'linspace', 'num_t', 'ones', 'plot', 'subplot', 't_values', 'zeros']);
const PROSE_IDENTIFIER = new Set(['and', 'are', 'as', 'by', 'for', 'from', 'has', 'have', 'if', 'into', 'is', 'not', 'of', 'on', 'or', 'than', 'that', 'the', 'then', 'there', 'to', 'using', 'was', 'were', 'when', 'where', 'which', 'while', 'with']);
const COMPACT_DERIVATIVE = /^d[A-Za-z](?:\d+|[ijk])?$/;
const COMPACT_FUNCTION = /^(ln|log|exp|sin|cos|tan)(\d+(?:\.\d+)?)$/i;
const COMPACT_ROMAN_SUFFIX = /^(?:[A-Za-z])(crit|current|eff|eq|ext|half|inf|int|ion|leak|max|mean|mem|min|next|out|post|pre|pref|reset|rest|rev|ss|syn|th)$/;
const SUPERSCRIPT_MAP: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '-', '⁼': '=', '⁽': '(', '⁾': ')', 'ⁱ': 'i', 'ⁿ': 'n', 'ᵃ': 'a', 'ᵇ': 'b', 'ᶜ': 'c', 'ᵈ': 'd', 'ᵉ': 'e', 'ᶠ': 'f', 'ᵍ': 'g', 'ʰ': 'h', 'ʲ': 'j', 'ᵏ': 'k', 'ˡ': 'l', 'ᵐ': 'm', 'ᵒ': 'o', 'ᵖ': 'p', 'ʳ': 'r', 'ˢ': 's', 'ᵗ': 't', 'ᵘ': 'u', 'ᵛ': 'v', 'ʷ': 'w', 'ˣ': 'x', 'ʸ': 'y', 'ᶻ': 'z', 'ᵀ': '\\mathrm{T}' };
const SUBSCRIPT_MAP: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', '₊': '+', '₋': '-', '₌': '=', '₍': '(', '₎': ')', 'ₐ': 'a', 'ₑ': 'e', 'ₒ': 'o', 'ₓ': 'x', 'ₕ': 'h', 'ₖ': 'k', 'ₗ': 'l', 'ₘ': 'm', 'ₙ': 'n', 'ₚ': 'p', 'ₛ': 's', 'ₜ': 't', 'ᵢ': 'i', 'ⱼ': 'j', 'ᵣ': 'r', 'ᵤ': 'u', 'ᵥ': 'v', 'ᵦ': '\\beta', 'ᵧ': 'y', 'ᵨ': '\\rho', 'ᵩ': '\\phi', 'ᵪ': '\\chi' };
const SYMBOL_LATEX: Record<string, string> = {
  '−': '-', '·': '\\cdot ', '×': '\\times ', '∗': '\\ast ', '→': '\\to ', '←': '\\leftarrow ', '↔': '\\leftrightarrow ',
  '⇒': '\\Rightarrow ', '↑': '\\uparrow ', '↓': '\\downarrow ', '∞': '\\infty ', '≈': '\\approx ', '≠': '\\ne ',
  '≤': '\\le ', '≥': '\\ge ', '≪': '\\ll ', '≫': '\\gg ', '±': '\\pm ', '∓': '\\mp ', '≡': '\\equiv ',
  '∑': '\\sum ', '∫': '\\int ', '√': '\\sqrt ', '∈': '\\in ', '∝': '\\propto ', '∼': '\\sim ',
  '∂': '\\partial ', '∇': '\\nabla ', '⊙': '\\odot ', '∥': '\\Vert ', '⊥': '\\perp ', '⋯': '\\cdots ',
  '∆': '\\Delta ', 'Ĩ': '\\widetilde I', 'ŷ': '\\hat{y}', 'ŝ': '\\hat{s}', 'ŵ': '\\hat{w}', 'ℓ': '\\ell ', 'ℝ': '\\mathbb{R}', 'ℤ': '\\mathbb{Z}',
  'ℕ': '\\mathbb{N}', 'ℚ': '\\mathbb{Q}', 'ℂ': '\\mathbb{C}',
  'Α': 'A', 'Β': 'B', 'Γ': '\\Gamma ', 'Δ': '\\Delta ', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Θ': '\\Theta ',
  'Ι': 'I', 'Κ': 'K', 'Λ': '\\Lambda ', 'Μ': 'M', 'Ν': 'N', 'Ξ': '\\Xi ', 'Ο': 'O', 'Π': '\\Pi ',
  'Ρ': 'P', 'Σ': '\\Sigma ', 'Τ': 'T', 'Υ': '\\Upsilon ', 'Φ': '\\Phi ', 'Χ': 'X', 'Ψ': '\\Psi ', 'Ω': '\\Omega ',
  'α': '\\alpha ', 'β': '\\beta ', 'γ': '\\gamma ', 'δ': '\\delta ', 'ε': '\\epsilon ', 'ϵ': '\\epsilon ',
  'ζ': '\\zeta ', 'η': '\\eta ', 'θ': '\\theta ', 'ϑ': '\\vartheta ', 'ι': '\\iota ', 'κ': '\\kappa ',
  'λ': '\\lambda ', 'μ': '\\mu ', 'ν': '\\nu ', 'ξ': '\\xi ', 'ο': 'o', 'π': '\\pi ', 'ρ': '\\rho ',
  'σ': '\\sigma ', 'ς': '\\varsigma ', 'τ': '\\tau ', 'υ': '\\upsilon ', 'φ': '\\phi ', 'ϕ': '\\varphi ',
  'χ': '\\chi ', 'ψ': '\\psi ', 'ω': '\\omega ',
};

function append(segments: ScientificTextSegment[], segment: ScientificTextSegment) {
  if (!segment.value) return;
  const previous = segments.at(-1);
  if (previous?.kind === segment.kind && segment.kind === 'text') previous.value += segment.value;
  else segments.push(segment);
}

function hasBalancedDelimiters(value: string) {
  const stack: string[] = [];
  const closes: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  for (const character of value) {
    if ('([{'.includes(character)) stack.push(character);
    else if (character in closes && stack.pop() !== closes[character]) return false;
  }
  return stack.length === 0;
}

function convertParenthesizedNotation(value: string): string {
  let output = '';
  let cursor = 0;
  while (cursor < value.length) {
    const marker = value.startsWith('^(', cursor) ? '^(' : value.startsWith('√(', cursor) ? '√(' : null;
    if (!marker) {
      output += value[cursor];
      cursor += 1;
      continue;
    }

    let depth = 1;
    let end = cursor + marker.length;
    while (end < value.length && depth > 0) {
      if (value[end] === '(') depth += 1;
      else if (value[end] === ')') depth -= 1;
      end += 1;
    }
    if (depth !== 0) {
      output += marker;
      cursor += marker.length;
      continue;
    }

    const contents = convertParenthesizedNotation(value.slice(cursor + marker.length, end - 1));
    output += marker === '^(' ? `^{${contents}}` : `\\sqrt{${contents}}`;
    cursor = end;
  }
  return output;
}

function prepareScientificNotation(value: string) {
  return convertParenthesizedNotation(value)
    // Resolve compact course-specific products before the generic identifier pass.
    .replace(/Σ_([ijk])W([ijk]{2})S_([ijk])/gu, 'Σ_$1 W_{$2} S_$3')
    .replace(/\bW([ijk]{2})S_([ijk])S_([ijk])/g, 'W_{$1}S_$2S_$3')
    .replace(/Σ(a′?)(?=π\s*\()/gu, 'Σ_{$1}')
    .replace(/([VQ])π/gu, '$1_{π}')
    .replace(/Eπ/gu, 'E_{π}')
    .replace(/\bGt(?=\s*(?:[|=+\-−*/),\]]|$))/g, 'G_{t}')
    .replace(/\b(ln|exp|sin|cos|tan)(\d+(?:\.\d+)?)/gi, (_match, fn: string, operand: string) => `\\${fn.toLowerCase()} ${operand}`)
    .replace(/\blog(\d+(?:\.\d+)?)(?=\()/gi, '\\log_{$1}')
    .replace(/\blog(\d+(?:\.\d+)?)/gi, '\\log $1')
    .replace(/Σ(?=\s*(?:_|[A-Za-zΑ-Ωα-ωϑϕϵ]))/gu, '\\sum ')
    .replace(/Π(?=\s*(?:_|\[|[A-Za-zΑ-Ωα-ωϑϕϵ]))/gu, '\\prod ')
    .replace(/\[([A-Za-zΑ-Ωα-ωϑϕϵ]+)\](in|out)\b/gu, '[$1]_{\\mathrm{$2}}')
    .replace(/([Α-Ωα-ωϑϕϵ])(\d+|[ijk])(?=$|[^A-Za-z0-9_])/gu, '$1_{$2}')
    .replace(/λ([ABN])\b/gu, 'λ_{$1}')
    .replace(/η([SMR])\b/gu, 'η_{$1}')
    .replace(/τh\b/gu, 'τ_h')
    .replace(/([A-Za-z]+)_([ijk])([Α-Ωα-ωϑϕϵ])(?=$|[^A-Za-z0-9_])/gu, '$1_{$2$3}')
    // Source prose sometimes writes adjacent indexed factors without a separator.
    .replace(/([Α-Ωα-ωϑϕϵ])_([ijk])([A-Za-zΑ-Ωα-ωϑϕϵ])_([ijk]{1,2}|\d+)/gu, '$1_{$2}$3_{$4}')
    .replace(/([Α-Ωα-ωϑϕϵ])_([ijk])t(?=[+\-−*/=<>])/gu, '$1_{$2}t')
    .replace(/([Α-Ωα-ωϑϕϵ])_([ijk])a(?=\()/gu, '$1_{$2}a')
    .replace(/([A-Za-z])_([ijk]{1,2})([A-Za-zΑ-Ωα-ωϑϕϵ])_([ijk]|\d+)/gu, '$1_{$2}$3_{$4}')
    .replace(/\b([A-Z])([ijk]{2})([A-Z])_([ijk])([A-Z])_([ijk])/g, '$1_{$2}$3_{$4}$5_{$6}')
    .replace(/\b([A-Z])([ijk]{2})([A-Z])_([ijk])/g, '$1_{$2}$3_{$4}')
    // In these course notes, a spaced "x tilde_mu" means x-tilde indexed by mu.
    .replace(/([A-Za-zΑ-Ωα-ωϑϕϵ])\s+tilde_([A-Za-z0-9Α-Ωα-ωϑϕϵ]+)/gu, '\\widetilde{$1}_{$2}')
    // A sign attached to a mode label is an index, not an arithmetic operator.
    .replace(/([Α-Ωα-ωϑϕϵ])([+\-−])(?=$|[=+\-−*/),\]])/gu, '$1_{$2}')
    // Only explicit state/action-at-time relations get a temporal subscript.
    .replace(/\b([as])t(?=\s*[=|])/g, '$1_t')
    .replace(/(?<=[=+\-−*/])ze(?=$|[+\-−*/),.;:=<>≈≠≤≥])/gu, 'z e')
    .replace(/\^([+−-]\d+(?:\.\d+)?)/gu, '^{$1}')
    .replace(/_([+−-])/gu, '_{$1}')
    .replace(/\b([QVxXhSI])\*(?=$|[(),.;:=<>≈≠≤≥+\-−])/gu, '$1^{*}')
    .replace(/([A-Za-zΑ-Ωα-ωℓ])∞/gu, '$1_{∞}');
}

function isFileOrPath(value: string) {
  return /^(?:https?:|resources[/\\]|[/\\]Users[/\\])/i.test(value)
    || /\.(?:pdf|json|[cm]?[jt]sx?|m|png|jpe?g|svg|csv)$/i.test(value)
    || (/^[A-Za-z0-9]+(?:_[A-Za-z0-9]+)+$/.test(value) && value.split('_').some((part) => part.length > 2));
}

const SPELLED_GREEK: Record<string, string> = { alpha: '\\alpha', beta: '\\beta', delta: '\\delta', gamma: '\\gamma', lambda: '\\lambda', mu: '\\mu', omega: '\\omega', phi: '\\phi', pi: '\\pi', rho: '\\rho', sigma: '\\sigma', tau: '\\tau', theta: '\\theta' };

function formatSubscript(part: string) {
  if (part in SPELLED_GREEK) return SPELLED_GREEK[part];
  return part.length >= 3 || /^[A-Z]{2}$/.test(part) || ROMAN_SUBSCRIPT.has(part.toLowerCase()) || /^(?:Ca|Cl|Na)$/.test(part) ? `\\mathrm{${part}}` : part;
}

function formatAsciiIdentifier(identifier: string) {
  const parts = identifier.split('_');
  let base = parts.shift()!;
  let accent: string | undefined;
  const suffixedAccent = base.match(/^([A-Za-z])(dot|hat|bar|tilde)$/);
  if (suffixedAccent) {
    base = suffixedAccent[1];
    accent = suffixedAccent[2];
  } else if (/^(dot|hat|bar|tilde)$/.test(parts[0] ?? '')) {
    accent = parts.shift();
  }

  const lower = base.toLowerCase();
  if (base in SPELLED_GREEK) base = SPELLED_GREEK[base];
  else if (['cos', 'det', 'exp', 'ln', 'log', 'max', 'min', 'sin', 'tan'].includes(lower)) base = `\\${lower}`;
  else if (SAFE_NAMED_IDENTIFIER.has(lower)) base = `\\operatorname{${base}}`;
  else {
    const indexedProductSource = base.match(/^(?:[A-Z]\d+){2,}$/)?.[0];
    const indexedProduct = indexedProductSource?.match(/[A-Z]\d+/g);
    const numberedProduct = base.match(/^([A-Za-z])(\d+)([A-Za-z])(\d+)$/);
    const indexedDerivative = base.match(/^d([A-Za-z])(\d+|[ijk])$/);
    const compactIndices = base.match(/^([A-Za-z])([ijk]{1,2})$/);
    const teacherWeight = base.match(/^w([ST])$/);
    const domainSubscript = base.match(/^([gEI])((?:Ca|Na|K|L|e))$/);
    const embeddedFunction = base.match(/^([A-Za-z])(cos|exp|ln|log|max|min|sin|tan)$/i);
    const prefixedFunction = base.match(/^(ln|log|exp|sin|cos|tan)([A-Za-z])$/i);
    const wrappedFunction = base.match(/^([A-Za-z])(ln|log|exp|sin|cos|tan)([A-Za-z])$/i);
    const suffix = base.match(/^([A-Za-z])(crit|current|eff|eq|ext|half|inf|int|ion|leak|max|mean|mem|min|next|out|post|pre|pref|reset|rest|rev|ss|syn|th)$/);
    if (indexedProduct) {
      base = indexedProduct.map((item) => `${item[0]}_{${item.slice(1)}}`).join('');
    } else if (numberedProduct) {
      base = `${numberedProduct[1]}_{${numberedProduct[2]}}${numberedProduct[3]}_{${numberedProduct[4]}}`;
    } else if (indexedDerivative) {
      base = `d${indexedDerivative[1]}_{${indexedDerivative[2]}}`;
    } else if (/^maxQnext$/i.test(base)) {
      base = '\\max Q_{\\mathrm{next}}';
    } else if (/^Qnext$/i.test(base)) {
      base = 'Q_{\\mathrm{next}}';
    } else if (teacherWeight) {
      base = `w_{\\mathrm{${teacherWeight[1]}}}`;
    } else if (domainSubscript) {
      base = `${domainSubscript[1]}_{${formatSubscript(domainSubscript[2])}}`;
    } else if (prefixedFunction) {
      base = `\\${prefixedFunction[1].toLowerCase()} ${prefixedFunction[2]}`;
    } else if (wrappedFunction) {
      base = `${wrappedFunction[1]}\\${wrappedFunction[2].toLowerCase()} ${wrappedFunction[3]}`;
    } else if (embeddedFunction) {
      base = `${embeddedFunction[1]}\\${embeddedFunction[2].toLowerCase()}`;
    } else if (compactIndices) {
      base = compactIndices[1];
      parts.unshift(compactIndices[2]);
    } else if (suffix) {
      base = suffix[1];
      parts.unshift(suffix[2]);
    } else if (/^[A-Za-z]\d+$/.test(base)) {
      const match = base.match(/^([A-Za-z])(\d+)$/)!;
      if (parts.length) {
        base = match[1];
        parts.unshift(match[2]);
      } else {
        base = `${match[1]}_{${match[2]}}`;
      }
    } else if (UNIT_IDENTIFIER.has(lower) || ROMAN_IDENTIFIER.has(lower) || /^(?:Ca|Cl|Na)$/.test(base)) {
      base = `\\mathrm{${base}}`;
    }
  }

  if (accent) base = `${accent === 'tilde' ? '\\widetilde' : `\\${accent}`}{${base}}`;
  if (parts.length) base += `_{${parts.map(formatSubscript).join(',')}}`;
  return base;
}

function normalizeIdentifiers(value: string) {
  let output = '';
  let cursor = 0;
  while (cursor < value.length) {
    if (value[cursor] === '{' && ['^', '_'].includes(value[cursor - 1] ?? '')) {
      let depth = 1;
      let end = cursor + 1;
      while (end < value.length && depth > 0) {
        if (value[end] === '{') depth += 1;
        else if (value[end] === '}') depth -= 1;
        end += 1;
      }
      if (depth === 0) {
        output += value.slice(cursor, end);
        cursor = end;
        continue;
      }
    }
    if (value[cursor] === '\\') {
      const command = value.slice(cursor).match(/^\\[A-Za-z]+/)?.[0];
      if (command) {
        const argumentStart = cursor + command.length;
        if (['\\mathbb', '\\mathrm', '\\operatorname'].includes(command) && value[argumentStart] === '{') {
          const argumentEnd = value.indexOf('}', argumentStart + 1);
          if (argumentEnd !== -1) {
            output += value.slice(cursor, argumentEnd + 1);
            cursor = argumentEnd + 1;
            continue;
          }
        }
        output += command;
        cursor += command.length;
        continue;
      }
    }
    if (value[cursor - 1] === '^' && /[A-Za-z]/.test(value[cursor])) {
      output += value[cursor] === 'T' ? '\\mathrm{T}' : value[cursor];
      cursor += 1;
      continue;
    }
    const identifier = value.slice(cursor).match(/^[A-Za-z][A-Za-z0-9]*(?:_(?:[a-z0-9]+|[A-Z][A-Za-z]*))*/)?.[0];
    if (identifier) {
      const followingCharacter = value[cursor + identifier.length] ?? '';
      if (/^[A-Za-z]\d+$/.test(identifier) && GREEK.test(followingCharacter)) output += identifier;
      else output += identifier === 'R' && value[cursor - 1] === '∈' ? '\\mathbb{R}' : formatAsciiIdentifier(identifier);
      cursor += identifier.length;
      continue;
    }
    output += value[cursor];
    cursor += 1;
  }
  return output;
}

export function normalizeScientificLatex(value: string) {
  const normalized = prepareScientificNotation(value)
    .replace(/([Α-Ωα-ωϑϕϵ])_\{([^}]+)\}/gu, (_match, symbol: string, subscript: string) => `${symbol}_{${subscript.split('_').map(formatSubscript).join(',')}}`)
    .replace(/([Α-Ωα-ωϑϕϵ])_([a-z][a-z0-9]*(?:_[a-z0-9]+)*|[A-Z0-9])/gu, (_match, symbol: string, subscript: string) => `${symbol}_{${subscript.split('_').map(formatSubscript).join(',')}}`)
    .replace(/([Α-Ωα-ωϑϕϵ])(dot|hat|bar|tilde)(?=_|[^A-Za-z0-9]|$)/gu, (_match, symbol: string, accent: string) => `${accent === 'tilde' ? '\\widetilde' : `\\${accent}`}{${symbol}}`)
    .replace(/([Α-Ωα-ωϑϕϵ])(crit|eff|eq|ext|half|hat|inf|in|int|ion|leak|max|mean|mem|min|out|post|pre|pref|reset|rest|rev|ss|syn|th)(?![A-Za-z0-9_])/gu, '$1_{\\mathrm{$2}}')
    .replace(/([A-Za-zΑ-Ωα-ωℓ])̂/gu, '\\hat{$1}')
    .replace(/([A-Za-zΑ-Ωα-ωℓ])̇/gu, '\\dot{$1}')
    .replace(/([A-Za-zΑ-Ωα-ωℓ])̄/gu, '\\bar{$1}')
    .replace(/([A-Za-zΑ-Ωα-ωℓ])̃/gu, '\\widetilde{$1}')
    .replace(/([A-Za-zΑ-Ωα-ωℓ])́/gu, '\\acute{$1}')
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁱⁿᵃᵇᶜᵈᵉᶠᵍʰʲᵏˡᵐᵒᵖʳˢᵗᵘᵛʷˣʸᶻᵀ]+/gu, (script) => {
      const characters = [...script];
      const latex = characters.map((character, index) => {
        const previous = SUPERSCRIPT_MAP[characters[index - 1] ?? ''];
        const next = SUPERSCRIPT_MAP[characters[index + 1] ?? ''];
        return character === 'ˣ' && /^\d$/.test(previous ?? '') && /^\d$/.test(next ?? '') ? '\\times ' : SUPERSCRIPT_MAP[character];
      }).join('');
      return `^{${latex}}`;
    })
    .replace(/[₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₒₓₕₖₗₘₙₚₛₜᵢⱼᵣᵤᵥᵦᵧᵨᵩᵪ]+/gu, (script) => `_{${[...script].map((character) => SUBSCRIPT_MAP[character]).join('')}}`)
    .replace(/e[−‑]([A-Za-zΑ-Ωα-ωϑϕϵ0-9]+(?:\/[A-Za-zΑ-Ωα-ωϑϕϵ0-9]+)?)/gu, (match: string, exponent: string, offset: number, source: string) => {
      if (source[offset - 1] === '_') return match;
      const precedingIdentifier = source.slice(0, offset).match(/[A-Za-z]+$/)?.[0] ?? '';
      return precedingIdentifier.length > 1 ? match : `e^{-${exponent}}`;
    })
    .replace(/\.\.\./g, '\\cdots ');

  return normalizeIdentifiers(normalized)
    .replace(/\\mathrm\{(Ca|Mg|Na|K|Cl)\}\^\{(\d+)\}\+/g, '\\mathrm{$1}^{$2+}')
    .replace(/(\d(?:\.\d+)?)\s+([sVmAFS])(?=(?:\^\{|[_^+\-*/=<>≈≠≤≥),.;]|$))/g, '$1 \\mathrm{$2}')
    .replace(/([A-Za-z0-9)\]}])\\([A-Za-z])(?=$|[_^+\-*/=<>≈≠≤≥),.;:])/g, '$1\\backslash $2')
    .replace(/[−‑–]/g, '-')
    .replace(/′/g, "'")
    .replace(/″/g, "''")
    .replace(/[·×∗→←↔⇒↑↓∞≈≠≤≥≪≫±∓≡∑∫√∈∝∼∂∇⊙∥⊥⋯∆ĨŷŝŵℓℝℤℕℚℂΑ-Ωα-ωϑϕϵ]/gu, (symbol) => SYMBOL_LATEX[symbol] ?? symbol)
    .replace(/(?<!\\)\b(ln|log|exp|sin|cos|tan|max|min)(?=[|(\[])/g, '\\$1');
}

export function isLikelyInlineMath(value: string) {
  if (!value || !hasBalancedDelimiters(value) || isFileOrPath(value) || /^[A-Za-z]+(?:-[A-Za-z]+)+$/.test(value)) return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value) || /^(?:E|Na|A)\/(?:I|K|B)$/.test(value)) return false;
  if (GREEK.test(value) || UNICODE_SCRIPT.test(value) || COMBINING_MARK.test(value)) return true;
  if (RELATION_OR_LARGE_OPERATOR.test(value) || /\\[A-Za-z]+/.test(value)) return true;
  if (/(?:[A-Za-z0-9Α-Ωα-ωℓ)\]}])(?:[_^](?:[{(]|[A-Za-z0-9Α-Ωα-ωℓ]))/.test(value)) return true;
  if (/^[{[].*[,;].*[}\]]$/.test(value)) return true;
  if (/^(?:sin|cos|tan|ln|log|exp|max|min|argmax|argmin|diag|tr|cov|var|rank|sgn|poisson)(?:\([^)]*\)|\|[^|]+\|)$/i.test(value)) return true;
  if (/^[A-Za-z](?:_[A-Za-z0-9]+)?\([^)]*\)(?:ᵀ)?$/.test(value)) return true;
  if (/^d[A-Za-z0-9]{0,2}\/d[A-Za-z0-9]{1,2}$/i.test(value)) return true;
  return false;
}

type ImplicitTokenKind = 'atom' | 'binary' | 'prefix' | 'postfix' | 'open' | 'close' | 'separator';
type ImplicitToken = { end: number; identifier?: string; kind: ImplicitTokenKind; strong?: boolean; unit?: boolean; unsafe?: boolean; value: string };

const OPEN_TO_CLOSE: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
const CLOSE_TO_OPEN: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

function isStrongAsciiIdentifier(identifier: string, followingCharacter: string, precedingCharacter: string) {
  const base = identifier.split('_')[0];
  const lower = identifier.toLowerCase();
  if (PROSE_IDENTIFIER.has(lower) && !identifier.includes('_')) return false;
  const followedByScientificSyntax = /^[([|_^+\-−*/×·∗=<>≈≠≤≥→←↔⇒]$/u.test(followingCharacter);
  const hasScientificNeighbour = followedByScientificSyntax || /^[([|_^+\-−*/×·∗=<>≈≠≤≥→←↔⇒]$/u.test(precedingCharacter);
  return base.length === 1
    || COMPACT_DERIVATIVE.test(base)
    || /^[A-Za-z]\d+$/.test(base)
    || /^[A-Z]{2,4}$/.test(base)
    || /^[A-Z][a-z]$/.test(base) && hasScientificNeighbour
    || /^[A-Z][ijk]{1,2}$/.test(base)
    || /^(?:[A-Z]\d+){2,}$/.test(base)
    || /^[A-Za-z]\d+[A-Za-z]\d+$/.test(base)
    || /^[a-z][A-Z]$/.test(base)
    || /^(?:ln|log|exp|sin|cos|tan)[A-Za-z]$/i.test(base)
    || /^[A-Za-z](?:ln|log|exp|sin|cos|tan)[A-Za-z]$/i.test(base)
    || /^[A-Za-z](?:dot|hat|bar|tilde)$/.test(base) && (/^[A-Z]/.test(base) || hasScientificNeighbour)
    || /^maxQnext$/i.test(base)
    || /^Qnext$/i.test(base)
    || COMPACT_ROMAN_SUFFIX.test(base)
    || /^(?:at|st)$/.test(base) && /^[=|]$/.test(followingCharacter)
    || identifier.includes('_')
    || UNICODE_SCRIPT.test(followingCharacter)
    || COMBINING_MARK.test(followingCharacter)
    || UNIT_IDENTIFIER.has(lower)
    || ROMAN_IDENTIFIER.has(lower) && followedByScientificSyntax
    || SAFE_NAMED_IDENTIFIER.has(lower) && followedByScientificSyntax
    || base in SPELLED_GREEK
    || base.length <= 2 && hasScientificNeighbour;
}

function isDerivativeStart(value: string, token: ImplicitToken) {
  const identifier = token.identifier ?? '';
  if (COMPACT_DERIVATIVE.test(identifier) && value[token.end] === '/') return true;
  if (identifier !== 'd' || !GREEK.test(value[token.end] ?? '')) return false;
  let cursor = token.end + 1;
  if (value[cursor] === '_') {
    cursor += 1;
    if (value[cursor] === '{') {
      const closing = value.indexOf('}', cursor + 1);
      if (closing === -1) return false;
      cursor = closing + 1;
    } else cursor += 1;
  }
  if (/^[+\-−]$/u.test(value[cursor] ?? '')) cursor += 1;
  return value[cursor] === '/';
}

function isNamedFunctionIdentifier(identifier: string | undefined) {
  if (!identifier) return false;
  const lower = identifier.toLowerCase();
  return SAFE_NAMED_IDENTIFIER.has(lower)
    || COMPACT_FUNCTION.test(identifier)
    || /^(?:ln|log|exp|sin|cos|tan)[A-Za-z]$/i.test(identifier);
}

function hasSpacedFunctionOperand(value: string, token: ImplicitToken) {
  if (!isNamedFunctionIdentifier(token.identifier) || !/\s/u.test(value[token.end] ?? '')) return false;
  let cursor = token.end;
  while (/\s/u.test(value[cursor] ?? '')) cursor += 1;
  const operand = readImplicitToken(value, cursor);
  return Boolean(operand && (operand.kind === 'prefix' || operand.kind === 'open' || operand.kind === 'atom' && operand.strong));
}

function readImplicitToken(value: string, start: number): ImplicitToken | null {
  const rest = value.slice(start);
  const number = rest.match(/^\d+(?:\.\d+)?(?:e[+\-]?\d+)?/i)?.[0];
  if (number) return { end: start + number.length, kind: 'atom', strong: true, value: number };

  const command = rest.match(/^\\[A-Za-z]+/)?.[0];
  if (command) {
    const operatorCommands = new Set(['\\cdot', '\\in', '\\le', '\\ge', '\\ne', '\\approx', '\\sim', '\\propto', '\\times', '\\to']);
    const prefixCommands = new Set(['\\partial', '\\nabla', '\\sum', '\\prod', '\\int', '\\sqrt']);
    return { end: start + command.length, kind: operatorCommands.has(command) ? 'binary' : prefixCommands.has(command) ? 'prefix' : 'atom', strong: true, value: command };
  }

  if (/^[ΣΠ]/u.test(rest)) {
    const following = value.slice(start + 1);
    const hasScientificOperand = /^(?:_|\s*(?:[([{\\]|\d|[Α-Ωα-ωϑϕϵ]|[A-Za-z](?![A-Za-z0-9])))/u.test(following);
    return { end: start + 1, identifier: rest[0], kind: hasScientificOperand ? 'prefix' : 'atom', strong: true, value: rest[0] };
  }
  const greek = rest.match(/^[Α-Ωα-ωϑϕϵ]/u)?.[0];
  if (greek) return { end: start + greek.length, identifier: greek, kind: 'atom', strong: true, value: greek };
  if (/^[Ĩŷŝŵℓℝℤℕℚℂ]/u.test(rest)) return { end: start + 1, identifier: rest[0], kind: 'atom', strong: true, value: rest[0] };

  const compactFunction = rest.match(/^(?:ln|log|exp|sin|cos|tan)\d+(?:\.\d+)?/i)?.[0];
  if (compactFunction) return { end: start + compactFunction.length, identifier: compactFunction, kind: 'atom', strong: true, value: compactFunction };

  const identifier = rest.match(/^[A-Za-z][A-Za-z0-9]*(?:_(?:[a-z0-9]+|[A-Z][A-Za-z]*))*/)?.[0];
  if (identifier) {
    const lower = identifier.toLowerCase();
    const followingCharacter = value[start + identifier.length] ?? '';
    let precedingIndex = start - 1;
    while (/\s/u.test(value[precedingIndex] ?? '')) precedingIndex -= 1;
    const precedingCharacter = value[precedingIndex] ?? '';
    return {
      end: start + identifier.length,
      identifier,
      kind: 'atom',
      strong: isStrongAsciiIdentifier(identifier, followingCharacter, precedingCharacter)
        || SAFE_NAMED_IDENTIFIER.has(lower) && /^\s+(?:[0-9Α-Ωα-ωϑϕϵĨŷŝŵℓℝℤℕℚℂ]|[A-Za-z](?![A-Za-z0-9]))/u.test(value.slice(start + identifier.length)),
      unit: UNIT_IDENTIFIER.has(lower) || /^[sVmAFS]$/.test(identifier),
      unsafe: CODE_IDENTIFIER.has(lower),
      value: identifier,
    };
  }

  const unicodeScript = rest.match(/^[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁱⁿᵃᵇᶜᵈᵉᶠᵍʰʲᵏˡᵐᵒᵖʳˢᵗᵘᵛʷˣʸᶻ₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₒₓₕₖₗₘₙₚₛₜᵢⱼᵣᵤᵥᵦᵧᵨᵩᵪᵀ′″]+/u)?.[0];
  if (unicodeScript) return { end: start + unicodeScript.length, kind: 'postfix', strong: true, value: unicodeScript };
  const signedSubscript = rest.match(/^_[+\-−]/u)?.[0];
  if (signedSubscript) return { end: start + signedSubscript.length, kind: 'postfix', strong: true, value: signedSubscript };
  if (COMBINING_MARK.test(rest[0] ?? '')) return { end: start + 1, kind: 'postfix', strong: true, value: rest[0] };
  if (rest.startsWith('...')) return { end: start + 3, kind: 'atom', strong: true, value: '...' };
  if (/^[∞]/u.test(rest)) return { end: start + 1, kind: 'atom', strong: true, value: rest[0] };
  if (/^[∑∫√∂∇]/u.test(rest)) return { end: start + 1, kind: 'prefix', strong: true, value: rest[0] };

  const codeOperator = rest.match(/^(?:<=|>=|==|!=|->)/)?.[0];
  if (codeOperator) return { end: start + codeOperator.length, kind: 'binary', unsafe: true, value: codeOperator };
  if (rest.startsWith('||')) return { end: start + 2, kind: 'binary', value: '||' };

  const character = rest[0];
  if (character in OPEN_TO_CLOSE) return { end: start + 1, kind: 'open', value: character };
  if (character in CLOSE_TO_OPEN) return { end: start + 1, kind: 'close', value: character };
  if (character === ',' || character === ';') return { end: start + 1, kind: 'separator', value: character };
  if (character === '′' || character === '″' || character === "'") return { end: start + 1, kind: 'postfix', value: character };
  if (/^[+\-−‑–*/×·∗=<>≈≠≤≥→←↔⇒↑↓±∓∈∝∼≪≫⊙∥⊥≡|^_]$/u.test(character)) {
    return { end: start + 1, kind: /^[∑∫√∂∇]$/u.test(character) ? 'prefix' : 'binary', value: character };
  }
  return null;
}

function canBridgeWhitespace(value: string, tokens: ImplicitToken[], next: ImplicitToken) {
  const previous = tokens.at(-1);
  if (!previous) return false;
  if (previous.kind === 'prefix' && next.kind === 'atom' && !next.strong && !next.unit) return false;
  if (next.kind === 'open' && next.value === '(') {
    const closing = value.indexOf(')', next.end);
    const contents = closing === -1 ? '' : value.slice(next.end, closing).trim();
    if (/^[A-Za-z][A-Za-z -]{2,}$/.test(contents)) return false;
  }
  if (previous.kind === 'binary'
    || previous.kind === 'prefix'
    || previous.kind === 'open'
    || previous.kind === 'separator'
    || next.kind === 'binary'
    || next.kind === 'close'
    || next.kind === 'separator'
    || next.kind === 'open') return true;
  if (previous.kind === 'atom' && previous.strong && next.kind === 'atom' && next.unit) return true;
  const previousOperand = previous.kind === 'postfix' ? tokens.at(-2) : previous;
  if (
    previousOperand?.kind === 'atom'
    && /^[A-Z]$/.test(previousOperand.identifier ?? '')
    && next.kind === 'atom'
    && next.strong
    && /^[A-Z]$/.test(next.identifier ?? '')
  ) return true;
  if (previous.kind === 'atom' && previous.strong && next.kind === 'atom' && isDerivativeStart(value, next)) return true;
  if (
    previous.kind === 'atom' && previous.strong && next.kind === 'atom'
    && (hasSpacedFunctionOperand(value, next)
      || isNamedFunctionIdentifier(next.identifier) && /^[([|]$/u.test(value[next.end] ?? ''))
  ) return true;
  if (previous.kind === 'atom' && hasSpacedFunctionOperand(value, previous) && next.kind === 'atom' && next.strong) return true;
  if (previous.kind === 'atom' && next.kind === 'atom' && next.strong && ['^', '_'].includes(tokens.at(-2)?.value ?? '')) return true;
  if (previous.kind === 'atom' && next.identifier && /^(?:dot|hat|bar|tilde)$/.test(next.identifier) && value[next.end] === '_') return true;
  if (
    previous.kind === 'atom' && previous.strong && next.kind === 'atom' && next.strong
    && tokens.some((token) => token.kind === 'binary' && /^[=<>≈≠≤≥∈∝∼≡⊥]$/u.test(token.value))
  ) return true;
  if (
    previous.kind === 'atom' && next.kind === 'atom' && next.identifier && value[next.end] === '('
    && tokens.some((token) => token.kind === 'binary' && /^[=<>≈≠≤≥∈∝∼≡⊥→←↔⇒]$/u.test(token.value))
  ) return true;
  return false;
}

function isCompleteCandidate(tokens: ImplicitToken[], stack: string[]) {
  if (!tokens.length || stack.length || tokens.some((token) => token.unsafe)) return false;
  const first = tokens[0];
  const last = tokens.at(-1)!;
  if (first.kind === 'close' || first.kind === 'separator' || last.kind === 'binary' || last.kind === 'prefix' || last.kind === 'open' || last.kind === 'separator') return false;
  if (first.kind === 'binary' && !/^[+\-−‑–]$/u.test(first.value)) return false;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.kind === 'prefix' && tokens[index + 1]?.kind === 'prefix') return false;
    if (token.kind !== 'binary') continue;
    if (token.value === '^' || token.value === '_') {
      const next = tokens[index + 1];
      const signedAtom = next?.kind === 'binary'
        && /^[+\-−]$/u.test(next.value)
        && tokens[index + 2]?.kind === 'atom';
      if (!signedAtom && !['atom', 'open'].includes(next?.kind ?? '')) return false;
    }
    if (/^[=<>≈≠≤≥∈∝≡⊥]$/u.test(token.value)) {
      const hasLeftOperand = tokens.slice(0, index).some((item) => item.kind === 'atom' || item.kind === 'close' || item.kind === 'postfix');
      const hasRightOperand = tokens.slice(index + 1).some((item) => item.kind === 'atom' || item.kind === 'open' || item.kind === 'prefix');
      if (!hasLeftOperand || !hasRightOperand) return false;
    }
  }
  return true;
}

function candidateHasMathSignal(source: string, tokens: ImplicitToken[], hasSafeFunctionCall: boolean) {
  if (tokens.every((token) => token.kind === 'postfix')) return source === 'ᵀ';
  const relations = tokens.filter((token) => token.kind === 'binary' && /^[=<>≈≠≤≥∈∝∼≡⊥]$/u.test(token.value));
  const arrows = tokens.filter((token) => token.kind === 'binary' && /^[→←↔⇒↑↓]$/u.test(token.value));
  if (arrows.length && !relations.length) {
    const arrowIndex = tokens.findIndex((token) => token.kind === 'binary' && /^[→←↔⇒↑↓]$/u.test(token.value));
    return tokens.slice(0, arrowIndex).some((token) => token.strong)
      && tokens.slice(arrowIndex + 1).some((token) => token.strong);
  }
  if (relations.length) {
    const relationIndexes = tokens.flatMap((token, index) => token.kind === 'binary' && /^[=<>≈≠≤≥∈∝∼≡⊥]$/u.test(token.value) ? [index] : []);
    let operandStart = 0;
    for (const relationIndex of relationIndexes) {
      if (!tokens.slice(operandStart, relationIndex).some((token) => token.strong)) return false;
      operandStart = relationIndex + 1;
    }
    return tokens.slice(operandStart).some((token) => token.strong);
  }
  if (hasSafeFunctionCall) return true;
  if (/[±∓]/u.test(source) && tokens.filter((token) => token.kind === 'atom').length >= 2) return true;
  if (/\d\s*[×·∗*]\s*\(?[+\-−]?\d/u.test(source)) return true;
  if (/[A-Za-zΑ-Ωα-ω)\]}]\*/u.test(source)) return true;
  if (/\[[A-Za-zΑ-Ωα-ω]+\](?:in|out)/u.test(source)) return true;
  if (tokens.some((token) => COMPACT_ROMAN_SUFFIX.test(token.identifier ?? '')) && tokens.some((token) => token.kind === 'binary')) return true;
  if (/[∑∫√∂∇∞]/u.test(source)) return true;
  if (GREEK.test(source) || UNICODE_SCRIPT.test(source) || COMBINING_MARK.test(source) || /\\[A-Za-z]+/.test(source)) return true;
  if (/^d[A-Za-z0-9]{0,2}\/(?:tau|theta|lambda|mu|sigma)$/i.test(source.replace(/\s/g, ''))) return true;
  if (tokens.some((token) => token.kind === 'atom' && token.strong) && /(?:[A-Za-z0-9Α-Ωα-ωℓ)\]}])(?:[_^](?:[{(]|[A-Za-z0-9Α-Ωα-ωℓ]))/.test(source)) return true;
  if (/^d[A-Za-z0-9]{0,2}\/d[A-Za-z0-9]{1,2}$/i.test(source.replace(/\s/g, ''))) return true;
  if (/^[{[].*[,;].*[}\]]$/.test(source)) return true;
  return false;
}

function recoverBalancedEnd(value: string, start: number, stack: string[]) {
  const recovery = [...stack];
  for (let cursor = start; cursor < value.length; cursor += 1) {
    const character = value[cursor];
    if (recovery.at(-1) === '||' && value.startsWith('||', cursor)) {
      recovery.pop();
      cursor += 1;
      if (!recovery.length) return cursor + 1;
    } else if (character === '|' || character === '∥') {
      if (recovery.at(-1) === '|') recovery.pop();
      else if (recovery.at(-1) === '∥') recovery.pop();
      else recovery.push(character);
      if (!recovery.length) return cursor + 1;
    } else if (character in OPEN_TO_CLOSE) recovery.push(character);
    else if (character in CLOSE_TO_OPEN && recovery.at(-1) === CLOSE_TO_OPEN[character]) {
      recovery.pop();
      if (!recovery.length) return cursor + 1;
    }
  }
  return start;
}

function readMathCandidate(value: string, start: number) {
  const tokens: ImplicitToken[] = [];
  const stack: string[] = [];
  let cursor = start;
  let hasSafeFunctionCall = false;
  let unsafeFunctionCall = false;

  while (cursor < value.length) {
    if (/\s/u.test(value[cursor])) {
      let nextStart = cursor;
      while (/\s/u.test(value[nextStart] ?? '')) nextStart += 1;
      const next = readImplicitToken(value, nextStart);
      if (!next || !canBridgeWhitespace(value, tokens, next)) break;
      cursor = nextStart;
      continue;
    }

    let token = readImplicitToken(value, cursor);
    if (!token) break;
    if (
      token.kind === 'atom'
      && !token.strong
      && /^(?:in|out)$/.test(token.identifier ?? '')
      && tokens.at(-1)?.kind === 'close'
      && tokens.at(-1)?.value === ']'
      && tokens.at(-1)?.end === cursor
    ) token = { ...token, kind: 'postfix', strong: true };
    if (hasSpacedFunctionOperand(value, token)) hasSafeFunctionCall = true;
    if (isNamedFunctionIdentifier(token.identifier) && COMPACT_FUNCTION.test(token.identifier ?? '')) hasSafeFunctionCall = true;
    if (token.kind === 'atom' && !token.strong && !token.unit && stack.length === 0 && ['close', 'postfix'].includes(tokens.at(-1)?.kind ?? '')) break;
    if (token.kind === 'separator' && stack.length === 0) break;
    if (token.kind === 'binary' && ['|', '||', '∥'].includes(token.value)) {
      const previous = tokens.at(-1);
      const delimiter = token.value;
      const hasClosingBar = value.indexOf(delimiter, token.end) !== -1;
      if (stack.at(-1) === delimiter) {
        token = { ...token, kind: 'close' };
      } else if (hasClosingBar && (delimiter !== '|' || !previous || ['binary', 'open', 'prefix', 'separator'].includes(previous.kind) || /^(?:ln|log)$/i.test(previous.identifier ?? ''))) {
        token = { ...token, kind: 'open' };
      }
    }
    if (token.kind === 'binary' && token.value === '+' && tokens.at(-1)?.kind === 'close' && tokens.at(-1)?.value === ']') {
      let lookahead = token.end;
      while (/\s/u.test(value[lookahead] ?? '')) lookahead += 1;
      const following = readImplicitToken(value, lookahead);
      if (!following || (following.kind === 'binary' && /^[=<>≈≠≤≥∈∝∼≡⊥→←↔⇒]$/u.test(following.value)) || following.kind === 'close') {
        token = { ...token, kind: 'postfix', strong: true };
      }
    }
    if (token.kind === 'binary' && token.value === '*' && ['atom', 'close', 'postfix'].includes(tokens.at(-1)?.kind ?? '')) {
      let lookahead = token.end;
      while (/\s/u.test(value[lookahead] ?? '')) lookahead += 1;
      const following = readImplicitToken(value, lookahead);
      const previousIdentifier = tokens.at(-1)?.identifier ?? '';
      if (
        !following
        || following.kind === 'close'
        || following.kind === 'separator'
        || (following.kind === 'open' && /^[QVSxXhI]$/.test(previousIdentifier))
        || (lookahead > token.end && following.kind === 'atom' && !following.strong && !following.unit && /^[QVSxXhI]$/.test(previousIdentifier))
      ) {
        token = { ...token, kind: 'postfix', strong: true };
      }
    }
    if (token.kind === 'binary' && /^[+\-−‑–±∓]$/u.test(token.value) && GREEK.test(tokens.at(-1)?.identifier ?? '')) {
      let lookahead = token.end;
      while (/\s/u.test(value[lookahead] ?? '')) lookahead += 1;
      const following = readImplicitToken(value, lookahead);
      if (
        !following
        || following.kind === 'binary'
        || following.kind === 'close'
        || following.kind === 'separator'
        || (lookahead > token.end && following.kind === 'atom' && !following.strong && !following.unit)
      ) {
        token = { ...token, kind: 'postfix', strong: true };
      }
    }
    if (
      token.kind === 'binary'
      && /^[+\-−‑–]$/u.test(token.value)
      && tokens.at(-1)?.kind === 'postfix'
      && UNICODE_SCRIPT.test(tokens.at(-1)?.value ?? '')
      && !(/^[\-−‑–]$/u.test(token.value) && /[A-Za-z]/.test(value[token.end] ?? ''))
    ) {
      token = { ...token, kind: 'postfix', strong: true };
    }
    if (token.kind === 'binary' && /^[+\-−‑–*/×·∗→←↔⇒↑↓]$/u.test(token.value)) {
      let nextStart = token.end;
      while (/\s/u.test(value[nextStart] ?? '')) nextStart += 1;
      const next = readImplicitToken(value, nextStart);
      if (next?.kind === 'atom' && !next.strong && !next.unit && (nextStart > token.end || /^[\-−‑–]$/u.test(token.value))) break;
    }
    if (token.kind === 'close') {
      if (['|', '||', '∥'].includes(token.value)) {
        if (stack.at(-1) !== token.value) break;
        stack.pop();
      } else {
        if (stack.at(-1) !== CLOSE_TO_OPEN[token.value]) break;
        stack.pop();
      }
    } else if (token.kind === 'open') {
      const previous = tokens.at(-1);
      if (previous?.kind === 'atom' && previous.identifier) {
        const base = previous.identifier.split('_')[0];
        const safe = isNamedFunctionIdentifier(previous.identifier) || base.length === 1 || /^[a-z][A-Z]$/.test(base) || /^[A-Za-z]\d+$/.test(base);
        if (safe) hasSafeFunctionCall = true;
        else unsafeFunctionCall = true;
      }
      stack.push(token.value);
    }
    tokens.push(token);
    cursor = token.end;
  }

  const source = value.slice(start, cursor).trimEnd();
  const recoveredEnd = stack.length ? recoverBalancedEnd(value, cursor, stack) : cursor;
  return {
    end: Math.max(start + source.length, recoveredEnd),
    source,
    tokens,
    valid: isCompleteCandidate(tokens, stack) && !unsafeFunctionCall && candidateHasMathSignal(source, tokens, hasSafeFunctionCall),
  };
}

function parseImplicitText(value: string) {
  const segments: ScientificTextSegment[] = [];
  let cursor = 0;
  let scan = 0;

  while (scan < value.length) {
    if (/\s/u.test(value[scan])) { scan += 1; continue; }
    const attachedProsePrefix = value.slice(scan).match(/^(?:approximate|current|input|weight)(?=[A-Z0-9])/i)?.[0];
    if (attachedProsePrefix) { scan += attachedProsePrefix.length; continue; }
    const fileName = value.slice(scan).match(/^[A-Za-z0-9][A-Za-z0-9_-]*\.(?:pdf|json|[cm]?[jt]sx?|m|png|jpe?g|svg|csv)\b/i)?.[0];
    if (fileName) { scan += fileName.length; continue; }
    const firstToken = readImplicitToken(value, scan);
    if (!firstToken) { scan += 1; continue; }
    if (firstToken.kind === 'binary' && /^[\-−‑–]$/u.test(firstToken.value) && /[A-Za-z]/.test(value[scan - 1] ?? '')) {
      scan = readImplicitToken(value, firstToken.end)?.end ?? firstToken.end;
      continue;
    }
    if (firstToken.kind === 'binary' && !/^(?:[+\-−‑–|∥]|\|\|)$/u.test(firstToken.value)) { scan = firstToken.end; continue; }
    if (firstToken.kind === 'atom' && !firstToken.strong) {
      scan = firstToken.end;
      continue;
    }

    const candidate = readMathCandidate(value, scan);
    const hyphenatedTail = /^[\-−‑–][A-Za-z]{2,}/u.test(value.slice(candidate.end));
    if (candidate.valid && !hyphenatedTail) {
      append(segments, { kind: 'text', value: value.slice(cursor, scan) });
      append(segments, { kind: 'math', value: candidate.source });
      cursor = candidate.end;
    }
    scan = Math.max(candidate.end, firstToken.end, scan + 1);
  }

  append(segments, { kind: 'text', value: value.slice(cursor) });
  return segments;
}

export function inferScientificText(value: string): ScientificTextSegment[] {
  const segments: ScientificTextSegment[] = [];
  let cursor = 0;
  EXPLICIT_TOKEN.lastIndex = 0;

  for (const match of value.matchAll(EXPLICIT_TOKEN)) {
    for (const segment of parseImplicitText(value.slice(cursor, match.index))) append(segments, segment);
    if (match[1] !== undefined) {
      append(segments, { kind: 'math', value: match[1].trim() });
    } else {
      append(segments, { kind: 'code', value: match[2] });
    }
    cursor = match.index + match[0].length;
  }

  for (const segment of parseImplicitText(value.slice(cursor))) append(segments, segment);
  return segments;
}

// Runtime rendering is deliberately deterministic: only authored \(...\)
// boundaries and backtick code spans are interpreted. The heuristic parser
// above exists solely for migration and build-time linting.
export function parseScientificText(value: string): ScientificTextSegment[] {
  const segments: ScientificTextSegment[] = [];
  let cursor = 0;
  EXPLICIT_TOKEN.lastIndex = 0;

  for (const match of value.matchAll(EXPLICIT_TOKEN)) {
    append(segments, { kind: 'text', value: value.slice(cursor, match.index) });
    if (match[1] !== undefined) append(segments, { kind: 'math', value: match[1].trim() });
    else append(segments, { kind: 'code', value: match[2] });
    cursor = match.index + match[0].length;
  }

  append(segments, { kind: 'text', value: value.slice(cursor) });
  return segments;
}

export function scientificTextPlainText(value: string) {
  return parseScientificText(value).map((segment) => segment.value).join('');
}
