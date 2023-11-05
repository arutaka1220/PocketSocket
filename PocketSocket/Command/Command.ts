export class Command {
    public static getCommandName(command: string): string {
        return command.split(" ")[0];
    }
}