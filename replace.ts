import { ExportedPage } from "./deps.ts";

/**
 * ページに含まれるアイコンを置換する
 * @param pages Scrapboxの各ページデータ
 * @param fromIconName 置換前のアイコン e.g. "from.icon"
 * @param toIconName 置換後のアイコン e.g. "to.icon"
 * @returns
 */
export const replaceIconName = (
  pages: ExportedPage<true>[],
  fromIconName: string,
  toIconName: string,
): ExportedPage<true>[] => {
  return pages.map((page) => {
    const replacedLines = page.lines.map((line) => {
      return {
        ...line,
        text: line.text.replaceAll(fromIconName, toIconName),
      };
    });
    return { ...page, lines: replacedLines };
  });
};
