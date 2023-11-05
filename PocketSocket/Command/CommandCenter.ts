import { IPacket } from "../Packet/IPacket";
import { Server } from "../Server";
import { PSUtils } from "../Utils/PSUtils";
import { AwaitingCommand } from "./AwaitingCommand";
import { AwaitingCommandCallback } from "./AwaitingCommandCallback";
import { Command } from "./Command";
import { CommandNotFoundError } from "./CustomErrors/CommandNotFound";

export class CommandCenter {
    private server: Server;
    private commands: Map<string, AwaitingCommand>;

    constructor(server: Server) {
        this.server = server;
        this.commands = new Map();
    }

    public runCommand(command: string, callback: AwaitingCommandCallback): void
    public runCommand(command: string, callback: AwaitingCommandCallback, reason?: string): void {
        const request = PSUtils.createCommandRequest(command);

        this.server.sendPacket(request);

        const awaitingCommand = new AwaitingCommand(Date.now(), command, callback, reason || PSUtils.NULL);

        this.commands.set(request.header.requestId, awaitingCommand);
    }

    public canHandle(requestId: string): boolean {
        return this.commands.has(requestId);
    }

    public handleCommand(requestId: string, response: IPacket): void {
        const awaitingCommand = this.commands.get(requestId);

        if (!awaitingCommand) {
            throw new CommandNotFoundError(`${requestId} というIDのコマンドは見つかりませんでした。`);
        }

        this.commands.delete(requestId);

        awaitingCommand.runCallback(response);

        this.server.getLogger().debug(`${PSUtils.getFormatedDate(awaitingCommand.getRunDateEpoch())} にリクエストされた ${Command.getCommandName(awaitingCommand.getCommand())} が正常に実行されました。`);
    }
}