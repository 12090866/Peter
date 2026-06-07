const SIZE_PATTERN = /\b(G8K|G16K|G25K|A4|A5|16K|32K|B5|B6)\b/i;

export function parseNaturalLanguage(text) {
  if (!text || typeof text !== 'string') return {};

  const source = normalizeText(text);
  const result = {};

  const pageMatch = source.match(/(\d+)\s*(?:頁|p|page|pages)/i);
  if (pageMatch) result.pages = Number(pageMatch[1]);

  const qtyMatch =
    source.match(/(?:印量|數量|印製|印刷|印)\s*(\d+)/) ||
    source.match(/(\d+)\s*(?:本|份|冊|套)/);
  if (qtyMatch) result.quantity = Number(qtyMatch[1]);

  const sizeMatch = source.match(SIZE_PATTERN);
  if (sizeMatch) result.size = sizeMatch[1].toUpperCase();

  if (/道林|高級道林/.test(source)) {
    result.paperType = '高級道林120p';
  } else if (/雪銅|雪銅紙/.test(source)) {
    result.paperType = '雪銅120p';
  } else if (/銅西卡|西卡|250p/i.test(source)) {
    result.paperType = '銅西卡250p';
  }

  if (/單面/.test(source)) result.innerPrintSides = 1;
  if (/雙面/.test(source)) result.innerPrintSides = 2;
  const colorCount = parseColorCount(source);
  if (colorCount) result.innerColorCount = colorCount;

  const noFinishing =
    /無需加工|無加工|不用加工|不要加工|不做加工|免加工|取消加工|無後加工|不用後加工|不要後加工|不做後加工|不要上光|不上光|無上光|無上膜|不上膜/.test(
      source,
    );

  if (noFinishing) {
    result.selectedFinishing = [];
  } else {
    const selectedFinishing = [];
    const hasInnerCoating = /內頁.*(?:亮p|亮膜|上亮|霧p|霧膜|霧面|上霧|水亮|水消)/i.test(source);
    if (/內頁.*(?:亮p|亮膜|上亮)/i.test(source)) selectedFinishing.push('內頁亮P');
    if (/內頁.*(?:霧p|霧膜|霧面|上霧)/i.test(source)) selectedFinishing.push('內頁霧P');
    if (/內頁.*水亮/.test(source)) selectedFinishing.push('內頁水亮');
    if (/內頁.*水消/.test(source)) selectedFinishing.push('內頁水消');
    if (/封面.*(?:亮p|亮膜|上亮)/i.test(source) || (!hasInnerCoating && /(?:亮p|亮膜|上亮)/i.test(source))) selectedFinishing.push('封面亮P');
    if (/封面.*(?:霧p|霧膜|霧面|上霧)/i.test(source) || (!hasInnerCoating && /(?:霧p|霧膜|霧面|上霧)/i.test(source))) selectedFinishing.push('封面霧P');
    if (/封面.*水亮/.test(source) || (!hasInnerCoating && /水亮/.test(source))) selectedFinishing.push('封面水亮');
    if (/封面.*水消/.test(source) || (!hasInnerCoating && /水消/.test(source))) selectedFinishing.push('封面水消');
    if (/局部上光|局部光|局光|局部uv|上光/i.test(source)) selectedFinishing.push('局部光');
    if (/局部(?:上光|光|uv)?.*版費|版費/i.test(source)) selectedFinishing.push('局部光版費');

    if (selectedFinishing.length > 0) {
      result.selectedFinishing = [...new Set(selectedFinishing)];
    }
  }

  if (/騎馬|騎馬釘/.test(source)) result.bindingType = '騎馬釘';
  if (/膠裝|無線膠裝|平裝/.test(source)) result.bindingType = '膠裝';
  if (/線裝|精裝/.test(source)) result.bindingType = '線裝';

  return Object.fromEntries(
    Object.entries(result).filter(([, value]) => value !== undefined && value !== ''),
  );
}

function normalizeText(text) {
  return text
    .trim()
    .replace(/[，,。；;：:、]/g, ' ')
    .replace(/\s+/g, ' ');
}

function parseColorCount(source) {
  const colorWords = [
    ['6', 6],
    ['六', 6],
    ['5', 5],
    ['五', 5],
    ['4', 4],
    ['四', 4],
    ['3', 3],
    ['三', 3],
    ['2', 2],
    ['二', 2],
    ['兩', 2],
    ['1', 1],
    ['一', 1],
  ];

  for (const [word, value] of colorWords) {
    const pattern = new RegExp(`${word}\\s*(?:色|c)`, 'i');
    if (pattern.test(source)) return value;
  }

  if (/黑白|單色/.test(source)) return 1;
  if (/彩色|四色|全彩/.test(source)) return 4;

  return null;
}
