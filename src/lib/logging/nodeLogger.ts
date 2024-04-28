import * as log4js from "log4js";

export class NodeLogger {
  private static instance: NodeLogger;
  private log4js: log4js.Logger;

  private constructor() {
    const today = new Date();
    const dateFormated = today.toISOString().split("T")[0]; // yyyy-mm-dd
    // appenders are where the logs are stored - stdout, file, through network traffic anywhere else, etc
    // see https://log4js-node.github.io/log4js-node/appenders.html, b
    const fileName = `logs/${dateFormated}.log`;

    log4js.configure({
      appenders: {
        // "app" is just the name of the appender.
        // it is possible to have multiple appenders, e.g. one that sends through stdout and another for file logging
        app: { type: "file", filename: fileName },
      },
      categories: { default: { appenders: ["app"], level: "error" } },
    });

    this.log4js = log4js.getLogger("app");
    this.log4js.level = "debug";
  }

  public static getInstance(): log4js.Logger {
    if (!NodeLogger.instance) {
      NodeLogger.instance = new NodeLogger();
    }

    return NodeLogger.instance.log4js;
  }
}
