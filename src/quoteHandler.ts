import * as fs from 'fs'
import {FileHandle} from 'fs/promises';
let file: FileHandle = await fs.promises.open("./quotes.json", "r+")

type Quote = {
  author: string,
  quote: string
}

type State = {
  servers : Map<string, { "quotes": Quote[] }>
}

let state: State;

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
    else {state = JSON.parse(data.toString())}
  }

  async addQuote(serverId: string, author: string, quote: string) {
    if (state == undefined) {
      state = { "servers" : new Map() }
    }
    let submap: { "quotes": any[] } = state.servers.get(serverId)
    if (submap == undefined) {
      submap = {
        'quotes' : [ {'author' : author, 'quote' : quote} ]
      }
      state.servers.set(serverId, submap)
    }
    else {
      if (submap.quotes.some(x => x.author == author && x.quote == quote)) {
        console.log(`Duplicate quote by ${author}: ${quote}`)
      } else {
        submap.quotes.push({'author' : author, 'quote' : quote})
      }      
    }
    await this.writeFile(JSON.stringify(state))
  }

  async deleteQuote(serverId: string, author: string, quote: string) {
    let submap = state.servers.get(serverId)
    if (submap == undefined) {
      console.log('no quotes from this server')
      return
    }
    for (let i = submap.quotes.length - 1; i >= 0; i--) {
      if (submap.quotes[i].author == author && submap.quotes[i].quote == quote) {
        console.log(JSON.stringify(state))
        submap.quotes.splice(i, 1);
        console
            .log(JSON.stringify(state))

        await this.writeFile(JSON.stringify(state))
      }
    }
  }

  getServerQuotes(serverId: string): any {
    return (state.servers.get(serverId) ?? { 'quotes' : [] }).quotes
  }

  getAuthorQuotes(serverId: string, author: string): any {
    let serverQuotes = this.getServerQuotes(serverId)
    if (serverQuotes.length == 0) {
      return []
    }

    for (let i = serverQuotes.length - 1; i >= 0; i--) {
      if (serverQuotes[i].author != author) {
        serverQuotes.splice(i, 1)
      }
    }
    return serverQuotes
  }

  getRandomQuote(serverId: string): any {
    let serverQuotes = this.getServerQuotes(serverId)
    if (serverQuotes.length <= 0) {
      return null
    }
    return serverQuotes[Math.floor(Math.random() * serverQuotes.length)]
  }

  getRandomByAuthor(serverId: string, author: string): any {
    let serverQuotes = this.getServerQuotes(serverId)
    if (serverQuotes.length <= 0) {
      return null
    }
    for (let i = serverQuotes.length - 1; i >= 0; i--) {
      if (serverQuotes[i].author != author) {
        serverQuotes.splice(i, 1)
      }
      return serverQuotes
    }
  }

  getQuotesBySearch(serverId: string, search: string) {
    let serverQuotes = this.getServerQuotes(serverId)
    if (serverQuotes.length <= 0) {
      return null
    }
    for (let i = serverQuotes.length - 1; i >= 0; i--) {
      if (!serverQuotes[i].includes(search)) {
        serverQuotes.splice(i, 1)
      }
      return serverQuotes
    }
  }
}
