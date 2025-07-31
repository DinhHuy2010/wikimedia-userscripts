import { Mwn } from "mwn";

const WIKIMEDIA_USERNAME = Deno.env.get("WIKIMEDIA_USERNAME");
const WIKIMEDIA_PASSWORD = Deno.env.get("WIKIMEDIA_PASSWORD");

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
        userAgent: ""
    })
}

if (import.meta.main) {
    main();
}
