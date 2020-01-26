# Bing Microsoft Translator 

## Using in Code
```javascript
import { BingTranslator } from "@horat1us/bing-translator";

const translator = new BingTranslator({source: "en", target: "uk"});
translator.evaluate('Hello, World!')
    .then((translated) => {
        console.log(translated);
        return translator.release();
    })
    .catch((error) => console.error(error));
```

## CLI Package
```bash
npm i -g @horat1us/bing-translator

cat ~/document.txt | bing-translate
## or interactive
bing-translate
```

## From sources
### Local NodeJS and Chromium
Requires NodeJS >=12, Chrome installed.
```bash
git clone https://github.com/Horat1us/bing-translator.git
npm i
npm test
npm start
cat ./document.txt | npm start
```
### Docker
```bash
## Install Dependencies
docker run -w $PWD -v $PWD:$PWD -e BROWSER_ARGS="--no-sandbox" catsoss/node-headless-chrome:13.6.0-1 npm i
## Execute Tests
docker run -w $PWD -v $PWD:$PWD -e BROWSER_ARGS="--no-sandbox" catsoss/node-headless-chrome:13.6.0-1 npm test
## Translate Texts from user input
docker run -it -w $PWD -v $PWD:$PWD -e BROWSER_ARGS="--no-sandbox" catsoss/node-headless-chrome:13.6.0-1 npm start
### or
docker run -it -w $PWD -v $PWD:$PWD -e BROWSER_ARGS="--no-sandbox" catsoss/node-headless-chrome:13.6.0-1 bash -c "cat ./document.txt | npm start" 
```
