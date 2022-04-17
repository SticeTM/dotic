import { quoteHandler } from "./quoteHandler";

let quoter = new quoteHandler();

async function func() {
  await quoter.init();
  /*
  quoter.addQuote("103", "peter", "ich bin peter");
  quoter.addQuote("103", "hans", "hans ist mein name");
  quoter.addQuote("103", "hans", "hans ist wirklich mein name");
  quoter.addQuote("103", "hans", "jetzt bin ich trauriger hans");
  */
  quoter.deleteQuote("103", "hans", "hans ist mein name");
  console.log(quoter.getServerQuotes("103"));
}

func();
//func2()
import * as fs from "fs";

function func2() {
  let data = "";

  for (let i = 0; i < 1000; i++) {
    data += i;
  }

  fs.writeFile("./quotes.json", data, () => {});
}
