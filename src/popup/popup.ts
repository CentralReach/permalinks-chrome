// import "chrome-extension-async";
import { Popup } from "./popupVm";

document.addEventListener("DOMContentLoaded", () => {
  const popup = new Popup();
  popup.show();
});
