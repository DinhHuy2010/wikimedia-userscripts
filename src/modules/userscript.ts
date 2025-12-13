import { FilterType } from "../filters/types.ts";
import { Task, TaskStatus } from "../tasks/index.ts";
import { ScriptHandlerOrLocation } from "../types.ts";
import { log } from "../utils.ts";
import { getWikis } from "../wikis/data.ts";

export class UserScriptTask extends Task {
    constructor(
        private _name: string,
        private filter: FilterType,
        private location: ScriptHandlerOrLocation,
    ) {
        super();
    }

    get name(): string {
        return this._name;
    }
    suitableForEnvironment(): boolean | Promise<boolean> {
        return this.filter.checkAgainstFilter();
    }

    async execute(): Promise<TaskStatus> {
        if (typeof this.location === "string") {
            importScript(this.location);
            return TaskStatus.OK;
        }
        if (typeof this.location === "function") {
            await this.location();
            return TaskStatus.OK;
        } else {
            const src = this.location.sourcewiki;
            const wikis = await getWikis();
            const w = wikis.get(src);
            if (!w) {
                log(`No wiki information found for ${src}`);
                return TaskStatus.FAILED;
            }
            const url = new URL(w.url);
            const ctype = this.location.ctype || "text/javascript";
            url.pathname = mw.util.wikiScript("index");
            url.searchParams.set("title", this.location.title);
            url.searchParams.set("action", "raw");
            url.searchParams.set("ctype", ctype);
            mw.loader.load(url.toString(), ctype);
            return TaskStatus.OK;
        }
    }
}
