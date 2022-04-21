import * as fs from "fs";
import * as CryptoJs from "crypto-js";
let MAXIMUM_MESSAGE_SIZE = 2000;
export type Quote = {
  author: string;
  quote: string;
};
type Server = {
  serverId: string;
  quotes: Quote[];
};
type File = {
  servers: Server[];
};

let getRandom = (array: any[]) => {
  return array[Math.floor(array.length * Math.random())];
};

let encrypt = (message: string, password: string) => {
  return CryptoJs.AES.encrypt(message, password).toString();
};

let decrypt = (encryption: string, password: string) => {
  return CryptoJs.AES.decrypt(encryption, password).toString(CryptoJs.enc.Utf8);
};

let file: File;

export enum Feedback {
  QuoteAlreadyAdded,
  Success,
  ServerNotFound,
  QuoteNotFound,
}

export class QuoteHandler {
  init() {
    return new Promise(
      (accept, reject) => {
        fs.readFile("./quotes.json", (err, data) => {
          if (err) {
            reject();
            return console.log(err);
          } else {
            console.log("file opened");
            if (data.length == 0) {
              file = { "servers": [] };
            } else file = JSON.parse(data.toString());
            accept(data);
          }
        });
      },
    );
  }

  async writeFile(fileAsString: string) {
    await fs.promises.writeFile("./quotes.json", fileAsString).then(() =>
      fs.truncate("./quotes.json", fileAsString.length, (err) => {
        console.log(err);
      })
    );
  }

  serverIndex(serverId: string): number {
    for (let i = 0; i < file.servers.length; i++) {
      if (decrypt(file.servers[i].serverId, serverId) == serverId) {
        return i;
      }
    }
    return -1;
  }

  getStringsFromQuotes(quotes: Quote[]): String[] {
    let result: String[] = [];
    quotes.forEach((quote) => {
      if (
        result.length == 0 ||
        result[result.length - 1].length +
              `\n\n> ${quote?.quote} \n-${quote?.author}`.length >=
          MAXIMUM_MESSAGE_SIZE
      ) {
        result.push(`> ${quote?.quote} \n-${quote?.author}`);
      } else {
        result[result.length - 1] += `\n\n> ${quote?.quote} \n-${quote?.author}`;
      }
    });
    return result;
  }

  addQuote(serverId: string, author: string, quote: string): Feedback {
    if (file == undefined) {
      file = { "servers": [] };
    }
    let index: number = this.serverIndex(serverId);
    if (index == -1) {
      file.servers.push({
        "serverId": encrypt(serverId, serverId),
        "quotes": [encrypt(
          JSON.stringify({ "author": author, "quote": quote }),
          serverId,
        )],
      });
      return Feedback.Success;
    } else {
      for (let i = 0; i < file.servers[index].quotes.length; i++) {
        let encryptedQuote = JSON.parse(
          decrypt(file.servers[index].quotes[i].toString(), serverId),
        );
        if (encryptedQuote.author == author && encryptedQuote.quote == quote) {
          return Feedback.QuoteAlreadyAdded;
        }
      }

      file.servers[index].quotes.push(
        encrypt(
          JSON.stringify({ "author": author, "quote": quote }),
          serverId,
        ),
      );
      this.writeFile(JSON.stringify(file));
      return Feedback.Success;
    }
  }

  deleteQuote(serverId: string, author: string, quote: string): Feedback {
    let index: number = this.serverIndex(serverId);
    if (index == -1) {
      return Feedback.ServerNotFound;
    }
    for (let i = file.servers[index].quotes.length - 1; i >= 0; i--) {
      if (
        decrypt(file.servers[index].quotes[i].toString(), serverId) ==
          JSON.stringify({ "author": author, "quote": quote })
      ) {
        file.servers[index].quotes.splice(i, 1);
        this.writeFile(JSON.stringify(file));
        return Feedback.Success;
      }
    }
    return Feedback.QuoteNotFound;
  }

  getServerQuotes(serverId: string): Quote[] {
    return file.servers[this.serverIndex(serverId)]?.quotes
      .map((quoteObject) => decrypt(quoteObject.toString(), serverId))
      .map((quoteObject) => JSON.parse(quoteObject.toString())) ?? [];
  }

  getAuthorQuotes(serverId: string, author: string): Quote[] {
    return this.getServerQuotes(serverId)
      .filter((quoteObject) => quoteObject.author == author);
  }

  getRandomServerQuote(serverId: string): Quote {
    return getRandom(this.getServerQuotes(serverId));
  }

  getRandomAuthorQuote(serverId: string, author: string): Quote {
    return getRandom(this.getAuthorQuotes(serverId, author));
  }

  getQuotesBySearch(serverId: string, search: string): Quote[] {
    return this.getServerQuotes(serverId)
      .filter((quoteObject) =>
        quoteObject.quote.split(" ")
          .map((word) => word.toLowerCase())
          .find((word) => word == search.toLowerCase().trim()) != undefined
      );
  }
}
