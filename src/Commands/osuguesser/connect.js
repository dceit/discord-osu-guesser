import { EmbedBuilder, PermissionsBitField } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getUserByQuery, getUserByBanchoID } from '../../Helpers/api.js';

/*
  TODO:
    Implement custom oAuth authentication rather than
    trusting who the user is.

  TODO:
    Removal of roles when new connection is made?

  TODO:
    Move away from traditional try {} catch{}, this
    always comes off as really hacky for me...
    Why not handle errors myself instead of letting them
    happen in the first place...
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
            const { guild } = interaction
            const { badges } = user

            for(let badge of badges) {
              let role = guild.roles.cache.find(r => r.name === badge.name)

              if (!role) {
                // If the role doesn't exist, create it
                try {
                  role = await guild.roles.create({
                    name: badge.name,
                    color: badge.color,
                    reason: `Created role for ${badge.name} badge.`,
                  })
                } catch (error) {
                  return interaction.reply(`An error occurred while creating the ${badge.name} role.`)
                }
              }

              const member = await guild.members.fetch(interaction.user.id);

              // Hacky logic for assigning roles. This should be better...
              try {
                await member.roles.add(role);
              } catch (error) {
                return interaction.reply(`An error occurred while assigning the ${badge.name} role.`);
              }
            }

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
