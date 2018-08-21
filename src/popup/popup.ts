import { Auth } from "./authVm";
import { PermaLinkUpdater } from "./permaLinkUpdateVm";
import { PermaLinkGenerator } from "./permaLinkGeneratorVm";
import display from "./userMessageVm";

class Popup {
  domInit: HTMLDivElement;
  generator: PermaLinkGenerator;
  updater: PermaLinkUpdater;
  auth: Auth;

  constructor() {
    this.domInit = document.getElementById("initializing") as HTMLDivElement;
    this.generator = new PermaLinkGenerator();
    this.updater = new PermaLinkUpdater();
    this.auth = new Auth();
    const updateFormOk = this.updater.initialize();
    const generatorOk = this.generator.initialize();
    const authOk = this.auth.initialize(this.apiKeyUpdated);

    if (!generatorOk || !updateFormOk || !authOk || !this.domInit) {
      document.write(
        "Could not initialize the plugin. Contact extension developers."
      );
    }
  }

  public show = () => {
    this.verifyAuth();
  };

  private verifyAuth = async () => {
    const haveKey = await this.auth.checkAuth();
    this.domInit.style.display = "none";
    if (!haveKey) {
      this.updater.hide();
      this.generator.hide();
      this.auth.show();
    } else {
      this.auth.hide();
      this.generator.show();
      this.generator.generateUrl(this.gotUrl);
      this.updater.show();
    }
  };

  private apiKeyUpdated = success => {
    this.verifyAuth();
  };

  private gotUrl = url => {
    this.updater.currentUrl = url;
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const popup = new Popup();
  popup.show();
});
