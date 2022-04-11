import * as fs from 'fs'
import {FileHandle} from 'fs/promises';
let file: FileHandle = await fs.promises.open("./quotes.json", "w+")
const getRandom = (x: any[]) => x[Math.floor(x.length * Math.random())]

type Quote = {
  author: string,
  quote: string
}

type State = {
  servers : Map<string, { "quotes": Quote[] }>
}

let state: State;




/* mby this is from stack overflow */

function replacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}



export class quoteHandler {

  async writeFile(fileAsString: string) {
    await file.writeFile(fileAsString)
  }

  async init() {
    let data = await file.readFile("utf8");

    console.log('file opened')
    if (data.length == 0) {
      state = { "servers" : new Map() }
    }
    else {
      state = JSON.parse(data, reviver)
    }
    console.log(state)
  }

  async addQuote(serverId: string, author: string, quote: string) {
    if (state == undefined) {
      state = { "servers" : new Map() }
    }
    let submap: { "quotes": any[] } = state.servers.get(serverId)
    if (submap == undefined) {
      console.log("new server?")
      submap = {
        'quotes' : [ {'author' : author, 'quote' : quote} ]
      }
      state.servers.set(serverId, submap)
      console.log(JSON.stringify(state, replacer))
    }
    else {
      if (submap.quotes.some(x => x.author == author && x.quote == quote)) {
        console.log(`Duplicate quote by ${author}: ${quote}`)
      } else {
        submap.quotes.push({'author' : author, 'quote' : quote})
      }      
    }
    await this.writeFile(JSON.stringify(state, replacer))
  }

  async deleteQuote(serverId: string, author: string, quote: string) {
    let submap = state.servers.get(serverId)
    if (submap == undefined) {
      console.log('no quotes from this server')
      return
    }
    for (let i = submap.quotes.length - 1; i >= 0; i--) {
      if (submap.quotes[i].author == author && submap.quotes[i].quote == quote) {
        console.log("current state:", JSON.stringify(state, replacer))
        submap.quotes.splice(i, 1);
        console.log("after removal:", JSON.stringify(state, replacer))

        await this.writeFile(JSON.stringify(state, replacer))
      }
    }
  }

  getServerQuotes(serverId: string): Quote[] {
    return (state.servers.get(serverId) ?? { 'quotes' : [] }).quotes
  }

  getAuthorQuotes(serverId: string, author: string): Quote[] {
    return this.getServerQuotes(serverId).filter(x => x.author == author)
  }

  getRandomQuote(serverId: string): Quote {
    return getRandom(this.getServerQuotes(serverId))
  }

  getRandomByAuthor(serverId: string, author: string): Quote[] {
    return getRandom(this.getAuthorQuotes(serverId, author))
  }

  getQuotesBySearch(serverId: string, search: string) : Quote[] {
    return this.getServerQuotes(serverId).filter(x => x.quote.includes(search))
  }
}
