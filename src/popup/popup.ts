// import "chrome-extension-async";
import { PermaLinks } from "../permaLinks";

const Errors = {
  NoTabUrl: "Could not get current tab's URL.",
  NoPermaLink: "Could not get a permalink for the current URL.",
  CopyFail: "Could not copy permalink to the clipboard."
};

const MessageClasses = {
  Error: "error",
  Success: "success"
};

class Popup {
  domUrl: HTMLElement;
  domPermaLink: HTMLElement;
  domUserMessage: HTMLElement;

  constructor() {
    this.domUrl = document.getElementById("currentUrl");
    this.domPermaLink = document.getElementById("permaLink");
    this.domUserMessage = document.getElementById("userMessage");
    if (!this.domUrl || !this.domPermaLink || !this.domUserMessage) {
      document.write("You are missing key HTML elements. Fix it, bruh.");
    }
  }

  public show = () => {
    this.getCurentTab(this.processUrl);
  };

  private getCurentTab = cb => {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, tabs => {
      if (!(tabs && tabs.length > 0)) {
        this.error(Errors.NoTabUrl, "No active tab was returned from Chrome.");
      }
      cb(tabs[0].url);
    });
  };

  private processUrl = async (currentUrl: string) => {
    if (!currentUrl) {
      this.error(Errors.NoTabUrl, "URL returned from Chrome was empty/null.");
      return;
    }
    this.domUrl.innerText = currentUrl;
    let permaLink = "";
    try {
      permaLink = await PermaLinks.getPermaLink(currentUrl);
      if (!permaLink) {
        this.error(Errors.NoPermaLink);
        return;
      }
    } catch (ex) {
      this.error(Errors.NoPermaLink, null, ex);
      return;
    }

    this.domPermaLink.innerText = permaLink;

    try {
      await this.copyToClipboard(permaLink);
      this.success("Permalink successfully copied to clipboard.");
    } catch (ex) {
      this.error(Errors.CopyFail, null, ex);
    }
  };

  // #region Utilities
  private copyToClipboard = async (contents: string) => {
    const response = await chrome.runtime.sendMessage({
      method: "setClipboard",
      value: contents
    });
    console.log("extension setClipboard response", response);
  };

  private error = (
    userMessage: string,
    logMessage: string = null,
    ex: any = null
  ) => {
    this.domUserMessage.className = MessageClasses.Error;
    this.domUserMessage.innerHTML = userMessage;
    if (logMessage || ex) {
      console.error(logMessage, ex);
    }
  };

  private success = (userMessage: string) => {
    this.domUserMessage.className = MessageClasses.Success;
    this.domUserMessage.innerHTML = userMessage;
  };
  // #endregion
}

document.addEventListener("DOMContentLoaded", () => {
  const popup = new Popup();
  popup.show();
});
