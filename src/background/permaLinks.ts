import { Api } from "../api";

const Paths = {
  PermaLinks: "permalinks"
};

const copyToClipboard = async (contents: string) => {
  const response = await chrome.runtime.sendMessage({
    method: "setClipboard",
    value: contents
  });
  console.log("extension setClipboard response", response);
};

export class PermaLinks {
  public static async getPermaLink(url: string) {
    const api = new Api();
    const requestBody = {
      url
    };

    const response = (await api.post(Paths.PermaLinks, url)) as any;
    const permaLink = response && response.permaLink;
    if (!permaLink) {
      // TODO: notify problem
    }
    await copyToClipboard(permaLink);
    return permaLink;
  }
}
