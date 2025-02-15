import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getGlobalStats } from "../../Helpers/api.js";

export const commandBase = {
  prefixData: {
    name: "stats",
    aliases: [""],
  },
  slashData: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Get global game statistics!"),
  cooldown: 5000,
  ownerOnly: false,
  async prefixRun(client, message, args) {},
  async slashRun(client, interaction) {
    await getGlobalStats()
      .then((response) => {
        const { highest_points, total_games, total_users } = response;

        const embed = new EmbedBuilder()
          .setColor("#7348c7")
          .setTitle(`Global game statistics`)
          .setDescription(`Global osu!guessr statistics!`)
          .setTimestamp()
          .setFooter({ text: "Created by deceit!" })
          .setThumbnail("https://osuguessr.com/favicon.png");

        embed.addFields({
          name: `Highest points`,
          value: `\`${highest_points || 0}\``,
          inline: false,
        });

        embed.addFields({
          name: `Total games played`,
          value: `\`${total_games || 0}\``,
          inline: false,
        });

        embed.addFields({
          name: `Total users registered`,
          value: `\`${total_users || 0}\``,
          inline: false,
        });

        return interaction.reply({ embeds: [embed] });
      })
      .catch((error) => {
        console.log(123123, error);
        return interaction.reply(error);
      });
  },
};
