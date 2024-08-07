import { GuildMember, Message } from "discord.js";
import { IContextMenuInteraction } from "../../structures/interfaces";
import PermissionHandler from "../../util/PermissionHandler";
import { validateSuggestion, editSuggestion } from "../../util/suggestion";
import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandType } from "discord-api-types/v10";

const event: IContextMenuInteraction = {
  run: async (client, interaction) => {
    if (!interaction.isMessageContextMenu() || !interaction.inGuild() || !(interaction.member instanceof GuildMember)) return;

    if (!PermissionHandler.isAdmin(interaction.member)) {
      interaction.reply({ content: "You lack ADMIN permission MORON", ephemeral: true });
      return;
    }

    const message = interaction.targetMessage;
    if (!(message instanceof Message)) return;

    if (!validateSuggestion(client, message)) {
      interaction.reply({ content: "Message is not a suggestion", ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    editSuggestion(message, interaction.member, "ACCEPT").then(() => interaction.editReply({ content: `Suggestion accepted` }));
  },
  data: new ContextMenuCommandBuilder().setName("Accept Suggestion").setType(ApplicationCommandType.Message),
};

export default event;
