import { Server } from "../../Server";
import { AbstractEvent } from "../AbstractEvent";

export class ServerEvent implements AbstractEvent {
    private server: Server;

    ["constructor"](server: Server) {
        this.server = server;
    }
    constructor(server: Server) {
        this.server = server;
    }

    public handle(): void { }

    public getServer(): Server {
        return this.server;
    }
}