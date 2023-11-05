export default Request;

export interface Request {
    header: {
        requestId: string,
        messagePurpose: string,
        version: number,
        messageType: string
    },
    body: {}
}

export interface CommandRequest extends Request {
    header: {
        requestId: string,
        messagePurpose: "commandRequest",
        version: number,
        messageType: "commandRequest"
    },
    body: {
        origin: {
            type: "player"
        },
        commandLine: string,
        version: number
    }
}

export interface CommmandResponseRequest extends Request {
    header: {
        requestId: string,
        messagePurpose: "subscribe" | "unsubscribe",
        version: number,
        messageType: "commandRequest"
    },
    "body": {
        "eventName": string
    }
}