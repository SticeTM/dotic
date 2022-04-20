import * as fs from "fs";
import * as CryptoJs from "crypto-js";

type Quote = {
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

export class quoteHandler {
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
      fs.truncate("./quotes.json", fileAsString.length, (err) => {})
    );
  }

  serverIndex(serverId: string): number {
    for (let i = 0; i < file.servers.length; i++) {
			console.log("erstes" + decrypt(file.servers[i].serverId, serverId))
			console.log(CryptoJs.AES.decrypt(file.servers[i].serverId, serverId).toString(CryptoJs.enc.Utf8))
			console.log("zweites" + serverId)
      if (decrypt(file.servers[i].serverId, serverId) == serverId) {
        return i;
      }
    }
    return -1;
  }

  addQuote(serverId: string, author: string, quote: string): void {
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
    } else {
      for (let i = 0; i < file.servers[index].quotes.length; i++) {
        let encryptedQuote = JSON.parse(
          decrypt(file.servers[index].quotes[i].toString(), serverId),
        );
        if (encryptedQuote.author == author && encryptedQuote.quote == quote) {
          console.log("duplicate quote");
          return;
        }
      }

      file.servers[index].quotes.push(
        encrypt(
          JSON.stringify({ "author": author, "quote": quote }),
          serverId,
        ),
      );
      this.writeFile(JSON.stringify(file));
    }
  }

  deleteQuote(serverId: string, author: string, quote: string) {
    let index: number = this.serverIndex(serverId);
    if (index == -1) {
      console.log("no quotes from this server");
      return;
    }
    for (let i = file.servers[index].quotes.length - 1; i >= 0; i--) {
      if (
        decrypt(file.servers[index].quotes[i].toString(), serverId) ==
          JSON.stringify({ "author": author, "quote": quote })
      ) {
        file.servers[index].quotes.splice(i, 1);
        this.writeFile(JSON.stringify(file));
        return;
      }
    }
    console.log("trying to delete nonexistant quote");
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

  getRandomAuthorQuote(serverId: string, author: string) {
    return getRandom(this.getAuthorQuotes(serverId, author));
  }

  getQuotesBySearch(serverId: string, search: string) {
    return this.getServerQuotes(serverId)
      .filter((quoteObject) =>
        quoteObject.quote.split(" ")
          .map((word) => word.toLowerCase())
          .find((word) => word == search.toLowerCase().trim()) != undefined
      );
  }
}
