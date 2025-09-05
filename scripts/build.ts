import { analyzeMetafile, build, BuildResult } from "esbuild";
import { BuildTarget } from "./types.ts";
import { parseArgs } from "@std/cli";

async function loadConfig() {
    const module = await import("../config.ts");
    return module.config;
}
const conf = await loadConfig();

function getCodenames(): string[] {
    return parseArgs(Deno.args)._.map(String);
}

function getFileTargets(codenames: string[]): Record<string, BuildTarget> {
    return codenames.reduce((acc, codename) => {
        const target = conf.buildTargets[codename];
        if (!target) {
            throw new Error(`Unknown build target codename: ${codename}`);
        }
        acc[codename] = target;
        return acc;
    }, {} as Record<string, BuildTarget>);
}

async function onBuildComplete(result: BuildResult): Promise<boolean> {
    if (result.errors.length > 0) {
        console.error("Build failed with errors:");
        result.errors.forEach((err) => console.error(err));
        return false;
    } else {
        // Get output paths
        console.log(`Build succeeded`);
        if (result.metafile) {
            console.log("Output files:");
            for (const outputFile in result.metafile.outputs) {
                console.log(` - ${outputFile}`);
            }
            console.log("esbuild metafile:");
            const o = await analyzeMetafile(result.metafile);
            console.log(o);
        }
        return true;
    }
}

function buildBuildPromises(
    targets: Record<string, BuildTarget>,
): Promise<[string, BuildTarget]>[] {
    const promises: Promise<[string, BuildTarget]>[] = Object.entries(targets)
        .map(
            async ([name, target]) => {
                const result = await build(target.options);
                const ok = await onBuildComplete(result);
                if (!ok) {
                    console.error(`Build failed for target: ${name}`);
                    Deno.exit(1);
                }
                return [name, target] as [string, BuildTarget];
            },
        );
    return promises;
}

async function main(knownCodenames: string[] | null = null): Promise<void> {
    let codenames: string[];
    if (knownCodenames) {
        codenames = knownCodenames;
    } else {
        codenames = getCodenames();
        if (codenames.length === 0) {
            codenames = Object.keys(conf.buildTargets);
        }
    }
    const targets = getFileTargets(codenames);
    const buildPromises = buildBuildPromises(targets);
    const results = await Promise.all(buildPromises);
    await Deno.writeTextFile(
        "./scripts/built-files.json",
        JSON.stringify(results.map(([c, _]) => c)),
    );
    console.log(`Built ${results.length} targets successfully.`);
    Deno.exit(0);
}

if (import.meta.main) {
    await main();
}
