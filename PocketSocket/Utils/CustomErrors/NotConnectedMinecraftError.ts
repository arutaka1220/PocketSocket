export class NotConnectedMinecraftError extends Error {
    constructor() {
        super();

        this.name = "NotConnectedMinecraftError";
        this.message = "Minecraftに接続されていません。";
    }
}