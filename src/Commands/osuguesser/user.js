import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getUserByQuery, getUserByBanchoID } from '../../Helpers/api.js';

export const commandBase = {
  prefixData: {
    name: "user",
    aliases: [],
  },
  slashData: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Search for an osu! user on osu!guessr.")
    .addStringOption(option =>
      option.setName('username')
        .setDescription('Enter the osu! username or query to search for')
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
            const embed = new EmbedBuilder()
              .setColor(user.special_badge_color != null ? user.special_badge_color : "#7348c7")
              .setTitle(`${user.username} statistics :bar_chart:`)
              .setDescription(`${user.username} osu!guessr statistics!`)
              .setTimestamp()
              .setFooter({ text: "Created by deceit!" })
              .setThumbnail(user.avatar_url)

            const { modeRanks } = user.ranks;
            const { globalRank } = user.ranks;

            embed.addFields({
              name: `Global`,
              value: `Classic rank \`#${globalRank.classic}\` - Death rank \`#${globalRank.death}\``,
              inline: false,           
            })

            embed.addFields({
              name: `Background`,
              value: `Classic rank \`#${modeRanks.background.classic}\` - Death rank \`#${modeRanks.background.death}\``,
              inline: false,
            })

            embed.addFields({
              name: `Audio`,
              value: `Classic rank \`#${modeRanks.audio.classic}\` - Death rank \`#${modeRanks.audio.death}\``,
              inline: false,
            })

            embed.addFields({
              name: `Skin`,
              value: `Classic rank \`#${modeRanks.skin.classic}\` - Death rank \`#${modeRanks.skin.death}\``,
              inline: false,
            })

            return interaction.reply({ embeds: [embed] });
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
