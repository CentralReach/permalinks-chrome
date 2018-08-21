export enum TraceLevel {
  Info = 1,
  Warning = 2,
  Error = 3,
  None = 100
}

class AppSettings {
  /**
   *
   * @param apiRoot - API root URL.
   * @param traceLevel - Trace level for errors.
   */
  constructor(
    public readonly apiRoot: string,
    public readonly traceLevel: TraceLevel
  ) {}

  /** API Key to use with API requests. */
  public apiKey: string;
}

const appSettings = new AppSettings(
  "https://6wctztyaxc.execute-api.us-east-1.amazonaws.com/dev",
  TraceLevel.Info
);

export default appSettings;
