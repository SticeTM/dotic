(function(){
		var json = {
			'servers':[
				{
					'serverId':'102',
					'quotes':[
						{'author':'christian', 'quote':'ich bin doof'},
						{'author':'jonas', 'quote':'ich bin auch doof'}
					]
				}
			]
		}
	function serverIndex(serverId){
		for (let i = 0; i < json.servers.length; i++){
			if (json.servers[i].serverId == serverId){
				return i
			}
		}
		return -1
	}

	function addQuote(serverId, author, quote){
		let index = serverIndex(serverId)
		if (index === -1){
			json.servers.push({'serverId':serverId, 'quotes':[{'author':author, 'quote':quote}]})
		}else{
			json.servers[index].quotes.push({'author':author, 'quote':quote})
		}
	}


	function getServerQuotes(serverId){
		let index = serverIndex(serverId)
		if (index === -1){
			return []
		}
		return json.servers[index].quotes	
	}


	function getAuthorQuotes(serverId, author){
		let serverQuotes = getServerQuotes(serverId)
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

	module.exports.getAuthorQuotes = getAuthorQuotes
	module.exports.getServerQuotes = getServerQuotes
	module.exports.addQuote = addQuote

	//TODO: get list from word
}())
