import { Server } from "../Server";

export interface AbstractEvent {
    constructor(server: Server);

    handle(...any): void;

    getServer(): Server;
}