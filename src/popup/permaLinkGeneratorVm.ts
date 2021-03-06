import { PermaLinks } from "../permaLinks";
import display from "./userMessageVm";

const Errors = {
  NoTabUrl: "Could not get current tab's URL.",
  NoPermaLink: "Could not get a permalink for the current URL.",
  CopyFail: "Could not copy permalink to the clipboard."
};

type UrlCallback = (url: string) => void;

export class PermaLinkGenerator {
  domRoot: HTMLDivElement;
  domUrl: HTMLElement;
  domPermaLink: HTMLAnchorElement;
  domCopier: HTMLTextAreaElement;
  currentUrl: string;
  urlCallbacks: UrlCallback[] = [];

  public initialize = () => {
    this.domRoot = document.getElementById(
      "permaLinkGenerator"
    ) as HTMLDivElement;
    this.domUrl = document.getElementById("currentUrl");
    this.domPermaLink = document.getElementById(
      "permaLink"
    ) as HTMLAnchorElement;
    this.domCopier = document.getElementById("copier") as HTMLTextAreaElement;

    const ok = !!(
      this.domRoot &&
      this.domUrl &&
      this.domPermaLink &&
      this.domCopier
    );

    return ok;
  };

  public generateUrl = (urlRetrievedCb: UrlCallback = null) => {
    if (urlRetrievedCb) {
      this.urlCallbacks.push(urlRetrievedCb);
    }
    this.getCurentTab(this.processUrl);
  };

  private getCurentTab = cb => {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, tabs => {
      if (!(tabs && tabs.length > 0)) {
        display.error(
          Errors.NoTabUrl,
          "No active tab was returned from Chrome."
        );
      }
      cb(tabs[0].url);
    });
  };

  private processUrl = async (currentUrl: string) => {
    if (!currentUrl) {
      display.error(
        Errors.NoTabUrl,
        "URL returned from Chrome was empty/null."
      );
      return;
    }
    this.currentUrl = currentUrl;
    this.urlCallbacks.forEach(cb => cb(currentUrl));
    this.urlCallbacks = [];
    this.domUrl.innerText = currentUrl;
    let permaLink = "";
    try {
      permaLink = await PermaLinks.getPermaLink(currentUrl);
      if (!permaLink) {
        display.error(Errors.NoPermaLink);
        return;
      }
    } catch (ex) {
      display.error(Errors.NoPermaLink, null, ex);
      return;
    }

    this.domPermaLink.innerHTML = permaLink;
    this.domPermaLink.href = permaLink;

    try {
      if (this.copyToClipboard(permaLink)) {
        display.success("Permalink successfully copied to clipboard.");
      } else {
        throw "Couldn't copy it.";
      }
    } catch (ex) {
      display.error(Errors.CopyFail, null, ex);
    }
  };

  public hide = () => {
    this.domRoot.style.display = "none";
  };

  public show = () => {
    this.domRoot.style.display = "block";
  };

  // #region Utilities
  private copyToClipboard = (contents: string) => {
    this.domCopier.value = contents;
    this.domCopier.select();

    if (!document.execCommand("copy")) {
      return false;
    }

    this.domCopier.value = "";
    return true;
  };

  // #endregion
}
