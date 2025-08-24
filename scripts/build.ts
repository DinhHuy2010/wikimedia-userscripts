import { analyzeMetafile, build, BuildResult } from "esbuild";

async function loadConfig() {
    const module = await import("../config.ts");
    return module.config;
}
const conf = await loadConfig();

function onBuildComplete(result: BuildResult): void {
    if (result.errors.length > 0) {
        console.error("Build failed with errors:");
        result.errors.forEach((err) => console.error(err));
    } else {
        // Get output paths
        console.log(`Build succeeded`);
        if (result.metafile) {
            console.log("Output files:");
            for (const outputFile in result.metafile.outputs) {
                console.log(` - ${outputFile}`);
            }
            console.log("esbuild metafile:");
            analyzeMetafile(result.metafile).then((_) => (console.log(_)));
        }
    }
}

function buildBuildPromises(): Promise<void>[] {
    const promises: Promise<void>[] = conf.buildTargets.map(
        async (target) => {
            const result = await build(target.options);
            onBuildComplete(result);
        },
    );
    return promises;
}

async function main(): Promise<void> {
    const buildPromises = buildBuildPromises();
    await Promise.all(buildPromises);
}

if (import.meta.main) {
    await main();
}
