import settings, { TraceLevel } from "./appSettings";

export class Api {
  public async get<TBody, TReturn>(
    path: string,
    body?: TBody
  ): Promise<TReturn> {
    return await this.execute("GET", path, body as any);
  }

  public async post<TBody, TReturn>(
    path: string,
    body?: TBody
  ): Promise<TReturn> {
    return await this.execute("POST", path, body as any);
  }

  public async put<TBody, TReturn>(
    path: string,
    body?: TBody
  ): Promise<TReturn> {
    return await this.execute("PUT", path, body as any);
  }

  // #region Internals
  private async execute(
    method: string,
    path: string,
    body?: string | object
  ): Promise<any> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    if (settings.apiKey) {
      headers.append("x-api-key", settings.apiKey);
    }
    let response = null;

    try {
      response = await fetch(this.url(path), {
        headers: headers,
        method: method,
        body: !body
          ? null
          : typeof body === "string"
            ? body
            : JSON.stringify(body)
      });
      const responseBody = await response.json();
      if (!response.ok) {
        if (settings.traceLevel <= TraceLevel.Error) {
          console.error(
            `Problem processing request. Status: ${response.status} - ${
              response.statusText
            }`,
            responseBody
          );
        }
      } else if (settings.traceLevel <= TraceLevel.Info) {
        console.log(
          `Request Status: ${response.status} - ${response.statusText}`,
          responseBody
        );
      }
      return responseBody;
    } catch (ex) {
      let message = "Unexpected error fetching API response.";
      if (!response) {
        message += " Couldn't get a response from API. Is it running?";
      }
      console.error(message, ex);
    }
  }

  private url(path: string): string {
    return settings.apiRoot + (path.startsWith("/") ? "" : "/") + path;
  }
  // #endregion
}
