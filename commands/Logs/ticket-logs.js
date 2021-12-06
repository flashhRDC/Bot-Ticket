const { MessageEmbed, Message } = require("discord.js");
const { EMOTEMBED: defaults } = require("../../config.js");
const logs = require('../../models/logs');

module.exports.run = async (client, message, args) => {
  const settings = await client.getLogs(message.guild);

  const option = new MessageEmbed()
    .setColor(defaults.rcolor)
    .setDescription(`${defaults.erreur} Veuillez entrer une option valide \`on\` ou \`off\` !`)
  const channels = new MessageEmbed()
    .setColor(defaults.rcolor)
    .setDescription(`${defaults.erreur} Veuillez entrer un salon valide !`)
  const off = new MessageEmbed()
    .setColor(defaults.vcolor)
    .setDescription(`${defaults.succes} Les logs de modération on été désactivé !`)
  const aoff = new MessageEmbed()
    .setColor(defaults.rcolor)
    .setDescription(`${defaults.erreur} Les logs de modération sont déjà désactivé !`)

  let toggling = ["off", "on"];
  if (!toggling.includes(args[0])){
    return message.reply({ embeds: [option] });
  }

  if (args[0] === "on"){
    let channel = message.mentions.channels.first();
    if (!channel) return message.reply({ embeds: [channels] })

    await client.updateLogs(message.guild, {
      modlog: true,
      modchannel: channel.id
    })

    const on = new MessageEmbed()
      .setColor(defaults.vcolor)
      .setDescription(`${defaults.succes} Les logs de modération on été activé dans le salon <#${channel.id}>.`)

    return message.channel.send({ embeds: [on] })
  }

  if (args[0] === "off"){
    let toggle = settings.logs;
    if (!toggle || toggle == false) return message.reply({ embeds: [aoff] })

    await client.updateLogs(message.guild, {
      modlog: false,
      modchannel: ""
    })
    return message.channel.send({ embeds: [off] })
  }
};

module.exports.help = {
  name: "modlog",
  aliases: [''],
  category: 'logs',
  description: "Permet d'activer ou de désactiver les logs de modération",
  cooldown: 5,
  usage: '<on/off> <salon>',
  args: false,
  perm: true
};
