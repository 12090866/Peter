# 品牌首頁 - 忽悠 (Huyou)

## Mission
打造一個高質感的和菓子官方品牌首頁，結合流暢的互動體驗與黑金配色，向顧客展示職人精神與和菓子之美。

## Brand
- Product/brand: 忽悠 (Huyou)
- Audience: 喜愛和菓子、追求高質感生活體驗的消費者
- Product surface: 品牌展示與電商主頁

## Style Foundations
- Visual style: Premium, elegant, immersive Wagashi presentation
- Main font style: `font.family.primary=Microsoft YaHei`, `font.family.stack=Microsoft YaHei, Adobe Heiti, Helvetica, sans-serif`, `font.size.base=16px`, `font.weight.base=500`, `font.lineHeight.base=1.5`
- Typography scale: `font.size.xs=12px`, `font.size.sm=14px`, `font.size.md=16px`, `font.size.lg=18px`, `font.size.xl=24px`, `font.size.2xl=36px`, `font.size.3xl=64px`
- Color palette: `color.text.primary=#ffffff`, `color.surface.base=#000000`, `color.text.tertiary=#e6e6e6`, `color.text.inverse=#ccd0d2`, `color.border.strong=#db9a45`
- Spacing scale: `space.1=5px`, `space.2=12px`, `space.3=14px`, `space.4=16px`, `space.5=189px`, `space.6=942.28px`
- Radius/shadow/motion tokens: `radius.xs=12px` | `motion.duration.instant=150ms`, `motion.duration.fast=200ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (19), buttons (3), inputs (2).

- Extraction diagnostics: Audience and product surface inference confidence is low; verify generated brand context.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
