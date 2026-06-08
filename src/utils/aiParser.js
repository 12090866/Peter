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

  const coverPaperType = parseScopedPaperType(source, '封面');
  const innerPaperType = parseScopedPaperType(source, '內頁') || parseScopedPaperType(source, '內文');
  const generalPaperType = parsePaperType(source);
  if (coverPaperType) result.coverPaperType = coverPaperType;
  if (innerPaperType) {
    result.paperType = innerPaperType;
  } else if (generalPaperType && !coverPaperType) {
    result.paperType = generalPaperType;
  }

  if (/單面/.test(source)) result.innerPrintSides = 1;
  if (/雙面/.test(source)) result.innerPrintSides = 2;
  if (/封面.{0,12}單面/.test(source)) result.coverPrintSides = 1;
  if (/封面.{0,12}雙面/.test(source)) result.coverPrintSides = 2;
  const coverColorCount = parseScopedColorCount(source, '封面');
  const innerColorCount =
    parseScopedColorCount(source, '內頁') || parseScopedColorCount(source, '內文');
  if (coverColorCount) result.coverColorCount = coverColorCount;
  if (innerColorCount) result.innerColorCount = innerColorCount;
  const colorCount = parseColorCount(source);
  if (colorCount && !coverColorCount && !innerColorCount) {
    result.innerColorCount = colorCount;
  }

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

export function parseBoxNaturalLanguage(text) {
  if (!text || typeof text !== 'string') return {};

  const source = normalizeText(text);
  const result = {};

  const quantityMatch =
    source.match(/(?:數量|訂購|印量|印製)\s*(\d+)/) ||
    source.match(/(\d+)\s*(?:個|只|pcs|PCS)/);
  if (quantityMatch) result.quantity = Number(quantityMatch[1]);

  const sheetSizeMatch =
    source.match(/(?:紙張|紙|用紙)(?:尺寸)?\s*(\d+)\s*(?:x|X|×|\*)\s*(\d+)/) ||
    source.match(/(\d+)\s*(?:x|X|×|\*)\s*(\d+)\s*(?:mm)?\s*(?:紙張|紙|用紙)/);
  if (sheetSizeMatch) {
    result.sheetLength = Number(sheetSizeMatch[1]);
    result.sheetWidth = Number(sheetSizeMatch[2]);
  }

  const modelSizeMatch =
    source.match(/(?:單模|盒型|模型|刀模)(?:尺寸)?\s*(\d+)\s*(?:x|X|×|\*)\s*(\d+)/) ||
    source.match(/(\d+)\s*(?:x|X|×|\*)\s*(\d+)\s*(?:mm)?\s*(?:單模|盒型|模型|刀模)/);
  if (modelSizeMatch) {
    result.modelLength = Number(modelSizeMatch[1]);
    result.modelWidth = Number(modelSizeMatch[2]);
  }

  const impositionMatch = source.match(/(?:拼|排|一張)\s*(\d+)\s*模/);
  if (impositionMatch) result.impositionCount = Number(impositionMatch[1]);

  const colorCount = parseColorCount(source);
  if (colorCount) result.colorCount = colorCount;

  const printingUnitMatch = source.match(/印刷(?:單價)?\s*(\d+(?:\.\d+)?)/);
  if (printingUnitMatch) result.printingUnitPrice = Number(printingUnitMatch[1]);

  const coatingUnitMatch = source.match(/上光(?:單價)?\s*(\d+(?:\.\d+)?)/);
  if (coatingUnitMatch) result.coatingUnitPrice = Number(coatingUnitMatch[1]);

  const corrugatedPaperUnitMatch = source.match(/(?:浪紙|黃[BEF]?浪)(?:單價)?\s*(\d+(?:\.\d+)?)/i);
  if (corrugatedPaperUnitMatch) {
    result.corrugatedPaperUnitPrice = Number(corrugatedPaperUnitMatch[1]);
  }

  const mountingUnitMatch = source.match(/裱浪(?:加工)?(?:單價)?\s*(\d+(?:\.\d+)?)/);
  if (mountingUnitMatch) result.mountingUnitPrice = Number(mountingUnitMatch[1]);

  const dieCutUnitMatch = source.match(/軋型(?:單價)?\s*(\d+(?:\.\d+)?)/);
  if (dieCutUnitMatch) result.dieCutUnitPrice = Number(dieCutUnitMatch[1]);

  const gluingUnitMatch = source.match(/糊盒(?:單價)?\s*(\d+(?:\.\d+)?)/);
  if (gluingUnitMatch) result.gluingUnitPrice = Number(gluingUnitMatch[1]);

  if (/不要軋型|無軋型|免軋型|不軋型|不用軋型/.test(source)) {
    result.dieCutEnabled = false;
  } else if (/軋型/.test(source)) {
    result.dieCutEnabled = true;
  }

  if (/不要糊盒|無糊盒|免糊盒|不糊盒|不用糊盒/.test(source)) {
    result.gluingEnabled = false;
  } else if (/糊盒/.test(source)) {
    result.gluingEnabled = true;
  }

  if (/無上光|不上光|不要上光|不用上光|免上光/.test(source)) {
    result.selectedCoatings = [];
  } else {
    const selectedCoatings = [];
    if (/亮p|亮P|亮膜/.test(source)) selectedCoatings.push('glossP');
    if (/霧p|霧P|霧膜|霧面/.test(source)) selectedCoatings.push('matteP');
    if (/水光|水亮/.test(source)) selectedCoatings.push('waterGloss');
    if (/水消/.test(source)) selectedCoatings.push('waterMatte');
    if (selectedCoatings.length > 0) {
      result.selectedCoatings = [...new Set(selectedCoatings)];
    }
  }

  if (/無裱浪|不裱浪|不要裱浪|不用裱浪|免裱浪/.test(source)) {
    result.selectedCorrugated = [];
  } else {
    const selectedCorrugated = [];
    if (/\bB\s*浪|B浪/i.test(source)) selectedCorrugated.push('b');
    if (/\bE\s*浪|E浪|黃E浪/i.test(source)) selectedCorrugated.push('e');
    if (/\bF\s*浪|F浪/i.test(source)) selectedCorrugated.push('f');
    if (selectedCorrugated.length > 0) {
      result.selectedCorrugated = [...new Set(selectedCorrugated)];
    }
  }

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

function parsePaperType(source) {
  if (/道林|高級道林/.test(source)) return '高級道林120p';
  if (/雪銅|雪銅紙/.test(source)) return '雪銅120p';
  if (/銅西卡|西卡|250p/i.test(source)) return '銅西卡250p';
  return null;
}

function parseScopedPaperType(source, scope) {
  return parsePaperType(getScopedSegment(source, scope, 24));
}

function parseScopedColorCount(source, scope) {
  return parseColorCount(getScopedSegment(source, scope, 24));
}

function getScopedSegment(source, scope, maxLength) {
  const start = source.indexOf(scope);
  if (start === -1) return '';

  const rest = source.slice(start, start + scope.length + maxLength);
  const boundaryPattern = scope === '封面' ? /(內頁|內文)/ : /封面/;
  const boundary = rest.slice(scope.length).search(boundaryPattern);

  return boundary === -1
    ? rest
    : rest.slice(0, scope.length + boundary);
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
