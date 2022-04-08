const { Client, Intents } = require('discord.js')
const {token} = require('./config.json')

const client = new Client({ 
	intents: [
		Intents.FLAGS.GUILDS, 
		Intents.FLAGS.GUILD_MESSAGES
	] 
})

client.once('message', msg => {
	msg.reply(msg.author.toString());
})

client.once('ready', () =>{
	console.log('client is ready')

	var commands;

	const guildId = '960870027379241070'
	const guild = client.guilds.cache.get(guildId)


	if (guild){
		commands = guild.commands
	}else{
		commands = client.application?.commands
	}
	
	commands.fetch().then(command => console.log(command))

	commands.delete('961013157453779004')
	commands.delete('961729009178263612')
})

client.login(token)
