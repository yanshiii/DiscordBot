// const { Events, Collection, MessageFlags } = require('discord.js');

// module.exports = {
//     name: Events.InteractionCreate,
//     async execute(interaction) {
//         if (!interaction.isChatInputCommand()) return;

//         const command = interaction.client.commands.get(interaction.commandName);
//         if (!command) return;

//         // Ensure cooldowns collection exists
//         if (!interaction.client.cooldowns) {
//             interaction.client.cooldowns = new Collection();
//         }

//         const { cooldowns } = interaction.client;

//         if (!cooldowns.has(command.data.name)) {
//             cooldowns.set(command.data.name, new Collection());
//         }

//         const now = Date.now();
//         const timestamps = cooldowns.get(command.data.name);
//         const cooldownAmount = (command.cooldown ?? 3) * 1000; // Default 3s cooldown

//         if (timestamps.has(interaction.user.id)) {
//             const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
//             if (now < expirationTime) {
//                 const timeLeft = (expirationTime - now) / 1000;
//                 return interaction.reply({
//                     content: `⏳ Please wait ${timeLeft.toFixed(1)} seconds before using \`${command.data.name}\` again.`,
//                     ephemeral: true
//                 });
//             }
//         }
        

//         timestamps.set(interaction.user.id, now);
//         setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

//         try {
//             // Special case for 'ping' command
//             if (interaction.commandName === 'ping') {
//                 await interaction.reply('Pong!');
//                 await interaction.followUp('Pong again!');
                
//             }

//             await command.execute(interaction);
//         } catch (error) {
//             console.error(error);
//             await interaction.reply({ content: '❌ An error occurred while executing this command.', ephemeral: true });
//         }
//     },
// };

const { Events, Collection, MessageFlags } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate, // Now Events is properly imported
    async execute(interaction) {
        // Handle autocomplete interactions
        if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command || !command.autocomplete) {
                return console.error(`No autocomplete handler found for command: ${interaction.commandName}`);
            }
            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(`Error handling autocomplete for command: ${interaction.commandName}`);
                console.error(error);
            }
            return; // Exit after handling autocomplete
        }

        // Handle chat input commands
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        // Ensure cooldowns collection exists
        if (!interaction.client.cooldowns) {
            interaction.client.cooldowns = new Collection();
        }

        const { cooldowns } = interaction.client;

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const cooldownAmount = (command.cooldown ?? 3) * 1000; // Default 3s cooldown

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({
                    content: `⏳ Please wait ${timeLeft.toFixed(1)} seconds before using \`${command.data.name}\` again.`,
                    ephemeral: true
                });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            // Special case for 'ping' command
            if (interaction.commandName === 'ping') {
                await interaction.reply('Pong!'); // First reply
                await interaction.followUp('Pong again!'); // Second reply
                return;
            }

            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: ' An error occurred while executing this command.', ephemeral: true });
        }
    },
};
