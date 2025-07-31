import { Mwn } from "mwn";

const WIKIMEDIA_USERNAME = Deno.env.get("WIKIMEDIA_USERNAME");
const WIKIMEDIA_PASSWORD = Deno.env.get("WIKIMEDIA_PASSWORD");
const USER_AGENT = `DinhHuy2010/wikimedia-userscripts Deno/${Deno.version.deno} (target to: User:${WIKIMEDIA_USERNAME}/global.js)`;
const TARGET_PAGE = "User:DinhHuy2010/global.js";

if (!WIKIMEDIA_USERNAME || !WIKIMEDIA_PASSWORD) {
    console.error(
        "WIKIMEDIA_USERNAME and WIKIMEDIA_PASSWORD must be set in the environment.",
    );
    Deno.exit(1);
}

async function main(): Promise<void> {
    const wp = await Mwn.init({
        apiUrl: "https://meta.wikimedia.org/w/api.php",
        username: WIKIMEDIA_USERNAME,
        password: WIKIMEDIA_PASSWORD,
        userAgent: USER_AGENT,
    })
    console.log("Loading 'wikimedia-userscript-global.esbuilt.js'...");
    const script = await Deno.readTextFile("wikimedia-userscript-global.esbuilt.js");
    const editsummary = "Update global.js from wikimedia-userscripts repository";
    console.log("Updating global.js...");
    const response = await wp.save(TARGET_PAGE, script, editsummary);
    console.log("Update complete.");
    console.log(`Result: ${response.result}`);
    console.log(`Revision ID: ${response.newrevid}`);
}
    
if (import.meta.main) {
    main();
}
