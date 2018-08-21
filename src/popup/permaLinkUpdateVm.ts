import { PermaLinks } from "../permaLinks";
import display from "./userMessageVm";

export class PermaLinkUpdater {
  domUpdateToggle: HTMLAnchorElement;
  domUpdateForm: HTMLDivElement;
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
      this.domUpdateForm = document.getElementById(
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
        this.domUpdateForm &&
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

  public toggleForm = evt => {
    const showing = this.domUpdateForm.style.display === "block";
    this.domUpdateForm.style.display = showing ? "none" : "block";
    this.domUpdateToggle.style.display = !showing ? "none" : "block";

    if (showing) {
      this.domNewUrl.focus();
      this.domNewUrl.select();
    }
    if (evt) {
      evt.preventDefault();
    }
  };

  private keyUp = evt => {};

  private updateUrl = async () => {
    try {
      const oldUrl = this.domOldUrl.value.trim();
      const newUrl = this.domNewUrl.value.trim();

      if (!oldUrl || !newUrl) {
        display.error("Both old and new URLs are required to do an update.");
      }

      const message = await PermaLinks.updatePermaLink(oldUrl, newUrl);

      display.success(message);
    } catch (ex) {
      display.error(`Could not update the URL due to server error.`, null, ex);
    }
  };
}
