const { MessageEmbed, Permissions } = require("discord.js");
const { Collection } = require('discord.js');
const schema = require('../../models/custom-cmds');
const blacklist = require('../../models/blacklist');
const ownerlist = require('../../models/ownerlist');
const profil = require('../../models/profils');
const random = require("random");
const { EMOTEMBED: defaults } = require("../../config.js");

module.exports = async (client, message) => {
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;

  const settings = await client.getGuild(message.guild);
  
  //BLACKLIST SYSTEME
  blacklist.findOne({ id: message.author.id }, async(err, data) => {
    if(err) throw err;
    if(data) {
      return;
    } else {
      //XP SYSTEME
      if(settings.modxp == true) {
        profil.findOne({
          guildID: message.guild.id, userID: message.author.id
        }, async (err, data) => {
          if(err) throw err;
          if(!data) {
            data = new profil({
              guildID: message.guild.id,
              userID: message.author.id,
              level: 0,
              xp: 0,
              total_xp: 0,
              last_message: 0,
            });
          } else {
            if(Date.now() - data.last_message > 60000) {
              let randomXP = random.int(15, 25);
              data.xp += randomXP;
              data.total_xp += randomXP;
              data.last_message = Date.now();
              const xpToNext = 5 * Math.pow(data.level, 2) + 5 * data.level + 100;
              if(data.xp >= xpToNext){
                data.level++
                data.xp = data.xp - xpToNext;
                message.channel.send(`GG ${message.author}, tu passes level ${data.level} !`)
              }
            }
            data.save().catch(err => console.log(err))
          }
        })
      }
      //------------------------------------------------------
      if (!message.content.startsWith(settings.prefix)) return;
      const args = message.content.slice(settings.prefix.length).split(/ +/);
      const commandName = args.shift().toLowerCase();

      const data = await schema.findOne({ guildID: message.guild.id, command: commandName});
      if(data) message.channel.send(data.response);
      const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
      if (!command) return;

      /*const settingso = await client.getOwner(message.author.id);
      console.log(settingso.id)*/
      const dataow = await ownerlist.find({ guildID: message.guild.id });
      const owliste = dataow.map(user => user.id);
      let users = message.author.id;
      const verifow = owliste.indexOf(users) > -1

      const embedowner = new MessageEmbed()
        .setColor(defaults.wcolor)
        .setDescription(`${defaults.warning} Hop hop hop ! Seul les owners peuvent utiliser cette commande`)
      if (command.help.owner && verifow == false) return message.reply({ embeds: [embedowner] });

      const embedperm = new MessageEmbed()
        .setColor(defaults.wcolor)
        .setDescription(`${defaults.warning} Tu n'as pas la permission d'éxecuter cette commande !`)
      if (command.help.perm && !message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embedperm] });

      if(command.help.modrole && message.author.id !== message.guild.ownerID && !message.member.permissions.has('ADMINISTRATOR')){
        const embedmodrole = new MessageEmbed()
          .setColor(defaults.wcolor)
          .setDescription(`${defaults.warning} Tu n'as pas la permission d'éxecuter cette commande !`)
        if (!message.member.roles.cache.has(settings.modrole)) return message.reply({ embeds: [embedmodrole] });
      }

      const embedargs = new MessageEmbed()
        .setColor(defaults.rcolor)
        .setDescription(`${defaults.erreur} Voici comment utiliser la commande: \`${settings.prefix}${command.help.name} ${command.help.usage}\` !`)
      if (command.help.args && !args.length) {
        if (command.help.usage) return message.reply({ embeds: [embedargs] });
      };

      if(!client.cooldowns.has(command.help.name)) {
        client.cooldowns.set(command.help.name, new Collection());
      }

      const timeNow = Date.now();
      const tStamps = client.cooldowns.get(command.help.name);
      const cdAmount = (command.help.cooldown || 5) * 1000;
      //console.log(client.cooldowns);

      if (tStamps.has(message.author.id)) {
        const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;

        if (timeNow < cdExpirationTime) {
          timeLeft = (cdExpirationTime - timeNow) / 1000;
          const embedcd = new MessageEmbed()
            .setColor(defaults.rcolor)
            .setDescription(`${defaults.erreur} Merci d'attendre \`${timeLeft.toFixed(0)}\` seconde(s) avant de ré-utiliser la commande \`${command.help.name}\` !`)
          return message.reply({ embeds: [embedcd] });
        }
      }

      tStamps.set(message.author.id, timeNow);
      setTimeout(() => tStamps.delete(message.author.id), cdAmount);

      command.run(client, message, args);
    }
  })
  //-----------------------------------------------
};