import { Player } from "../../Player/Player";
import { Server } from "Server";
import { AbstractEvent } from "../AbstractEvent";

export class PlayerEvent implements AbstractEvent {
    private server: Server;
    private player: Player;

    ["constructor"](server: Server) {
        this.server = server;
    }
    constructor(server: Server, player: Player) {
        this.server = server;
        this.player = player;
    }

    public handle(): void { }

    public getPlayer(): Player {
        return this.player;
    }

    public getServer(): Server {
        return this.server;
    }
}