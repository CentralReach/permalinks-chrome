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
}

const appSettings = new AppSettings(
  "http://api.centralreach.test",
  TraceLevel.Info
);

export default appSettings;
