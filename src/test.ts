import { quoteHandler } from "./quoteHandler";

let quoter = new quoteHandler();

async function func() {
  await quoter.init();

  quoter.addQuote("103", "hannah", "elefand");
  quoter.addQuote(
    "103",
    "hannah",
    "das hier ist ein extremst langes zitat ahhhh",
  );

  quoter.deleteQuote(
    "103",
    "hannah",
    "das hier ist ein extremst langes zitat ahhhh",
  );
}

func();
