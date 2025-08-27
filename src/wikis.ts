import { Wikis } from "./types.ts";

let _cached: Wikis | null = null;
const url = new URL(
    "https://raw.githubusercontent.com/DinhHuy2010/wikimedia-userscripts/main/data/wikis.json"
);
