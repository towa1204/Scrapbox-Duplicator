import {
  assertString,
  exportPages,
  getProfile,
  GuestUser,
  importPages,
  MemberUser,
} from "./deps.ts";
import { replaceIconName } from "./replace.ts";

const fromSID = Deno.env.get("SOURCE_PROJECT_SID");
const toSID = Deno.env.get("DESTINATION_PROJECT_SID");
const exportProjectName = Deno.env.get("SOURCE_PROJECT_NAME");
const importProjectName = Deno.env.get("DESTINATION_PROJECT_NAME");
const shouldDuplicateByDefault =
  Deno.env.get("SHOULD_DUPLICATE_BY_DEFAULT") === "True";

assertString(fromSID);
assertString(toSID);
assertString(exportProjectName);
assertString(importProjectName);

console.log(`Exporting a json file from "/${exportProjectName}"...`);
const exportResult = await exportPages(exportProjectName, {
  sid: fromSID,
  metadata: true,
});
if (!exportResult.ok) {
  const error = new Error();
  error.name = `${exportResult.value.name} when exporting a json file`;
  error.message = exportResult.value.message;
  throw error;
}
const { pages } = exportResult.value;
console.log(`Export ${pages.length}pages:`);
for (const page of pages) {
  console.log(`\t${page.title}`);
}

const importingPages = pages.filter(({ lines }) => {
  if (lines.some((line) => line.text.includes("[private.icon]"))) {
    return false;
  } else if (lines.some((line) => line.text.includes("[public.icon]"))) {
    return true;
  } else {
    return shouldDuplicateByDefault;
  }
});
if (importingPages.length === 0) {
  console.log("No page to be imported found.");
  Deno.exit();
}

// ページに含まれるアイコンを置換する
const isMemberUser = (user: MemberUser | GuestUser): user is MemberUser => {
  return "config" in user;
};
const fromUserProfile = await getProfile({ sid: fromSID });
if (!isMemberUser(fromUserProfile)) {
  throw new Error();
}
const toUserProfile = await getProfile({ sid: toSID });
if (!isMemberUser(toUserProfile)) {
  throw new Error();
}
const replacedPages = replaceIconName(
  importingPages,
  `${fromUserProfile.name}.icon`,
  `${toUserProfile.name}.icon`,
);

console.log(
  `Importing ${importingPages.length} pages to "/${importProjectName}"...`,
);
const importResult = await importPages(importProjectName, {
  pages: replacedPages,
}, {
  sid: toSID,
});
if (!importResult.ok) {
  const error = new Error();
  error.name = `${importResult.value.name} when importing pages`;
  error.message = importResult.value.message;
  throw error;
}
console.log(importResult.value);
