import { FilterType } from "../filters/types.ts";
import { Task, TaskStatus } from "../tasks/index.ts";
import { ScriptHandlerOrLocation } from "../types.ts";

class UserScriptTask extends Task {
    _name: string;
    _location: ScriptHandlerOrLocation;

    constructor(
        private script: string,
        private filter: FilterType,
        private location: ScriptHandlerOrLocation,
    ) {
        super();
        this._name = script;
        this._location = location;
    }

    get name(): string {
        return this._name;
    }
    suitableForEnvironment(): boolean | Promise<boolean> {
        return this.filter.checkAgainstFilter();
    }

    async execute(): Promise<void> {
        if (typeof this._location === "string") {
            importScript(this._location);
            return TaskStatus.OK;
        }
        if (typeof this._location === "function") {
            await this._location();
            return TaskStatus.OK;
        }
    }
}
