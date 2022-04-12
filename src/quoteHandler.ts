import * as fs from "fs";
import * as CryptoJs from "crypto-js";

let file: any;

let getRandom = (array: any[]) => {
  return array[Math.floor(array.length * Math.random())];
};

let encrypt = (message: string, password: string) => {
  return CryptoJs.AES.encrypt(message, password).toString();
};

let decrypt = (encryption: string, password: string) => {
  return CryptoJs.AES.decrypt(encryption, password).toString(CryptoJs.enc.Utf8);
};

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
    await fs.promises.writeFile("./quotes.json", fileAsString);
    await fs.promises.truncate("./quotes.json", fileAsString.length);
  }

  serverIndex(serverId: string): number {
    for (let i = 0; i < file.servers.length; i++) {
      if (file.servers[i].serverId == serverId) {
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
        "serverId": serverId,
        "quotes": [{ "author": author, "quote": quote }],
      });
    } else {
      for (let i = 0; i < file.servers[index].quotes.length; i++) {
        if (
          JSON.stringify(file.servers[index].quotes[i]) ==
            JSON.stringify({ "author": author, "quote": quote })
        ) {
          console.log("duplicate quote");
          return;
        }
      }

      file.servers[index].quotes.push({ "author": author, "quote": quote });
    }
    this.writeFile(JSON.stringify(file));
  }

  deleteQuote(serverId: string, author: string, quote: string) {
    let index: number = this.serverIndex(serverId);
    if (index == -1) {
      console.log("no quotes from this server");
      return;
    }
    for (let i = file.servers[index].quotes.length - 1; i >= 0; i--) {
      if (
        JSON.stringify(
          file.servers[index].quotes[i] ==
            JSON.stringify({ "author": author, "quote": quote }),
        )
      ) {
        file.servers[index].quotes.splice(i, 1);
        this.writeFile(JSON.stringify(file));
        break;
      }
    }
  }

  getServerQuotes(serverId: string): any {
    return file.servers[this.serverIndex(serverId)].quotes ?? [];
  }

  getAuthorQuotes(serverId: string, author: string): any {
    return this.getServerQuotes(serverId).filter((quote) =>
      quote.author == author
    );
  }

  getRandomServerQuote(serverId: string): any {
    return getRandom(this.getServerQuotes(serverId));
  }

  getRandomAuthorQuote(serverId: string, author: string) {
    return getRandom(this.getAuthorQuotes(serverId, author));
  }

  getQuotesBySearch(serverId: string, search: string) {
    return this.getServerQuotes(serverId).filter((quote) =>
      quote.includes(search)
    );
  }
}
