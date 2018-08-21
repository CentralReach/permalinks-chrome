import settings from "../appSettings";
import display from "./userMessageVm";

type AuthUpdatedHandler = (success: boolean) => void;

export class Auth {
  domRoot: HTMLDivElement;
  domApiKey: HTMLInputElement;
  domSave: HTMLButtonElement;

  authUpdatedCb: AuthUpdatedHandler;

  apiKey: string;

  public initialize = (authUpdatedCb: AuthUpdatedHandler = null) => {
    this.domRoot = document.getElementById("authForm") as HTMLDivElement;
    this.domApiKey = document.getElementById("apiKey") as HTMLInputElement;
    this.domSave = document.getElementById("saveApiKey") as HTMLButtonElement;
    this.authUpdatedCb = authUpdatedCb;

    let ok = !!(this.domRoot && this.domApiKey && this.domSave);

    try {
      this.domSave.addEventListener("click", this.saveApiKey);
    } catch (ex) {
      console.error("Problem initializing auth form.", ex);
      ok = false;
    }

    return ok;
  };

  public checkAuth = async (): Promise<boolean> => {
    this.apiKey = await this.getApiKey();
    settings.apiKey = this.apiKey;
    return !!this.apiKey;
  };

  private saveApiKey = async (evt: MouseEvent) => {
    const apiKey = this.domApiKey.value.trim();
    if (!apiKey) {
      display.error("You need to supply an API key.");
      return;
    }

    try {
      await this.setApiKey(apiKey);
      this.apiKey = apiKey;
      settings.apiKey = apiKey;
      if (typeof this.authUpdatedCb === "function") {
        this.authUpdatedCb(true);
      }
    } catch (ex) {
      this.apiKey = "";
      settings.apiKey = "";
      console.error("Problem setting API Key.", ex);
      this.authUpdatedCb(false);
    }
  };

  public getApiKey = async (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      chrome.storage.sync.get(["apiKey"], result => {
        console.log("ApiKey currently is " + result.apiKey);
        resolve(result.apiKey);
      });
    });
  };

  public setApiKey = (key: string) => {
    chrome.storage.sync.set({ apiKey: key }, function() {
      console.log("API Key set to " + key);
    });
  };

  public hide = () => {
    this.domRoot.style.display = "none";
  };

  public show = () => {
    this.domRoot.style.display = "block";
  };
}
