import { AwaitingCommandCallback } from "./AwaitingCommandCallback";

export class AwaitingCommand {
    private runDateEpoch: number;
    private command: string;
    private callback: AwaitingCommandCallback;
    private reason: string;

    constructor(runDateEpoch: number, command: string, callback: AwaitingCommandCallback, reason: string) {
        this.runDateEpoch = runDateEpoch;
        this.command = command;
        this.callback = callback;
        this.reason = reason;
    }

    public getRunDateEpoch(): number {
        return this.runDateEpoch;
    }

    public getCommand(): string {
        return this.command;
    }

    public getReason(): string {
        return this.reason;
    }

    public runCallback(response: any): any {
        return this.callback(response);
    }
}