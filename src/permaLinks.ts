import { Api } from "./api";

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
    const permaLink = response && response.permaLink;
    return permaLink;
  }
}
