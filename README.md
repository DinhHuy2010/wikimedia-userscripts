This repository is used for to store source code of various scripts used within [Wikimedia projects](https://meta.wikimedia.org/wiki/Wikimedia_projects) (e.g. Wikipedia, Wikidata, etc.).

# Software used

* [TypeScript](https://typescriptlang.org)
* [Deno](https://deno.com)
* [jQuery](https://jquery.com)
* [MediaWiki frontend API](https://doc.wikimedia.org/mediawiki-core/master/js/)

# Pipeline

To bundle, run:

```bash
$ deno task build
```

To bundle some targets, but not all targets, use:

```bash
$ deno task build <codename> # replace <codename> with codenames defined in config.ts
```

After bundle, to publish, run:

```bash
$ deno task publish
```

To bundle and publish at the sametime, run:

```bash
$ deno task buildnpublish [<codename>] # replace <codename> with codenames defined in config.ts, if not passed then asssume all targets
```
