const Discord = require('discord.js');

exports.run = async(client, message) => {
 
    message.channel.send(`**60'Dan Geriye Sayıyorum Lütfen Ticket Açınız** <a:gerisayim:1033457775424065566>`);

}
exports.conf = {
    enabled : true,
    guildOnly : false,
    aliases : [''],
    permLevel : 0
}
 
exports.help = {
    name : 'altısay',
    description : '',
    usage : '!ping'
}
