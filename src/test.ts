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

//func();

import * as CryptoJS from "crypto-js";

let test = CryptoJS.AES.encrypt("hallo", "hallo");
test = test.toString();
//console.log(test);
test = CryptoJS.AES.decrypt(test, "hallo");
//console.log(test.toString(CryptoJS.enc.Utf8));

let tmp = CryptoJS.AES.encrypt(test, "hallo").toString();
console.log(CryptoJS.AES.decrypt(tmp, "hallo").toString(CryptoJS.enc.Utf8));
console.log(CryptoJS.AES.decrypt(tmp, "hallo").toString(CryptoJS.enc.Utf8));
console.log(CryptoJS.AES.decrypt(tmp, "hallo").toString(CryptoJS.enc.Utf8));

console.log(
  CryptoJS.AES.decrypt(
    "U2FsdGVkX1/dUDDOSpr/hgxTlzlj8JPc2+7T16q7a4Q6e9a/4II5NDWqyxVLWGPdV9QMw3am344WQAUBju0Oh+sH5AGD9q2QPUQwk7ZUr1heZzNAfjRz3rcuecnIXjT6",
    "103",
  )
    .toString(CryptoJS.enc.Utf8),
);
