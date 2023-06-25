import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { ExportedData } from "../deps.ts";
import { replaceIconName } from "../replace.ts";

Deno.test("ページ中のtest.iconをhoge.iconに置換する", async () => {
  const filePath = "./sample.json";
  const file = await Deno.readTextFile(new URL(filePath, import.meta.url));
  const jsonData = JSON.parse(file) as ExportedData<true>;

  const expectedfilePath = "./sample-replaced.json";
  const expectedfile = await Deno.readTextFile(
    new URL(expectedfilePath, import.meta.url),
  );
  const expectedjsonData = JSON.parse(expectedfile) as ExportedData<true>;

  const replacedPages = replaceIconName(
    jsonData.pages,
    "test.icon",
    "hoge.icon",
  );

  assertEquals(
    JSON.stringify(replacedPages),
    JSON.stringify(expectedjsonData.pages),
  );
});
