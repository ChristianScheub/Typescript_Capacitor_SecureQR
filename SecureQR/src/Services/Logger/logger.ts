import {
    featureFlag_Debug_AllLogs,
    featureFlag_Debug_Log_Error,
    featureFlag_Debug_Log_Info,
    featureFlag_Debug_Log_Warning,
    featureFlag_Debug_Log_infoRedux
  } from "../../config/featureFlags";
  
  class Logger {
    private static getCallerFunctionName(): string {
      const stack = new Error().stack;
  
      if (stack) {
        const stackLines = stack.split("\n");
  
        for (let i = 2; i < stackLines.length; i++) {
          const line = stackLines[i].trim();
          if (!line.includes("Logger.")) {
            const match = /at (\S+)/.exec(line);
            if (match?.[1]) {
              return match[1];
            }
          }
        }
      }
      return "Unknown Function";
    }
  
    static log(message: string): void {
      const functionName = this.getCallerFunctionName();
      console.log(`[${functionName}] ${message}`);
    }
  
    static infoRedux(message: string): void {
      if (featureFlag_Debug_Log_infoRedux || featureFlag_Debug_AllLogs) {
          this.log(`Redux Log: ${message}`);
      }
    }
  
    static info(message: string): void {
      if (featureFlag_Debug_Log_Info || featureFlag_Debug_AllLogs) {
          this.log(`INFO: ${message}`);
      }
    }
  
    static warn(message: string): void {
      if (featureFlag_Debug_Log_Warning || featureFlag_Debug_AllLogs) {
          this.log(`WARN: ${message}`);
      }
    }
  
    static error(message: string): void {
      if (featureFlag_Debug_Log_Error || featureFlag_Debug_AllLogs) {
        this.log(`ERROR: ${message}`);
      }
    }
  }
  
  export default Logger;