import { log, warn } from "../utils.ts";

export enum TaskStatus {
    OK = "OK",
    SKIPPED = "SKIPPED",
    FAILED = "FAILED",
}

export abstract class Task {
    abstract get name(): string;
    abstract suitableForEnvironment(): boolean | Promise<boolean>;
    abstract execute(): Promise<TaskStatus>;
}

export class TaskManager {
    private tasks: Task[] = [];

    registerTask(task: Task): void {
        this.tasks.push(task);
    }
    removeTask(task: Task): void {
        this.tasks = this.tasks.filter((t) => t !== task);
    }

    buildPromise(): Promise<void> {
        function onSuccess(task: Task): void {
            log(mw.msg("mw-dhscript-tasks-complete", task.name));
        }
        function onFailure(task: Task, error: Error): void {
            warn(mw.msg("mw-dhscript-tasks-failed", task.name, error.message));
        }
        function onSkip(task: Task, reason: string): void {
            warn(mw.msg("mw-dhscript-tasks-skip", task.name, reason));
        }

        async function promise(task: Task): Promise<void> {
            try {
                log(mw.msg("mw-dhscript-tasks-execute", task.name));
                const status = await task.execute();
                switch (status) {
                    case TaskStatus.OK:
                        onSuccess(task);
                        break;
                    case TaskStatus.SKIPPED:
                        onSkip(task, "Task returned SKIPPED");
                        break;
                    case TaskStatus.FAILED:
                        onFailure(task, new Error("Task returned FAILED"));
                        break;
                }
            } catch (error) {
                onFailure(task, error as Error);
            }
        }

        const suitableTasks = this.tasks.filter(async (task) => {
            const suitable = await task.suitableForEnvironment();
            return suitable;
        });
        const promises = suitableTasks.map((task) => promise(task));
        return Promise.all(promises).then(() => {
            log(mw.msg("mw-dhscript-tasks-all-complete"));
        });
    }

    async runAll(): Promise<void> {
        const p = this.buildPromise();
        return await p;
    }

}
