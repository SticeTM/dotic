import { Client, Constants, Intents } from "discord.js";
const { token } = require("./../config.json");
import { quoteHandler } from "./quoteHandler";

let quoter = new quoteHandler();

async function main() {
  await quoter.init();

  const client = new Client(
    { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] },
  );
  client.once("messageCreate", (msg) => {
    // msg.reply(msg.author.toString());
  });

  client.once("ready", () => {
    console.log("client is ready");

    var commandCollection;

    const guildId = "960870027379241070";
    const guild = client.guilds.cache.get(guildId);

    if (guild) {
      commandCollection = guild.commands;
    } else {
      commandCollection = client.application?.commands;
    }

    let commands = require("./../commands.json");

    commands.forEach((command) => {
      commandCollection?.create(command);
    });

    //delete all commands from server
    /*commandCollection.fetch().then((command) => {
      command.forEach((key, value) => {
        commandCollection.delete(key.id);
      });
    }).then(console.log('deleted all commands'));
		*/

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) {
        return;
      }

      const { commandName, options } = interaction;

      switch (commandName) {
        case "add_quote":
          {
            quoter.addQuote(
              interaction.guild.id,
              options.getString("author", true),
              options.getString("quote", true),
            );
          }
          break;
        case "delete_quote":
          {
          }
          break;
        case "list_all":
          {
          }
          break;
        case "list_all_from":
          {
          }
          break;
        case "random_quote":
          {
            let quote = quoter.getRandomServerQuote(
              interaction.guild.id.toString(),
            );
            interaction.reply({
              content: `> ${quote?.quote} \n-${quote?.author}`,
            });
          }
          break;
        case "random_quote_from":
          {
          }
          break;
        case "search_quote":
          {
          }
          break;
      }
    });
  });
  client.login(token);
}

main();
