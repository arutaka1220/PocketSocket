import { IncomingMessage } from "http";
import { uuid } from "uuidv4";
import * as Requests from "./Requests";
import { Protocol } from "../Protocol";
import { IPacket } from "../Packet/IPacket";
import moment from "moment";

export const PSUtils = {
    "NULL": "NULL",

    getIPFromRequest(request: IncomingMessage): string {
        return request.socket.remoteAddress ?? "Unknown";
    },

    getFormatedDate(epoch: number, format: string = "YYYY/MM/DD HH:mm:ss"): string {
        return moment(epoch).format(format);
    },

    createUUID(): string {
        return uuid();
    },

    createRequest(requestType: string): Requests.Request {
        return {
            "header": {
                "requestId": PSUtils.createUUID(),
                "messagePurpose": requestType,
                "version": Protocol.HEADER_VERSION,
                "messageType": requestType
            },
            "body": {}
        }
    },

    createCommandRequest(command: string): Requests.CommandRequest {
        return {
            "header": {
                "requestId": PSUtils.createUUID(),
                "messagePurpose": "commandRequest",
                "version": Protocol.HEADER_VERSION,
                "messageType": "commandRequest"
            },
            "body": {
                "origin": {
                    "type": "player"
                },
                "commandLine": command,
                "version": Protocol.COMMAND_VERSION
            }
        }
    },

    createEventRequest(eventName: string): Requests.CommmandResponseRequest {
        return {
            "header": {
                "requestId": PSUtils.createUUID(),
                "messagePurpose": "subscribe",
                "version": Protocol.HEADER_VERSION,
                "messageType": "commandRequest"
            },
            "body": {
                "eventName": eventName
            }
        }
    },

    createPacket(request: Requests.Request): string {
        return JSON.stringify(request);
    },

    decodePacket(data: string): IPacket {
        return JSON.parse(data);
    },
}