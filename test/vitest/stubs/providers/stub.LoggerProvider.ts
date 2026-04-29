import LoggerProvider, { LogSeverity } from "../../../../src/providers/ror2/logging/LoggerProvider";

export default class StubLoggerProvider extends LoggerProvider {
    public override Log(severity: LogSeverity, error: string): void {
        throw new Error("Method not implemented.");
    }
    override Write(): void {
        throw new Error("Method not implemented.");
    }
}
