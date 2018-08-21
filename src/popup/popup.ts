import { PermaLinkUpdater } from "./permaLinkUpdateVm";
import { PermaLinkGenerator } from "./permaLinkGeneratorVm";
import display from "./userMessageVm";

class Popup {
  generator: PermaLinkGenerator;
  updater: PermaLinkUpdater;

  constructor() {
    this.generator = new PermaLinkGenerator();
    this.updater = new PermaLinkUpdater();
    const updateFormOk = this.updater.initialize();
    const generatorOk = this.generator.initialize();

    if (!generatorOk || !updateFormOk) {
      document.write(
        "Could not initialize the plugin. Contact extension developers."
      );
    }
  }

  public show = () => {
    this.generator.generateUrl(this.gotUrl);
  };

  private gotUrl = url => {
    this.updater.currentUrl = url;
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const popup = new Popup();
  popup.show();
});
