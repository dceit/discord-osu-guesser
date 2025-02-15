import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  getUserByQuery,
  getUserByBanchoID,
  getRecentGameByBanchoID,
} from "../../Helpers/api.js";

export const commandBase = {
  prefixData: {
    name: "recent",
    aliases: ["recent"],
  },
  slashData: new SlashCommandBuilder()
    .setName("recent")
    .setDescription("Find a recent game from an osu!guessr user.")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Enter the osu! username or query to search for")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("variant")
        .setDescription("Choose a variant")
        .setRequired(true)
        .addChoices(
          { name: "Classic", value: "classic" },
          { name: "Death", value: "death" },
        ),
    )
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Choose a mode")
        .setRequired(true)
        .addChoices(
          { name: "Skin", value: "skin" },
          { name: "Background", value: "background" },
          { name: "Audio", value: "audio" },
        ),
    ),
  cooldown: 5000,
  ownerOnly: false,
  async prefixRun(client, message, args) {},
  async slashRun(client, interaction) {
    const variant = interaction.options.getString("variant");
    const mode = interaction.options.getString("mode");
    const query = interaction.options.getString("username");

    return interaction.reply(
      "API under construction, endpoint is non functional right now.",
    );

    await getUserByQuery(query)
      .then(async (response) => {
        const recentGame = await getRecentGameByBanchoID(response.bancho_id);

        // TOOD:
        // Implementation has been stopped due to the endpoint returning 500 and not being functional
        // In the future, you should be taking data from recentGame and packaging it up into the embed...
        // Hoping this endpoint gets fixed soon.

        const embed = new EmbedBuilder()
          .setColor("#7348c7")
          .setTitle(`Recent game :bar_chart:`)
          .setDescription(`osu!guessr recent game!`)
          .setTimestamp()
          .setFooter({ text: "Created by deceit!" })
          .setThumbnail(user.avatar_url);

        embed.addFields({
          name: `Global`,
          value: `Classic rank`,
          inline: false,
        });

        return interaction.reply({ embeds: [embed] });
      })
      .catch((error) => {
        return interaction.reply(error);
      });
  },
};
