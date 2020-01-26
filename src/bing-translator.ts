import * as puppeteer from "puppeteer";

import { existsSync, mkdirSync } from "fs";
import { Browser, Page } from "puppeteer";

export type Language = "auto-detect" | "ru" | "uk" | "en" | "ar" | "af" | "bn-BD" | "bg" | "bs-Latn" | "cy" | "hu" | "vi" | "el" | "da" | "he" | "id" | "ga" | "is" | "es" | "it" | "kn" | "yue" | "ca" | "otq" | "zh-Hant" | "zh-Hans" | "tlh" | "ko" | "ht" | "lv" | "lt" | "mg" | "ms" | "ml" | "mt" | "mi" | "de" | "nl" | "nb" | "pa" | "fa" | "pl" | "pt-br" | "pt-pt" | "ro" | "sm" | "sr-Cyrl" | "sr-Latn" | "sk" | "sl" | "sw" | "th" | "ty" | "ta" | "te" | "to" | "tr" | "ur" | "fj" | "fil" | "fi" | "fr" | "hi" | "mww" | "hr" | "cs" | "sv" | "et" | "yua" | "ja";

export type BingTranslatorOptions = Partial<{
    source: Language,
    target: Language,
}>

export class BingTranslator {
    private static readonly config = {
        url: "https://www.bing.com/translator",
        referer: "https://www.google.com/",
        input: `[aria-label*="input text" i]`,
        output: `[aria-label*="output text" i]`,
        device: puppeteer.devices.find((d) => d.name === `iPhone 6`),
    };
    private readonly browser: Promise<Browser>;
    private page: Promise<Page>;

    constructor(options?: BingTranslatorOptions) {
        const args = (process.env.BROWSER_ARGS || "").split(/\s+/);
        this.browser = puppeteer.launch({ args, });
        this.page = this.createPage();
        this.with(options);
    }

    with({ source = "auto-detect", target = "uk" }: BingTranslatorOptions = {}) {
        this.page = this.page.then(async (page) => {
            await page.select('select[aria-label*="output language" i]', target);
            await page.select('select[aria-label*="input language" i]', source);
            return page;
        });

        return this;
    }

    async evaluate(text: string): Promise<string> {
        const page = await this.page;
        await page.evaluate(function (selector) {
            (<HTMLInputElement>document.querySelector(selector)).value = '';
        }, BingTranslator.config.input);
        await page.type(BingTranslator.config.input, text);

        const handle = await page.waitForFunction(function (selector) {
            const { value } = <HTMLInputElement>document.querySelector(selector);
            return !value.endsWith("...") && value.trim() && value.toString();
        }, { timeout: 10000, }, BingTranslator.config.output);
        return handle.jsonValue() as Promise<string>;
    }

    async screenshot(page?: Page): Promise<string> {
        existsSync('runtime') || mkdirSync('runtime');
        const screenshotPath = `runtime/bing.${new Date().toISOString()}.png`;
        await (page || await this.page).screenshot({ path: screenshotPath });
        return screenshotPath;
    }

    async release() {
        return (await this.browser).close();
    }

    private async createPage(options?: BingTranslatorOptions): Promise<Page> {
        const browser = await this.browser;
        const page = await browser.newPage();
        if (BingTranslator.config.device) {
            await page.emulate(BingTranslator.config.device);
        }
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en',
        });
        await page.setCookie({ name: 'MSTC', value: 'ST=1', secure: true, domain: '.bing.com', });
        await page.goto(BingTranslator.config.url, {
            referer: BingTranslator.config.referer,
            waitUntil: 'networkidle2',
        });
        return page;
    }
}
