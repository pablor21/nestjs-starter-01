import { IExecutor, Logger } from "@/lib";
import { SequelizeExecutor } from "@/lib/datasources/vendors/sequelize/database/sequelize.executor";
import { Injectable } from "@nestjs/common";
import { Command } from "nestjs-command";
import { Sequelize } from "sequelize";
import { EventEmitter } from "events";

@Injectable({})
export class ExecutorCommand {
    public logger = Logger.getLogger("db:migrator");
    private prompt = new EventEmitter();
    private current: string;
    private promise: Promise<any>;
    constructor(public readonly sequelize: Sequelize) {
    }

    init(executor: IExecutor) {
        this.promise = new Promise((resolve, reject) => {
            process.stdin.resume();
            this.prompt.on(':new', (data) => {
                if (data) {
                    console.table(data);
                    process.stdout.write('\n');
                }
                process.stdout.write('> ');
            });

            this.prompt.on(':end', () => {
                console.log('\n');
                process.stdin.pause();
            });
            process.stdin.on('data', async (data) => {
                const text = data.toString().trim();
                let result = null;
                if (text === 'exit') {
                    this.current = ':end'
                } else if (text != '') {
                    try {
                        result = await executor.execute(text);
                        if (!result) {
                            console.log('OK');
                        }
                    } catch (ex) {
                        console.error(ex);
                    }
                    this.current = ':new';
                }

                this.prompt.emit(this.current, result);
            });
        })
    }

    async getExecutorInstance(): Promise<IExecutor> {
        return new SequelizeExecutor(this.sequelize);
    }

    @Command({
        command: 'db:shell',
        describe: 'Open a shell to send commands to the database',
        autoExit: true // defaults to `true`, but you can use `false` if you need more control
    })
    async execute(): Promise<void> {
        console.log(`Welcome to the [${this.sequelize.getDatabaseName()}] shell`)
        const executor = (await this.getExecutorInstance());
        this.init(executor);
        this.prompt.emit(':new');
        return this.promise;
    }
}
