import { EventEmitter } from "events";
import { Player } from "../Player/Player";
import { PlayerJoinEvent } from "./Player/PlayerJoinEvent";

interface IEventManager extends EventEmitter {
    on(event: "playerJoin", listener: (eventData: PlayerJoinEvent) => void): this;
    on(event: string, listener: Function): this;
}

class EventManager extends EventEmitter implements IEventManager { }

export { EventManager };