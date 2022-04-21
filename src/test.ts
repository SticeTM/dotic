import { QuoteHandler } from "./quoteHandler";

let quoter = new QuoteHandler();

async function func() {
  await quoter.init();
  /*
  quoter.addQuote("103", "peter", "ich bin peter");
  quoter.addQuote("103", "hans", "hans ist mein name");
  quoter.addQuote("103", "hans", "hans ist wirklich mein name");
  quoter.addQuote("103", "hans", "jetzt bin ich trauriger hans");
  */
  console.log(quoter.getServerQuotes("103"));
	let obj = [{
		quotes:[
			{
				quote:'hallo',
				author:'peter'
			}
		]
	}]
}

func();
