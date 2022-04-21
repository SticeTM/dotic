import { Client, Constants, Intents } from "discord.js";
const { token } = require("./../config.json");
import { Feedback, QuoteHandler } from "./quoteHandler";

let quoter = new QuoteHandler();

async function main() {
  await quoter.init();

  const client = new Client(
    { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] },
  );

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
            let status: Feedback = quoter.addQuote(
              interaction.guild.id,
              options.getString("author", true),
              options.getString("quote", true),
            );
            if (status == Feedback.Success) {
              interaction.reply({
                content: "quote added successfully",
                ephemeral: true,
              });
            } else if (status == Feedback.QuoteAlreadyAdded) {
              interaction.reply({
                content: "quote was allready added",
                ephemeral: true,
              });
            }
          }
          break;
        case "delete_quote":
          {
            let status: Feedback = quoter.deleteQuote(
              interaction.guild.id,
              options.getString("author", true),
              options.getString("quote", true),
            );
            if (status == Feedback.Success) {
              interaction.reply({
                content: "quote deleted successfully",
                ephemeral: true,
              });
            } else if (status == Feedback.ServerNotFound) {
              interaction.reply({
                content: "this server has no quotes yet",
                ephemeral: true,
              });
            } else if (status == Feedback.QuoteNotFound) {
              interaction.reply({
                content: "quote not found",
                ephemeral: true,
              });
            }
          }
          break;
        case "list_all":
          {
            let messages: String[] = quoter.getStringsFromQuotes(
              quoter.getServerQuotes(interaction.guild.id),
            );

            if (messages.length == 0) {
              interaction.reply({
                content: "no quotes added so far",
                ephemeral: true,
              });
            } else {
              await interaction.reply(messages[0].toString());
              messages.splice(0, 1);
              messages.forEach((message) => {
                interaction.followUp(message.toString());
              });
            }
          }
          break;
        case "list_all_from":
          {
            let messages: String[] = quoter.getStringsFromQuotes(
              quoter.getAuthorQuotes(
                interaction.guild.id,
                interaction.options.getString("author", true),
              ),
            );
            if (messages.length == 0) {
              interaction.reply({
                content: "no quotes added so far",
                ephemeral: true,
              });
            } else {
              await interaction.reply(messages[0].toString());
              messages.splice(0, 1);
              messages.forEach((message) => {
                interaction.followUp(message.toString());
              });
            }
          }
          break;
        case "random_quote":
          {
            let quote = quoter.getRandomServerQuote(
              interaction.guild.id.toString(),
            );
            if (quote != undefined) {
              interaction.reply({
                content: `> ${quote?.quote} \n-${quote?.author}`,
              });
            } else {
              interaction.reply({
                content: "no quotes were added so far",
                ephemeral: true,
              });
            }
          }
          break;
        case "random_quote_from":
          {
            let quote = quoter.getRandomAuthorQuote(
              interaction.guild.id.toString(),
              interaction.options.getString("author", true),
            );
            if (quote != undefined) {
              interaction.reply({
                content: `> ${quote?.quote} \n-${quote?.author}`,
              });
            } else {
              interaction.reply({
                content: "no quotes from this author found",
                ephemeral: true,
              });
            }
          }
          break;
        case "search_quote":
          {
            let messages: String[] = quoter.getStringsFromQuotes(
              quoter.getQuotesBySearch(
                interaction.guild.id,
                interaction.options.getString("search", true),
              ),
            );

            if (messages.length == 0) {
              interaction.reply({
                content: "no quotes added so far",
                ephemeral: true,
              });
            } else {
              await interaction.reply(messages[0].toString());
              messages.splice(0, 1);
              messages.forEach((message) => {
                interaction.followUp(message.toString());
              });
            }
          }
          break;
      }
    });
  });
  client.login(token);
}

main();
