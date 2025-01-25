const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Select a member and kick them.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const member = interaction.options.getMember('target');
        if (!member) {
            return interaction.reply({ content: 'That user is not in the server!', ephemeral: true });
        }

        try {
            await member.kick();
            await interaction.reply({ content: `${member.user.tag} has been kicked.` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'I was unable to kick the member.', ephemeral: true });
        }
    },
};
