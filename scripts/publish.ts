import { Mwn } from "mwn";
import { Wikis } from "../src/wikis/types.ts";
import _wikis from "../data/wikis.json" with { type: "json" };
import { BuildTarget } from "./types.ts";

const WIKIS = _wikis as Wikis;

const WIKIMEDIA_USERNAME = Deno.env.get("WIKIMEDIA_USERNAME");
const WIKIMEDIA_PASSWORD = Deno.env.get("WIKIMEDIA_PASSWORD");
const USER_AGENT =
    `DinhHuy2010/wikimedia-userscripts Deno/${Deno.version.deno}`;

async function loadConfig() {
    const module = await import("../config.ts");
    return module.config;
}
const conf = await loadConfig();

function createEditSummary(page: string): string {
    return `Update ${page} from wikimedia-userscripts repository`;
}

async function publishFromBuildTarget(target: BuildTarget) {
    let blob: string;
    try {
        blob = await Deno.readTextFile(target.expectedOutputLocation);
    } catch (error) {
        console.error(
            `Error reading file at ${target.expectedOutputLocation}:`,
            error,
            " Maybe the file doesn't exist?",
        );
        return;
    }
    const apiUrl = new URL(WIKIS[target.targetwiki].url);
    apiUrl.pathname = "/w/api.php";
    const mwn = await Mwn.init({
        apiUrl: apiUrl.toString(),
        userAgent: USER_AGENT,
        username: WIKIMEDIA_USERNAME,
        password: WIKIMEDIA_PASSWORD,
    });
    return mwn.save(
        target.targetpage,
        blob,
        createEditSummary(target.name),
    );
}

async function getBuildTargets(): Promise<BuildTarget[]> {
    let o: string[];
    try {
        o = JSON.parse(await Deno.readTextFile("./scripts/built-files.json"));
    } catch (error) {
        console.error("Error reading built files:", error);
        Deno.exit(1);
    }
    return o.map((codename) => {
        const target = conf.buildTargets[codename];
        if (!target) {
            throw new Error(`Unknown build target codename: ${codename}`);
        }
        return target;
    });
}

export async function main(): Promise<void> {
    if (!WIKIMEDIA_USERNAME || !WIKIMEDIA_PASSWORD) {
        console.error(
            "WIKIMEDIA_USERNAME and WIKIMEDIA_PASSWORD must be set in the environment.",
        );
        Deno.exit(1);
    }
    const promises = (await getBuildTargets()).map((target) =>
        publishFromBuildTarget(target).then(
            (response) => {
                if (response?.nochange) {
                    console.log(`No changes made to ${target.name}`);
                } else {
                    console.log("Update complete.");
                    console.log(`Result: ${response?.result}`);
                    console.log(`New revision ID: ${response?.newrevid}`);
                }
            },
        )
    );
    await Promise.all(promises);
    console.log("All updates completed.");
}

if (import.meta.main) {
    await main();
}
