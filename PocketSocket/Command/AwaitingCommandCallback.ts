import { ICommandResponsePacket } from "../Packet/ICommandResponsePacket";

export type AwaitingCommandCallback = (response: ICommandResponsePacket) => any;