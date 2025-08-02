import { Mwn } from "mwn";

const WIKIMEDIA_USERNAME = Deno.env.get("WIKIMEDIA_USERNAME");
const WIKIMEDIA_PASSWORD = Deno.env.get("WIKIMEDIA_PASSWORD");
const USER_AGENT =
    `DinhHuy2010/wikimedia-userscripts Deno/${Deno.version.deno}`;
const TARGET_JS_PAGE = "User:DinhHuy2010/global.js";
const TARGET_CSS_PAGE = "User:DinhHuy2010/global.css";

if (!WIKIMEDIA_USERNAME || !WIKIMEDIA_PASSWORD) {
    console.error(
        "WIKIMEDIA_USERNAME and WIKIMEDIA_PASSWORD must be set in the environment.",
    );
    Deno.exit(1);
}

/**
 * Get the content of the global.js and global.css from build directory.
 * @returns {[string, string]}
 */
function getContents(): [string, string] {
    const css = Deno.readTextFileSync("build/global.css");
    const js = Deno.readTextFileSync("build/global.js");
    return [css, js];
}

function createEditSummary(page: string) {
    return `Update ${page} from wikimedia-userscripts repository`;
}

async function publish(wp: Mwn, page: string, content: string): Promise<void> {
    const editsummary = createEditSummary(page);
    console.log(`Updating ${page}...`);
    const response = await wp.save(page, content, editsummary);
    const nochange = response.nochange || false;
    if (nochange) {
        console.log(`No changes made to ${page}.`);
        return;
    }
    console.log("Update complete.");
    console.log(`Result: ${response.result}`);
    console.log(`Revision ID: ${response.newrevid}`);
}

async function main(): Promise<void> {
    const wp = await Mwn.init({
        apiUrl: "https://meta.wikimedia.org/w/api.php",
        username: WIKIMEDIA_USERNAME,
        password: WIKIMEDIA_PASSWORD,
        userAgent: USER_AGENT,
    });
    const [css, js] = getContents();
    await publish(wp, TARGET_CSS_PAGE, css);
    await publish(wp, TARGET_JS_PAGE, js);
    console.log("All updates completed.");
}

if (import.meta.main) {
    await main();
}
