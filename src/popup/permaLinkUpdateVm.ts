import { PermaLinks } from "../permaLinks";
import display from "./userMessageVm";

export class PermaLinkUpdater {
  domUpdateToggle: HTMLAnchorElement;
  domRoot: HTMLDivElement;
  domOldUrl: HTMLInputElement;
  domNewUrl: HTMLInputElement;
  domUpdate: HTMLButtonElement;
  domCancel: HTMLAnchorElement;

  originalToggleHtml: string;

  public initialize = (): boolean => {
    let ok = false;

    try {
      this.domUpdateToggle = document.getElementById(
        "togglePermaLinkUpdater"
      ) as HTMLAnchorElement;
      this.domRoot = document.getElementById(
        "permaLinkUpdater"
      ) as HTMLDivElement;
      this.domOldUrl = document.getElementById("oldUrl") as HTMLInputElement;
      this.domNewUrl = document.getElementById("newUrl") as HTMLInputElement;
      this.domUpdate = document.getElementById(
        "updatePermaLink"
      ) as HTMLButtonElement;
      this.domCancel = document.getElementById(
        "cancelUpdate"
      ) as HTMLAnchorElement;

      ok = !!(
        this.domUpdateToggle &&
        this.domRoot &&
        this.domOldUrl &&
        this.domNewUrl &&
        this.domUpdate &&
        this.domCancel
      );

      if (ok) {
        this.originalToggleHtml = this.domUpdateToggle.innerHTML;
        this.domUpdateToggle.addEventListener("click", this.toggleForm);
        this.domUpdate.addEventListener("click", this.updateUrl);
        this.domCancel.addEventListener("click", this.toggleForm);
        this.domNewUrl.addEventListener("keyup", this.keyUp);
      }
    } catch (ex) {
      ok = false;
      console.error("Problem initialing permalink update view model.", ex);
    }

    return ok;
  };

  public set currentUrl(value: string) {
    this.domOldUrl.value = value;
  }

  public toggleForm = (evt: MouseEvent = null) => {
    const showing = this.domRoot.style.display === "block";
    this.domRoot.style.display = showing ? "none" : "block";
    this.domUpdateToggle.style.display = !showing ? "none" : "block";

    if (showing) {
      this.domNewUrl.focus();
      this.domNewUrl.select();
    }
    if (evt) {
      evt.preventDefault();
    }
  };

  private keyUp = evt => {
    if (evt.key === "Enter") {
      this.updateUrl();
    }
  };

  private updateUrl = async () => {
    try {
      const oldUrl = this.domOldUrl.value.trim();
      const newUrl = this.domNewUrl.value.trim();

      if (!oldUrl || !newUrl) {
        display.error("Both old and new URLs are required to do an update.");
      }

      const message = await PermaLinks.updatePermaLink(oldUrl, newUrl);

      // This is a total hack..
      // I don't know why, yet, but until I call update a second time, it seems to cache the old URL for the permalink
      await PermaLinks.updatePermaLink(oldUrl, newUrl);

      display.success(message);

      this.toggleForm();
    } catch (ex) {
      display.error(`Could not update the URL due to server error.`, null, ex);
    }
  };

  public hide = () => {
    this.domRoot.style.display = "none";
    this.domUpdateToggle.style.display = "none";
  };

  public show = () => {
    this.domUpdateToggle.style.display = "block";
  };
}
