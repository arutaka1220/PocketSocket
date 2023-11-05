export class InvalidConnectionError extends Error {
    constructor(message) {
        super(message);

        this.name = "InvalidConnectionError";
    }
}