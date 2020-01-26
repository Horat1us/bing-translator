#!/usr/bin/env node

import { BingTranslator } from "./bing-translator";

const options: { [ k: string ]: string } = {};
const argRegEx = /^--([a-z]+)=([a-z\-]+)$/;
process.argv.slice(2)
    .map(arg => arg.match(argRegEx))
    .filter((arg): arg is RegExpMatchArray => arg !== null)
    .map(([, k, v]) => options[ k ] = v);

const translator = new BingTranslator(options);

let end = false;
process.stdin.setEncoding('utf8');
process.stdin.on('readable', async () => {
    let chunk = process.stdin.read();
    if (chunk === null) {
        return;
    }

    chunk = chunk.trim().toString();

    const out = await translator.evaluate(chunk);
    process.stdout.write(out.trim() + "\n");

    if (end) {
        await translator.release();
    } else {
        process.stdin.read();
    }
});
process.stdin.on("end", () => end = true);
