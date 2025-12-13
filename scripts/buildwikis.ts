// deno-lint-ignore-file no-explicit-any
/* Build wikis list to data/wikis.json */

const WIKIS_CONNTECTED_TO_WIKIDATA_LIST_URL = new URL(
    "https://raw.githubusercontent.com/wikimedia/operations-mediawiki-config/refs/heads/master/dblists/wikidataclient.dblist",
);

export interface WikiEntry {
    db: string;
    url: string;
    wikidataitem: string;
    editionwikidataitem: string | null;
    label: string;
    edition: string | null;
}

async function pullList(): Promise<string[]> {
    const response = await fetch(WIKIS_CONNTECTED_TO_WIKIDATA_LIST_URL);
    const text = await response.text();
    return text.split("\n").filter((line) => line && !line.startsWith("#"));
}
async function fetchWDQS(sparqlQuery: string): Promise<string> {
    const endpoint = "https://query.wikidata.org/sparql";
    const headers = {
        "Accept": "application/sparql-results+json",
        "Content-Type": "application/x-www-form-urlencoded",
    };
    const params = new URLSearchParams({ query: sparqlQuery });
    const response = await fetch(endpoint, {
        headers,
        method: "POST",
        body: params.toString(),
    });
    if (!response.ok) {
        throw new Error(
            `HTTP error ${response.status}: ${response.statusText}`,
        );
    }
    return response.text();
}

async function main(): Promise<void> {
    const l = await pullList();
    const sparql = `
    SELECT DISTINCT ?item ?itemLabel ?wikidb ?url ?edition ?editionLabel WHERE {
    VALUES ?wikidb {${l.map((wiki) => `"${wiki}"`).join(" ")}}
    ?item wdt:P31/wdt:P279* wd:Q14827288 .
    OPTIONAL {?item wdt:P31 [wdt:P629 ?edition] .}
    ?item wdt:P1800 ?wikidb.
    ?item wdt:P856 ?url .
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en". }
    }
    `;
    const sparqlResultText = await fetchWDQS(sparql);
    const sparqlResult = JSON.parse(sparqlResultText);
    const wikis: { [key: string]: WikiEntry } = {};
    console.log(`Got ${sparqlResult.results.bindings.length} wikis...`);
    for (const result of sparqlResult.results.bindings as any[]) {
        const db = result.wikidb.value;
        wikis[db] = {
            db,
            url: result.url.value,
            wikidataitem: result.item.value.replace(
                "http://www.wikidata.org/entity/",
                "",
            ),
            editionwikidataitem: result.edition
                ? result.edition.value.replace(
                    "http://www.wikidata.org/entity/",
                    "",
                )
                : null,
            label: result.itemLabel.value,
            edition: result.editionLabel ? result.editionLabel.value : null,
        };
    }

    // Write to data/wikis.json
    await Deno.writeTextFile(
        "data/wikis.json",
        JSON.stringify(wikis, null, 2),
    );
    console.log(`Wrote ${Object.keys(wikis).length} wikis to data/wikis.json`);
}

if (import.meta.main) {
    await main();
}
