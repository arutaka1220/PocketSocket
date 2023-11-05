import * as readline from 'readline';
import { Server } from '../Server';

export class CommandConsole extends readline.Interface {
    private server: Server;

    constructor(server: Server, stdout: NodeJS.WritableStream, stdin: NodeJS.ReadableStream) {
        super({
            "input": stdin,
            "output": stdout
        });

        this.server = server;

        this.setPrompt("> ");

        this.on("line", (line: string) => {
            this.server.runCommand(line, (packet) => {
                this.server.getLogger().info(`${packet.body.statusMessage}`);
            });
        });

        this.on("close", (line: string) => {
            this.server.getLogger().info(`PocketSocketを終了します。`);
            process.exit(0);
        });

        this.pause();
    }
}