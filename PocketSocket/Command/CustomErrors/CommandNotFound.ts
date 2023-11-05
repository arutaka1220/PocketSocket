export class CommandNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "CommandNotFoundError";
    }
}