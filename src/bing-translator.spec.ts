import { equal } from "assert";
import { BingTranslator } from "./bing-translator";

describe("Bing Microsoft Translator", () => {
    const translator = new BingTranslator;

    after(async () => {
        await translator.release();
    });

    it("should translate from russian to great ukrainian language", async () => {
        const source = `Я никогда не буду нарушать условия лицензионного соглашения.`;
        const expected = `Я ніколи не порушу умови ліцензійної угоди.`;

        const translation = await translator.evaluate(source);
        equal(translation, expected);
    }).timeout(60000);

    it("should translate using configured languages", async () => {
        const source = `In memory of Russian Constitution.`;
        const expected = `В память о Конституции России.`;

        const translation = await translator.with({ source: "en", target: "ru" }).evaluate(source);
        equal(translation, expected);
    }).timeout(60000);
    it("should translate 'Всем Привет!'", async () => {
        const source = `Всем Привет!`;
        const expected = `Привіт, народ!`;

        const translation = await translator.with({}).evaluate(source);
        equal(translation, expected);
    }).timeout(60000);
});
