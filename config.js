const { Client } = require('discord.js');

module.exports = {

  TOKEN: "NzgwODUxNDU4NDgzNjgzMzc4.X71Glw.eDFdycu0WaXbh-jYq3QYms13DXU",
  ID: "766043808672383026",
  DBCONNECTION: "mongodb+srv://flashroot:iO3qqLu4td@rdc.347bi.mongodb.net/rdcsupport?retryWrites=true&w=majority",

  GUILDSETTINGS: {
    prefix: "$",
  },

  LOGSETTINGS: {
    ticketlog: false,
    logchannel: "",
  },

  EMOTEMBED: {
    dcolor: '#ad5bff',
    vcolor: '#5fca23',
    rcolor: '#b12320',
    wcolor: '#f15d4a',
    lcolor: '#4554F4',
    succes: '<:succes:880794764612624394>',
    erreur: '<:erreur:880794764620988467>',
    warning: '<a:interdit:880794764746817566>',
    log: '<a:alert:880794764872663100>'
  }
}

// eval client.emit("guildCreate", message.guild);