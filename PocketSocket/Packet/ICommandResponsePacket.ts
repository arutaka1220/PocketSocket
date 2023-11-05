import { IPacket } from "./IPacket";

export interface ICommandResponsePacket<T = {}> extends IPacket {
    header: {
        messagePurpose: "commandResponse",
        requestId: string,
        version: number,
    },
    body: T & {
        statusCode: number,
        statusMessage: string
    }
}