# Structured self-study guides

These JSON files are authored course content. They supplement the page-level source concordance with a stable teaching sequence:

1. concrete learning objectives;
2. a prerequisite bridge;
3. diagnostic questions with remediation links;
4. source-grounded learning modules;
5. line-by-line derivations or formal reasoning chains;
6. complete worked examples;
7. fixed self-checks and misconception notes.

`npm run content` merges each guide into the generated lecture JSON. `npm run validate` rejects missing source-page coverage, short explanatory prose, incomplete examples, invalid KaTeX, generic boilerplate, and duplicated paragraphs.
