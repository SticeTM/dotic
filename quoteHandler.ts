import * as fs from 'fs'
let data: any

export class quoteHandler {

  init() {
    return new Promise(
        (accept, reject) => {fs.readFile('./quotes.json', (err, data) => {
          if (err) {
            reject()
            return console.log(err)
          } else {
            console.log('file opened')
            data = JSON.parse(data.toString())
            accept(data)
          }
        })})
  }

  serverIndex(serverId: string): number {
    for (let i = 0; i < data.servers.length; i++) {
      if (data.servers[i].serverId == serverId) {
        return i
      }
    }
    return -1
  }

  addQuote(serverId: string, author: string, quote: string): void {
    let index: number = this.serverIndex(serverId)
    if (index == -1) {
      data.servers.push({
        'serverId' : serverId,
        'quotes' : [ {'author' : author, 'quote' : quote} ]
      })
    }
    else {
      for (let i = 0; i < data.servers[index].quotes.length; i++) {
        if (JSON.stringify(data.servers[index].quotes[i]) ==
            JSON.stringify({'author' : author, 'quote' : quote})) {
          console.log('duplicate quote')
          return
        }
      }

      data.servers[index].quotes.push({'author' : author, 'quote' : quote})
    }

    fs.writeFile('./quotes.json', JSON.stringify(data), function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log('file written')
      }
    })
  }

  deleteQuote(serverId: string, author: string, quote: string) {
    let index: number = this.serverIndex(serverId)
    if (index == -1) {
      console.log('no quotes from this server')
      return
    }
    for (let i = data.servers[index].quotes.length - 1; i >= 0; i--) {
      if (JSON.stringify(
              data.servers[index].quotes[i] ==
              JSON.stringify({'author' : author, 'quote' : quote}))) {
        data.servers[index].quotes.splice(i, 1);
        fs.writeFile('./quotes.json', JSON.stringify(data), function(err) {
          if (err) {
            console.log(err)
          } else {
            console.log('quote overridden')
          }
        })
      }
    }
  }

  getServerQuotes(serverId: string): any {
    let index = this.serverIndex(serverId)
    if (index == -1) {
      return []
    }
    return data.servers[index].quotes
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
