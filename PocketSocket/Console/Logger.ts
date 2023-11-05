export class Logger {
    public static NEW_LINE = "\n";

    private debugMode: boolean;
    private stdout: NodeJS.WriteStream;

    constructor(debugMode: boolean, stdout: NodeJS.WriteStream) {
        this.debugMode = debugMode;
        this.stdout = stdout;
    }

    public debug(message: string | string[]) {
        if (!this.debugMode) return;

        this.stdout.write(`${Logger.makeTimestampStyle()} ${(message instanceof Array ? message.join("\n") : message).green}` + Logger.NEW_LINE);
    }

    public info(message: string | string[]) {
        this.stdout.write(`${Logger.makeTimestampStyle()} ${(message instanceof Array ? message.join("\n") : message).white}` + Logger.NEW_LINE);
    }

    public warn(message: string | string[]) {
        this.stdout.write(`${Logger.makeTimestampStyle()} ${(message instanceof Array ? message.join("\n") : message).yellow}` + Logger.NEW_LINE);
    }

    public error(message: string | string[]) {
        this.stdout.write(`${Logger.makeTimestampStyle()} ${(message instanceof Array ? message.join("\n") : message).red}` + Logger.NEW_LINE);
    }

    private static makeTimestampStyle(): string {
        return "[".cyan + new Date().toLocaleTimeString().yellow + "]".cyan;
    }
}