import { Api } from "./api";
import settings from "./appSettings";

const Paths = {
  PermaLinks: "permalinks"
};

export class PermaLinks {
  public static async getPermaLink(url: string) {
    const api = new Api();
    const requestBody = {
      url
    };

    const response = (await api.post(Paths.PermaLinks, requestBody)) as any;
    const permaLinkKey = response && response.permaLinkKey;
    return `${settings.apiRoot}/${permaLinkKey}`;
  }

  public static async updatePermaLink(oldUrl: string, newUrl: string) {
    const api = new Api();
    const requestBody = {
      oldUrl,
      newUrl
    };

    const response = (await api.put(Paths.PermaLinks, requestBody)) as any;
    const message = response && response.message;
    return message;
  }
}
