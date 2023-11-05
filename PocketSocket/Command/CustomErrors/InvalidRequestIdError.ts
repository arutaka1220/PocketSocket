export class InvalidRequestIdError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidRequestIdError";
    }
}