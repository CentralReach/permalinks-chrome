import { PermaLinks } from "./permaLinks";

chrome.browserAction.onClicked.addListener(async tab => {
  const currentUrl = tab.url;
  if (!currentUrl) {
    // TODO: some error messaging
    return;
  }
  const permaLink = await PermaLinks.getPermaLink(currentUrl);

  console.log(`Got new permaLink: ${permaLink}`);
});
