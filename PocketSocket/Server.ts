import { WebSocket } from "ws";
import { enable } from "colors";
import { Player } from "Player/Player";
import { Logger } from "Console/Logger";
import { IncomingMessage } from "http";
import { EventManager } from "Events/EventManager";
import { ViolationReason } from "./Utils/ViolationReason";
import { PSUtils } from "./Utils/PSUtils";
import { NotConnectedMinecraftError } from "./Utils/CustomErrors/NotConnectedMinecraftError";
import { CommandCenter } from "./Command/CommandCenter";
import { IPacket } from "./Packet/IPacket";
import { AwaitingCommandCallback } from "./Command/AwaitingCommandCallback";

import Request from "./Utils/Requests";
import { ICommandResponsePacket } from "./Packet/ICommandResponsePacket";
import { CommandConsole } from "./Console/CommandConsole";
import RawPacketIdList from "./Events/RawPacketIdList";

// Enable colors
enable();

export class Server extends WebSocket.Server {
    private logger: Logger
    private eventManager: EventManager;
    private command: CommandCenter;
    private reader: CommandConsole;

    // 接続のデータ
    private connectedSocket: WebSocket | null;
    private connectedSocketRequestData: IncomingMessage | null;

    // ゲームのデータ
    private players: Player[];
    private onlinePlayers: number;
    private localPlayerName: string | null;

    constructor(port: number, debugMode: boolean = false) {
        super({
            "port": port
        });

        this.logger = new Logger(debugMode, process.stdout);
        this.eventManager = new EventManager();
        this.command = new CommandCenter(this);
        this.reader = new CommandConsole(this, process.stdout, process.stdin);

        this.players = [];
        this.onlinePlayers = 0;

        this.logger.info(`PocketSocketが起動しました。`);
        this.logger.info(`ポート ${port} で待機中です。`);

        if (debugMode) this.logger.info(`デバッグモードが有効になっています。`.green);

        this.on("connection", (socket, request) => {
            this.handleConnection(socket, request);
        });
    }

    public getLogger(): Logger {
        return this.logger;
    }

    public getLocalPlayerName(): string {
        return this.localPlayerName || "Unknown";
    }

    public runCommand(command: string, callback: AwaitingCommandCallback): void {
        this.command.runCommand(command, callback);
    }

    public sendPacket(packet: Request): void {
        if (!this.connectionCheck()) {
            throw new NotConnectedMinecraftError();
        }

        const encodedPacket = PSUtils.createPacket(packet);

        this.connectedSocket.send(encodedPacket);

        this.logger.debug(`${JSON.stringify(packet, null, 2)} \nを送信しました。`);
    }

    public requestEvent(eventName: string): void {
        const request = PSUtils.createEventRequest(eventName);

        this.sendPacket(request);

        this.logger.debug(`${PSUtils.getIPFromRequest(this.connectedSocketRequestData)} に イベント ${eventName.cyan} をリクエストしました。`);
    }

    private handleConnection(socket: WebSocket, request: IncomingMessage): void {
        const violation = this.violationCheck();

        switch (violation) {
            case ViolationReason.UNKNOWN_VIOLATION:
            case ViolationReason.INVALID_CONNECTION_DATA: {
                this.logger.warn([
                    `${PSUtils.getIPFromRequest(request)} からの接続が行われましたが、PocketSocketに問題があるため、接続を拒否しました。理由: ${ViolationReason[violation]}`,
                    `再起動をすることで治る可能性があります。`.cyan
                ]);

                socket.close();
            } break;
        }

        this.connectedSocket = socket;
        this.connectedSocketRequestData = request;

        this.logger.info(`${PSUtils.getIPFromRequest(request)} が接続しました。`);

        this.runCommand("getlocalplayername", (data: ICommandResponsePacket<{ localplayername: string }>) => {
            this.localPlayerName = data.body.localplayername;
        });

        for (const id of RawPacketIdList) {
            this.requestEvent(id);
        }

        socket.on("message", (data, isBinary) => {
            const decodedPacket = PSUtils.decodePacket(data.toString());

            this.handlePacket(decodedPacket, isBinary);
        });

        this.reader.resume();
    }

    private handlePacket(data: IPacket, isBinary: boolean): void {
        const { body, header } = data;

        if (this.command.canHandle(header.requestId)) {
            this.command.handleCommand(header.requestId, data);

            return;
        }

        this.logger.warn(`${JSON.stringify(data)}`);
    }

    private violationCheck(): ViolationReason {
        if (this.connectedSocket === null && this.connectedSocketRequestData !== null) {
            return ViolationReason.INVALID_CONNECTION_DATA;
        }

        if (this.connectedSocket !== null && this.connectedSocketRequestData === null) {
            return ViolationReason.INVALID_CONNECTION_DATA;
        }

        return ViolationReason.OK;
    }

    private connectionCheck(): boolean {
        const violation = this.violationCheck();

        switch (violation) {
            case ViolationReason.UNKNOWN_VIOLATION:
            case ViolationReason.INVALID_CONNECTION_DATA: {
                try { this.connectedSocket.close(); } catch { }
                try { this.connectedSocketRequestData.destroy(); } catch { }
                this.connectedSocket = null;
                this.connectedSocketRequestData = null;

                this.logger.error(`異常な接続状態が確認されたため、接続を切断し、接続状態をリセットしました。`);
                return false;
            }
        }

        if (this.connectedSocket === null || this.connectedSocketRequestData === null) {
            return false;
        }

        return true;
    }
}