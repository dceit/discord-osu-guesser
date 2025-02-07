import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getUserByQuery, getUserByBanchoID } from '../../Helpers/api.js';

/*
  TODO:
    Implement custom oAuth authentication rather than
    trusting who the user is.
*/

export const commandBase = {
  prefixData: {
    name: "connect",
    aliases: [],
  },
  slashData: new SlashCommandBuilder()
    .setName("connect")
    .setDescription("Search for an osu! user on osu!guessr.")
    .addStringOption(option =>
      option.setName('username')
        .setDescription('Enter the osu! username or query to connect your account to')
        .setRequired(true)
    ),
  cooldown: 5000,
  ownerOnly: false,

  async prefixRun(client, message, args) { },

  async slashRun(client, interaction) {
    const query = interaction.options.getString('username');

    if(query == null || typeof query != "string") {
      return interaction.reply("User argument has not been supplied, something went wrong.")
    }

    await getUserByQuery(query)
      .then(async response => {
        await getUserByBanchoID(response.bancho_id)
          .then(async user => {
            console.log(user)
            return interaction.reply(`Connected to account https://osu.ppy.sh/u/${user.bancho_id}`);
          })
          .catch(() => {
            return interaction.reply(error)
          })
      })
      .catch(error => {
        return interaction.reply(error)
      })
  },
};
