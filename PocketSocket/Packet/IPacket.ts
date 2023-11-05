export interface IPacket {
    header: {
        requestId: string,
        version: number,
    },
    body: {
    }
}