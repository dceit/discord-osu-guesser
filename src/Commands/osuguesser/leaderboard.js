import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getLeaderBoardData } from '../../Helpers/api.js';

export const commandBase = {
  prefixData: {
    name: "",
    aliases: [],
  },
  slashData: new SlashCommandBuilder()
    .setName("leaderboards")
    .setDescription("Fetch global leaderboards!")
    .addStringOption(option =>
      option.setName('variant')
        .setDescription('Choose a variant')
        .setRequired(true)
        .addChoices(
          { name: 'Classic', value: 'classic' },
          { name: 'Death', value: 'death' }
        )
    )
    .addStringOption(option =>
      option.setName('mode')
        .setDescription('Choose a mode')
        .setRequired(true)
        .addChoices(
          { name: 'Skin', value: 'skin' },
          { name: 'Background', value: 'background' },
          { name: 'Audio', value: 'audio' }
        )
    ),
  cooldown: 5000,
  ownerOnly: false,

  async prefixRun(client, message, args) { },

  async slashRun(client, interaction) {
    const variant = interaction.options.getString('variant');
    const mode = interaction.options.getString('mode');
    const leaderboard = await getLeaderBoardData(mode, variant);

    if(leaderboard == null || typeof leaderboard == "string") {
      return interaction.reply("Something is broken.");
    }

    if(leaderboard.length == 0) {
      return interaction.reply("No one listed on leaderboards currently.")
    }

    const embed = new EmbedBuilder()
      .setColor("#7348c7")
      .setTitle("Global Leaderboard")
      .setDescription("Here are the top guessers!")
      .setTimestamp()
      .setFooter({ text: "Created by deceit!" })
      .setThumbnail(leaderboard[0].avatar_url)

    leaderboard.forEach((entry, index) => {
      let honorific = `${index + 1}. `
      let statEntries = []

      switch((index + 1)) {
      case 1:
        honorific = ':crown: '
        break;
      case 2:
        honorific = ':second_place: '
        break;
      case 3:
        honorific = ':third_place: '
        break;
      }

      switch(variant) {
      case 'death':
        statEntries.push(`\`${entry.highest_streak}x\` Highest Streak`)
        statEntries.push(`\`${entry.games_played}\` Games`)
        break;
      case 'classic':
        statEntries.push(`\`${entry.highest_score}\` High Score`)
        statEntries.push(`\`${entry.games_played}\` Games`)
        statEntries.push(`\`${entry.total_score}\` Total`)
        break;
      }

      embed.addFields({
        name: `${honorific}${entry.username}`,
        value: statEntries.join(' - '),
        inline: false,
      });
    });

    return interaction.reply({ embeds: [embed] });
  },
};
