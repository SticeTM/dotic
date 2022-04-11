import * as fs from 'fs'
let file: any
let fileLocked: boolean = false

export class quoteHandler {

  writeFile(fileAsString: string) {
    console.log('trying to write')
    do {
      setTimeout(() => {
        if (!fileLocked) {
          fileLocked = true
          fs.writeFile('./quotes.json', (fileAsString), function(err) {
            if (err) {
              console.log(err)
              fileLocked = false
            } else {
              console.log('file written')
              fileLocked = false
            }
          })
        }
      }, 500)
    }
    while (fileLocked)
  }

  init() {
    return new Promise(
        (accept, reject) => {fs.readFile('./quotes.json', (err, data) => {
          if (err) {
            reject()
            return console.log(err)
          } else {
            console.log('file opened')
            if (data.length == 0) {
              file = { "servers" : [] }
            }
            else {file = JSON.parse(data.toString())} accept(data)
          }
        })})
  }

  serverIndex(serverId: string): number {
    for (let i = 0; i < file.servers.length; i++) {
      if (file.servers[i].serverId == serverId) {
        return i
      }
    }
    return -1
  }

  addQuote(serverId: string, author: string, quote: string): void {
    if (file == undefined) {
      file = { "servers" : [] }
    }
    let index: number = this.serverIndex(serverId)
    if (index == -1) {
      file.servers.push({
        'serverId' : serverId,
        'quotes' : [ {'author' : author, 'quote' : quote} ]
      })
    }
    else {
      for (let i = 0; i < file.servers[index].quotes.length; i++) {
        if (JSON.stringify(file.servers[index].quotes[i]) ==
            JSON.stringify({'author' : author, 'quote' : quote})) {
          console.log('duplicate quote')
          return
        }
      }

      file.servers[index].quotes.push({'author' : author, 'quote' : quote})
    }
    this.writeFile(JSON.stringify(file))
    /*
fs.writeFile('./quotes.json', JSON.stringify(file), function(err) {
if (err) {
console.log(err)
} else {
console.log('file written')
}
})*/
  }

  deleteQuote(serverId: string, author: string, quote: string) {
    let index: number = this.serverIndex(serverId)
    if (index == -1) {
      console.log('no quotes from this server')
      return
    }
    for (let i = file.servers[index].quotes.length - 1; i >= 0; i--) {
      if (JSON.stringify(
              file.servers[index].quotes[i] ==
              JSON.stringify({'author' : author, 'quote' : quote}))) {
        console.log(JSON.stringify(file))
        file.servers[index].quotes.splice(i, 1);
        console
            .log(JSON.stringify(file))

                this.writeFile(JSON.stringify(file))
        /*
fs.writeFile('./quotes.json', JSON.stringify(file), function(err) {
if (err) {
console.log(err)
} else {
console.log('quote deleted')
}
})*/
      }
    }
  }

  getServerQuotes(serverId: string): any {
    let index = this.serverIndex(serverId)
    if (index == -1) {
      return []
    }
    return file.servers[index].quotes
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
