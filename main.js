const fs = require('fs');
const Discord = require("discord.js");
const { Client, Intents } = require('discord.js');
const client = new Client({ 
partials:
   [
     "CHANNEL"
    ],
intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_BANS,
  Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  Intents.FLAGS.GUILD_INTEGRATIONS,
  Intents.FLAGS.GUILD_WEBHOOKS,
  Intents.FLAGS.GUILD_INVITES,
  Intents.FLAGS.GUILD_VOICE_STATES,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_MESSAGE_TYPING,
  Intents.FLAGS.DIRECT_MESSAGES,
  Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  Intents.FLAGS.GUILD_SCHEDULED_EVENTS
] 
});
const db = require('quick.db');
const ms = require("parse-ms");
const moment = require("moment");
const ayarlar = require("./ayarlar.json");
const express = require('express');
const { VoiceConnectionStatus , joinVoiceChannel } = require('@discordjs/voice');
/////
const app = express()
app.get('/', (req, res) => res.send("Bot Aktif"))
//////////////////

client.on("messageCreate", message => {
  let client = message.client;
  if (message.author.bot) return;
  let prefix = ayarlar.prefix
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(' ')[0].slice(prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.yetkiler(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
   try {
  if (!cmd) return
  cmd.run(client, message, params, perms); 
  } catch(error) {
     console.log(error)
    }
  }
})


client.on("ready", () => {
  console.log(`Bütün komutlar başarıyla yüklendi!`);
  client.user.setStatus("online");
  client.user.setActivity(ayarlar.botDurum);
})


const log = message => {
  console.log(`${message}`);
};


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  files.forEach(f => {
    fs.readdir("./komutlar/" + f, (err2, files2) => {
      if (err2) console.log(err2)
      files2.forEach(file => {
    let props = require(`./komutlar/${f}/` + file);
    log(`Yüklenen komut ismi: ${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
   });
  });
 });
});

client.yetkiler = message => {
  if(!message.guild) {
	return; }
  let permlvl = -ayarlar.varsayilanperm  ;
  if(message.member.permissions.has("MANAGE_MESSAGES")) permlvl = 1;
  if(message.member.permissions.has("KICK_MEMBERS")) permlvl = 2;
  if(message.member.permissions.has("BAN_MEMBERS")) permlvl = 3;
  if(message.member.permissions.has("MANAGE_GUILD")) permlvl = 4;
  if(message.member.permissions.has("ADMINISTRATOR")) permlvl = 5;
  if(message.author.id === message.guild.ownerID) permlvl = 6;
  if(message.author.id === ayarlar.sahip) permlvl = 7;
  return permlvl;
};

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;  
  let i = await db.fetch(`reklamFiltre_${msg.guild.id}`)
    if (i == 'acik') {
              const reklam = ["https://","http://","discord.gg",".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".net", ".rf.gd", ".az", ".party", "discord.gg"];
              if (reklam.some(word => msg.content.toLowerCase().includes(word))) {
                  if (!msg.member.permissions.has("MANAGE_GUILD")) {
               try { msg.delete();} catch(err) {}
                    return msg.channel.send({embeds:[
                       new Discord.MessageEmbed()
                       .setColor('BLUE')
                       .setDescription(`<@${msg.author.id}> __**link atmak yasak!**__ ${client.emojis.cache.get(ayarlar.kizgin)}`)]}).then((message) => setTimeout(() => message.delete(), 6000)).catch(error => {});
                  }
              }

} if (!i) return; 

})
          client.on("messageUpdate", async (oldMessage, newMessage) => {
            if (oldMessage.author.bot) return;
            let i = await db.fetch(`reklamFiltre_${oldMessage.guild.id}`)
            if (i == 'acik') {      
            const reklam = ["https://","http://","discord.gg",".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".net", ".rf.gd", ".az", ".party", "discord.gg"];
                   if (reklam.some(word => newMessage.content.includes(word))) {
                       if (!oldMessage.member.permissions.has("MANAGE_GUILD")) {
               try { oldMessage.delete();} catch(err) {}

                                 return oldMessage.channel.send({embeds:[
                                  new Discord.MessageEmbed()
                       .setColor('BLUE')
                       .setDescription(`<@${oldMessage.author.id}> __**link atmak yasak!**__ ${client.emojis.cache.get(ayarlar.kizgin)}`)]}).then((message) => setTimeout(() => message.delete(), 6000)).catch(error => {});
                                 }

                   }
           } if (!i) return; 
          });


          client.on("messageCreate", async msg => {
            if (msg.author.bot) return;
            let i = await db.fetch(`${msg.guild.id}.kufur`)
            if (i == 'acik') {
            const kufur = ["amk", "ananı sikiyim", "ananıskm", "piç", "amk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "yarrak", "amcık", "yarram", "sikimi ye", "amq"];
                        if (kufur.some(word => msg.content.toLowerCase().includes(word))) {
                            if (!msg.member.permissions.has("BAN_MEMBERS")) {
               try { msg.delete();} catch(err) {}
                              return msg.channel.send({embeds:[
                                new Discord.MessageEmbed()
                       .setColor('BLUE')
                       .setDescription(`<@${msg.author.id}> __**küfür etmek yasak!**__ ${client.emojis.cache.get(ayarlar.kizgin)}`)]}).then((message) => setTimeout(() => message.delete(), 6000)).catch(error => {});
                            }

                        }
          } if (!i) return; 
        })
                    client.on("messageUpdate", async (oldMessage, newMessage) => {
                      if (oldMessage.author.bot) return;
                      let i = await db.fetch(`${oldMessage.guild.id}.kufur`)
                      if (i == 'acik') {
                      const kufur = ["amk", "ananı sikiyim", "ananıskm", "piç", "amk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "yarrak", "amcık", "yarram", "sikimi ye", "amq"];
                             if (kufur.some(word => newMessage.content.includes(word))) {
                                 if (!oldMessage.member.permissions.has("BAN_MEMBERS")) {
               try { oldMessage.delete();} catch(err) {}

                                           return oldMessage.channel.send({embeds:[
                                            new Discord.MessageEmbed()
                                            .setColor('BLUE')
                                            .setDescription(`<@${oldMessage.author.id}> __**küfür etmek yasak!**__ ${client.emojis.cache.get(ayarlar.kizgin)}`)]}).then((message) => setTimeout(() => message.delete(), 6000)).catch(error => {});
                                           }

                             }
                   
                   } if(!i) return; 
                  });


client.on("messageCreate", async msg => {
  if (msg.author.bot) return;
  const i = await db.fetch(`ssaass_${msg.guild.id}`);
  if (i == 'acik') {    
  if (msg.content.toLowerCase() == 'sa' || msg.content.toLowerCase() == 's.a' || msg.content.toLowerCase() == 'selamun aleyküm' || msg.content.toLowerCase() == 'sea'|| msg.content.toLowerCase() == 'selam') {
          try {

                  return msg.reply(
                     `Aleyküm Selam kardeşim, Hoşgeldin ${client.emojis.cache.get(ayarlar.yildiz)}`)
          } catch(err) {
          }
      }
    }if(!i) return;
  });



      client.on("messageCreate", async msg => {
        if (msg.author.bot) return;
        const i = await db.fetch(`${msg.guild.id}_caps`);
        if (i == 'acik') {
        let x = /\w*[A-Z]\w*[A-Z]\w*/g;
    if (msg.content.match(x)) {
      if (!msg.member.permissions.has("KICK_MEMBERS")) {
               try { msg.delete();} catch(err) {}
        return msg.channel.send({embeds:[
          new Discord.MessageEmbed()
         .setColor('BLUE')
        .setDescription(`<@${msg.author.id}> __**Caps-lock yasak!**__ ${client.emojis.cache.get(ayarlar.kizgin)}`)]}).then((message) => setTimeout(() => message.delete(), 6000)).catch(error => {});
      }
    }
  } if(!i) return;
})
  client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    const i = await db.fetch(`${oldMessage.guild.id}_caps`);
    if (i == 'acik') {
    let x = /\w*[A-Z]\w*[A-Z]\w*/g;
    if (newMessage.content.match(x)) {
      if (!oldMessage.member.permissions.has("KICK_MEMBERS")) {
               try { oldMessage.delete();} catch(err) {}
        return oldMessage.channel.send({embeds:[
          new Discord.MessageEmbed()
         .setColor('BLUE')
        .setDescription(`<@${oldMessage.author.id}> __**Caps-lock yasak!**__ ${client.emojis.cache.get(ayarlar.kizgin)}`)]}).then((message) => setTimeout(() => message.delete(), 6000)).catch(error => {});
      }
    }
    } if(!i) return; 
  })
   
   
   
   


    client.on("messageCreate", async msg => {
      const request = require("node-superfetch");
      const db = require("quick.db");
        if (db.has(`lvll_${msg.guild.id}`) === true) {
          let memberChannel = await db.fetch(`sk_${msg.guild.id}`);
          
          let level =  await db.fetch(`seviye_${msg.author.id + msg.guild.id}`)
          
          if (msg.channel.type === "dm") return;
          if (msg.author.bot) return;
    
          if (msg.content.length > 40) {
            db.add(`puancik_${msg.author.id + msg.guild.id}`, 4);
          }
          if (msg.content.length > 35) {
            db.add(`puancik_${msg.author.id + msg.guild.id}`, 4);
          }
          if (msg.content.length > 30) {
            db.add(`puancik_${msg.author.id + msg.guild.id}`, 3);
          }
          if (msg.content.length > 25) {
            db.add(`puancik_${msg.author.id + msg.guild.id}`, 3);
          }
          if (msg.content.length > 20) {
            db.add(`puancik_${msg.author.id + msg.guild.id}`, 2);
          }
          if (msg.content.length > 15) {
            db.add(`puancik_${msg.author.id + msg.guild.id}`, 2);
          }
          if (msg.content.length > 10) {
            db.add(`puancik_${msg.author.id + msg.guild.id}`, 1);
          }
          if (msg.content.length < 5) {
            db.add(`puancik_${msg.author.id + msg.guild.id}`, 1);
          }
          if (db.fetch(`puancik_${msg.author.id + msg.guild.id}`) > 250) {
            db.add(`seviye_${msg.author.id + msg.guild.id}`, 1);
            if (memberChannel) {
              if (db.has(`üyelikk_${msg.author.id}`)) {
                msg.guild.channels
                  .cache.get(memberChannel)
                  .send(
                    `${client.emojis.cache.get(ayarlar.maviyildiz)} Kral <@${
                      msg.author.id
                    }>, Seviye atladın ve \`${db.fetch(
                      `seviye_${msg.author.id + msg.guild.id}`
                    )}\` seviye oldun!`
                  );
              } else
                msg.guild.channels
                  .cache.get(memberChannel)
                  .send(
                    `Tebrik ederim <@${
                      msg.author.id
                    }>! Seviye atladın ve \`${db.fetch(
                      `seviye_${msg.author.id + msg.guild.id}`
                    )}\` seviye oldun!`
                  );
            } else if (db.has(`üyelikk_${msg.author.id}`)) {
              msg.channel.send(
                `${client.emojis.cache.get(ayarlar.maviyildiz)} Kral <@${
                  msg.author.id
                }>, Seviye atladın ve \`${db.fetch(
                  `seviye_${msg.author.id + msg.guild.id}`
                )}\` seviye oldun!`
              );
            } else
              msg.channel.send(
                `Tebrik ederim <@${msg.author.id}>! Seviye atladın ve \`${db.fetch(
                  `seviye_${msg.author.id + msg.guild.id}`
                )}\` seviye oldun!`
              );
    
            db.delete(`puancik_${msg.author.id + msg.guild.id}`);
          }
        } else return;
    });



    client.on("messageCreate", async message => {

     if (message.author.bot) return;
      if (!message.guild) return;
      if (message.content.includes(`.afk`)) return;
    
      if (await db.fetch(`afk_${message.author.id}`)) {
        db.delete(`afk_${message.author.id}`);
        db.delete(`afk_süre_${message.author.id}`);
        message
          .channel.send(`${client.emojis.cache.get(ayarlar.mavitik)} Afk sistemi sıfırlandı`)
          .then((msg) => setTimeout(() => msg.delete(), 6000)).catch(error => {});
      }
    
      var USER = message.mentions.users.first();
      if (!USER) return;
      var REASON = await db.fetch(`afk_${USER.id}`);
    
      if (REASON) {
        let süre = await db.fetch(`afk_süre_${USER.id}`);
        let timeObj = ms(Date.now() - süre);
        if (db.has(`üyelikk_${USER.id}`)) {
          message.delete();
          const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
    
            .setDescription(
              `${client.emojis.cache.get(ayarlar.maviyildiz)} \`${USER.tag}\` Adlı Gold üyeyi rahatsız edemezsiniz. ${client.emojis.cache.get(ayarlar.maviyildiz)}\nAFK süresi: \`${timeObj.hours}\`** saat** \`${timeObj.minutes}\`** dakika** \`${timeObj.seconds}\` ** saniye**\nSebep:\n\`${REASON}\``
            );
    
          message.channel.send({embeds:[embed]}).then((msg) => setTimeout(() => msg.delete(), 6000)).catch(error => {});
        } else
          message.channel
            .send(
              `\`${USER.tag}\` kullanıcısı AFK\nAFK süresi: \`${timeObj.hours}\`** saat** \`${timeObj.minutes}\`** dakika** \`${timeObj.seconds}\` ** saniye**\nSebep:\n\`${REASON}\` `
            )
            .then((msg) => setTimeout(() => msg.delete(), 6000)).catch(error => {});
      }
    });

    client.on("ready", () => {
      const channel = client.channels.cache.get(ayarlar.sesKanalı)
      const connection = joinVoiceChannel({
        channelId: ayarlar.sesKanalı,
        guildId: ayarlar.sunucuID,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false
      })
      connection.on(VoiceConnectionStatus.Ready, () => {
        console.log('Bot başarıyla sese giriş yaptı!');
      });
    }) 

    client.on("messageCreate", (message) => { 
  
    const xdxd1 = message.author.id
      const goldUyeler1 = db.has(`üyelikk_${message.author.id}`)
      const goldUyeler = goldUyeler1
      if(db.has(`üyelikk_${message.author.id}`)  && (!db.has(`goldbildirim.${message.author.id}`) || (db.get(`goldbildirim.${message.author.id}`) + (1 * 60 * 60 * 1000)) < Date.now())) {
        const embed = new Discord.MessageEmbed()
        .setDescription(`${client.emojis.cache.get(ayarlar.gold)}Sıkı Durun Bir Gold Üye Belirdi <@${message.author.id}>`)
        .setColor('GOLD');
        message.channel.send({embeds:[embed]}).then((msg) => setTimeout(() => msg.delete(), 5000)).catch(error => {});
        db.set(`goldbildirim.${message.author.id}`, Date.now());
    };
  });

  client.on("messageDelete", async message => {
    if (message.author.bot) return; 
    let mesajlog = db.fetch(`mesajlog_${message.guild.id}`)
    if(!mesajlog) return;
    const embed2 = new Discord.MessageEmbed()
    .setTitle('Bir mesaj silindi!')
    .setDescription(`${client.emojis.cache.get(ayarlar.duyuru)} __**Silen kişi**__: <@${message.author.id}> \n${client.emojis.cache.get(ayarlar.zil)} __**Silinen Kanal**__: <#${message.channel.id}> \n${client.emojis.cache.get(ayarlar.toplar)} __**Silinen mesaj**__: ${message.content}`)
    .setColor('RANDOM')
   client.channels.cache.get(mesajlog).send({embeds:[embed2]})
  })

  //
  client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (oldMessage.author.bot) return; 
    let mesajlog = db.fetch(`mesajlog_${oldMessage.guild.id}`)
    if(!mesajlog) return;
    if(oldMessage.author.bot) return;
    const embed = new Discord.MessageEmbed()
    .setTitle('Bir mesaj düzenlendi!')
    .setDescription(`${client.emojis.cache.get(ayarlar.duyuru)} __**Düzenleyen kişi**__: <@${oldMessage.author.id}> \n${client.emojis.cache.get(ayarlar.zil)} __**Düzenlenen Kanal**__: <#${oldMessage.channel.id}> \n${client.emojis.cache.get(ayarlar.toplar)} __**Düzenlenen mesaj**__: ${oldMessage.content} \n${client.emojis.cache.get(ayarlar.toplar)} __**Yeni Mesaj**__: ${newMessage.content}`)
    .setColor('RANDOM')
    client.channels.cache.get(mesajlog).send({embeds:[embed]})
  });

  client.on("guildMemberAdd", member => {
    var kanal = db.fetch(`sayaçkanal.${member.guild.id}`)
    var kanalcık = member.guild.channels.cache.get(kanal)
    if(!kanalcık) return;
    var hedef = db.fetch(`sayaçhedef.${member.guild.id}`)
    if(!hedef) return;
    kanalcık.send(`:loudspeaker::inbox_tray: Kullanıcı Katıldı! \`${hedef}\` Kişi Olmamıza \`${hedef - member.guild.memberCount}\` Kişi Kaldı \`${member.guild.memberCount}\` Kişiyiz! ${client.emojis.cache.get(ayarlar.gir)} \`${member.user.tag}\``)

  })

  client.on("guildMemberRemove", member => { 
    var kanal = db.fetch(`sayaçkanal.${member.guild.id}`)
    var kanalcık = member.guild.channels.cache.get(kanal)
    if(!kanalcık) return;
    var hedef = db.fetch(`sayaçhedef.${member.guild.id}`)
    if(!hedef) return;
    kanalcık.send(`:loudspeaker::outbox_tray: Kullanıcı Ayrıldı. \`${hedef}\` Kişi Olmamıza \`${hedef - member.guild.memberCount}\` Kişi Kaldı \`${member.guild.memberCount}\` ${client.emojis.cache.get(ayarlar.cik)} \`${member.user.tag}\``)
  })

  client.on("guildMemberAdd", member => {
    var kanal = db.fetch(`otorol-kanal.${member.guild.id}`)
    var kanalcık = member.guild.channels.cache.get(kanal)
    if(!kanalcık) return;
    var rol = db.fetch(`otorol-rol.${member.guild.id}`)
    if(!rol) return;
    member.roles.add(rol)
    kanalcık.send(`${client.emojis.cache.get(ayarlar.gir)} **${member.user.tag}** Sunucuya katıldı otomatik rol verildi! Hoş geldin <@!${member.user.id}>`)
  }) 

client.on("guildMemberAdd", member => {
   
    const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor({
                name: member.displayName, 
                iconURL: client.user.displayAvatarURL({	dynamic: true,	})	})
            .setTimestamp()
    
    if(db.get(`jailed_${member.id}`)) {
     member.roles.add(ayarlar.jailRol) 
   member.guild.channels.cache.get(ayarlar.jailLog).send({ embeds: [
        embed.setDescription(`Birisi karantinaya atıldı!
         
         ${client.emojis.cache.get(ayarlar.duyuru)} Kullanıcı: ${member ? member.toString() : ""} - \`(${member.id})\`
        ${client.emojis.cache.get(ayarlar.toplar)} **Sebep**: \`Jailli iken çık-gir yapmak\`      
        `)]}) 
    member.guild.channels.cache.get(ayarlar.kayıtLog).send(`${client.emojis.cache.get(ayarlar.toplar)} <@${member.id}> adlı kullanıcı jailli iken çık-gir yaptığı için jaile atıldı!`)
    } else return;
  })

client.login(ayarlar.token)

//sunucudan çıkan ban
client.on('guildMemberRemove', member => {
  const channel = client.channels.cache.get('1033416931409141801');// hangi kanala mesaj gönderecek
  channel.send(`${member} sunucudan çıkış sağladı. Yasaklanmasını istiyorsanız \`👍\` tepkisine tıklayın.`).then(sent => {
    sent.react('👍').then(() => sent.react('👎'));
    sent.awaitReactions((reaction, user) => member.guild.members.cache.get(user.id).hasPermission('BAN_MEMBERS') && !user.bot, { max: 1, time: 60000, errors: ['time' ]}).then(collected => {
      collected = collected.first();
      if(collected.emoji.name == '👍') {
        member.guild.members.ban(member.user.id);
        sent.reactions.removeAll();
        return channel.send(`${member}, ${collected.users.cache.filter(a => a.id !== client.user.id).first()} tarafından yasaklandı.`);
      } else {
        sent.reactions.removeAll();
        return channel.send(`${member} için yasaklama işlemi iptal edildi.`);
      };
    });   
  });
});