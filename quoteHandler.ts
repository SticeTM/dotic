import * as fs from 'fs'
let quotes:any


export class quoteHandler{


init = () =>{
	return new Promise((accept,reject) => {
		fs.readFile(
		'./quotes.json',
		(err,data) => {
			if (err){
				reject()
				return console.log(err)
			}else{
				console.log('file opened')
				quotes = JSON.parse(data.toString())
				accept(quotes)
			}
		})
	})
}




	serverIndex(serverId:string):number{
		for (let i = 0; i < quotes.servers.length; i++){
			if (quotes.servers[i].serverId == serverId){
				return i
			}
		}
		return -1	
	}


	addQuote(serverId:string,author:string,quote:string):void{
		let index:number = this.serverIndex(serverId)
		if(index == -1){
			quotes.servers.push({'serverId':serverId, 'quotes':[{'author':author, 'quote':quote}]})
		}else{
			for(let i = 0; i < quotes.servers[index].quotes.length; i++){
				if (JSON.stringify(quotes.servers[index].quotes[i]) == JSON.stringify({'author':author, 'quote':quote})) {
					console.log('duplicate quote')
					return
				}
			}

			quotes.servers[index].quotes.push({'author':author, 'quote':quote})
		}

		fs.writeFile(
			'./quotes.json', 
			JSON.stringify(quotes), 
			function(err){
				if (err){
					console.log(err)
				}else{
					console.log('file written')
				}
		})
	}


	getServerQuotes(serverId:string):any{
		let index = this.serverIndex(serverId)
		if (index === -1){
			return []
		}
		return quotes.servers[index].quotes	
	}


	getAuthorQuotes(serverId:string, author:string):any{
		let serverQuotes = this.getServerQuotes(serverId)
		if (serverQuotes.length == 0){
			return []
		}

		for(let i = serverQuotes.length -1; i >= 0; i--){
			if (serverQuotes[i].author != author){
				serverQuotes.splice(i, 1)
			}
		}
		return serverQuotes
	}

	//TODO: get list from word
	//TODO: get random quote
	//TODO: get random from word
	//TODO: get random from user
}
