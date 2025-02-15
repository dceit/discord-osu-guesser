import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

// Example command to be used as boilerplate
// TODO: Replace with request to Base API for uptime(?)
export const commandBase = {
  prefixData: {
    name: "ping",
    aliases: ["pong"],
  },
  slashData: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  cooldown: 5000,
  ownerOnly: false,
  async prefixRun(client, message, args) {
    message.reply("Pong 🏓");
  },
  async slashRun(client, interaction) {
    interaction.reply("Pong 🏓");
  },
};
