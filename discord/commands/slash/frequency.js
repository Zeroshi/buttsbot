const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const db = require("../../../models");
const logMessage = require("../../utils/logMessage");
const defaultButt = require("../../../config/default.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("frequency")
        .setDescription("Use this command to show or change how often I buttify messages!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_GUILD)
        .addIntegerOption(option =>
            option
                .setName("value")
                .setDescription(`A new frequency to buttify messages! The lower this is, the more I'll buttify! The default is ${defaultButt.frequency}.`)
                .setMinValue(1)
        ),
    callback: async function (interaction) {
        let reply;
        const newValue = interaction.options.getInteger("value");
        await interaction.deferReply();
        const guildModel = await db.Guild.findByPk(interaction.guildId);
        if (newValue) {
            const { frequency } = await guildModel.update({ frequency: newValue });
            reply = `Buttify frequency changed to one in every \`${frequency}\` messages!`;
        }
        else {
            reply = `I buttify roughly one in every \`${guildModel.frequency}\` messages!`;
        }
        logMessage(await interaction.editReply(reply));
    }
};