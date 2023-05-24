//
// this is not good code :)
//

const mineflayer = require('mineflayer')
const Discord = require('discord.js');

const config = require('./config.json')
var DB = require('./jsonPull.js');

var specifieduser, message
let channel = config.channelid

const client = new Discord.Client();

function createBot(){
    const bot = mineflayer.createBot({
        host: 'proxy.hypixel.net',
        port: '25565',
        version: '1.12.2',
        // username: config.email,
        // password: config.password,
        auth: 'microsoft',
        logErrors: true
    })
    
    console.log(`Log > I joined hypixel`)
    
    
    bot.addChatPatternSet(
        "GUILD_MESSAGE",
        [/^Guild > (?:\[(.+\+?\+?)\] )?(.+): (.+)$/],
        {
            parse: true
        }
    )
    bot.addChatPatternSet(
        "GUILD_LOGOUT",
        [/^Guild > \b(?:\ )?(.+) left./],
        {
            parse: true
        }
    )
    bot.addChatPatternSet(
        "GUILD_LOGIN",
        [/^Guild > \b(?:\ )?(.+) joined./],
        {
            parse: true
        }
    )
    bot.addChatPatternSet(
        "PARTY_MESSAGE",
        [/^Party > (?:\[(.+\+?\+?)\] )?(.+): (.+)$/],
        {
            parse: true
        }
    )
    bot.addChatPatternSet(
        "PRIVATE_MESSAGE",
        [/^From (?:\[(.+\+?\+?)\] )?(.+): (.+)$/],
        {
            parse: true
        }
    )
    bot.addChatPatternSet(
        "PARTY_ACCEPT",
        [/^(?:\[(.+\+?\+?)\] )?(.+) joined the party./],
        {
            parse: true
        }
    )
    // bot.addChatPatternSet(
    //     "GUILD_PLAYERLIST",
    //     [/-----------------------------------------------------.*?\nGuild Name: (.*)/s],
    //     {
    //         parse: true
    //     }
    // )
        
    
    function waity(seconds){
        var waitTill = new Date(new Date().getTime() + seconds * 1000);
        while(waitTill > new Date()){}
    }
    
    
    if(config.debug == "on"){
        bot.on('message', (jsonMsg) => {
            console.log(`Debug > ${jsonMsg.toString()}`)
        })
    }
    
    
    bot.on('chat:GUILD_LOGIN', ([[username]]) => {
        channel.send(`<:green:862787597809614938> ${username} joined.`)
        console.log(`Guild > ${username} logged in`)
    })
    
    bot.on('chat:GUILD_LOGOUT', ([[username]]) => {
        channel.send(`<:red:862787795151749150> ${username} left.`)
        console.log(`Guild > ${username} logged out`)
    })
            
    // bot.on('chat:PARTY_ACCEPT', ([[rank, username]]) => {
    //     if(!rank){rank = "Non"};
    //     console.log(`Log > [${rank}] ${username} joined the party`);
        
    //     bot.chat(`/pc whats up ${username}?`)
    // })
    
    // bot.on('chat:PARTY_LEAVE', ([[rank, username]]) => {
    //     if(!rank){rank = "Non"};
    //     console.log(`Log > [${rank}] ${username} left the party`);
    // })
    
    // bot.on('chat:PARTY_MESSAGE', ([[rank, username, message]]) => {
    //     if(!rank) rank || "[Non]";
    //     if(bot.username == username){return}
    //     console.log(`Party > [${rank}] ${username}: ${message}`);
        
        
    //     if (message == "bot restart" && username == owner) {
    //         bot.quit()
    //         console.log(`Log > ${username} asked me to restart`)
    //     }
    // })
    
    bot.on('chat:PRIVATE_MESSAGE', ([[rank, username, message]]) => {
        if(!rank) rank || "[Non]";
        console.log(`Private > [${rank}] ${username}: ${message}`);
        
        if (message == "hi") {
            bot.chat(`/msg ${username} hi`);
            console.log(`Log > ${username} said hi`);
        }
        if (message == "Boop!") {
            bot.chat(`/boop ${username}`);
            console.log(`Log > ${username} booped me`);
        }
    
        if(username.toLowerCase() == config.owner.toLowerCase()){
            bot.chat(`/gc ${message}`)
            console.log(`Log > ${username} told me to say ${message}`);
        }
    })
    
    bot.on('chat:GUILD_MESSAGE', ([[rank, username, message]]) => {
        if(!rank){rank = "Non"};
        username = username.replace(/.(\[.+\])/,'') //removes roles
        console.log(`Guild > [${rank}] ${username}: ${message}`);
        username = username.replace(/(:.*)/,'') //removes weird colon and username thing
    
        //dont allow bot to answer self
        if(bot.username == `${username}`){ return }
    
        //its hacky but it works
    
        //user cmds
    
        if (rank.toLowerCase().includes(bot.username.toLowerCase())){return} // what even caused this
    
        if (message.startsWith(`${config.prefix} rank add `)) {
            rankrequest = message.replace(`${config.prefix} rank add `,'');
            console.log(`Log > ${username} asked for the rank ${rankrequest}`)
            if(rankrequest.length > 6){
                bot.chat(`/gc Your rank must be 6 characters or lower`)
                channel.send(`:no_entry: Your rank must be 6 characters or lower`)
                return
            }
            if(DB.GetUser(username.toLowerCase())){
                bot.chat(`/gc you have a rank already! Remove it with "${config.prefix} rank remove"`)
                channel.send(`:no_entry: ${username} has a rank already`)
                return
            }
            DB.AddUser(username.toLowerCase(), rankrequest.replace(/[\\\.\ \,\*\?\^\$\[\]\(\)\{\}\/\'\#\:\!\=\|]/ig,''))
            bot.chat(`/gc rank successfully added to ${username}`)
            channel.send(`:white_check_mark: added the rank to ${username}`)
        }
    
        if (message == `${config.prefix} rank remove`) {
            if(DB.GetUser(username.toLowerCase())){
                DB.RemoveUser(username.toLowerCase())
                console.log(`Log > ${username} removed the rank from their profile`)
                bot.chat(`/gc removed ${username}'s rank`)
                channel.send(`:white_check_mark: removed ${username}'s rank`)
                return
            }
            bot.chat(`/gc you do not have a rank to remove! Add one with "${config.prefix} rank add <rank>"`)
            channel.send(`:no_entry: ${username} did not have a rank to remove`)
            return
        }
    
        //owner cmds
    
        // no idea if this works
        // if (message.startsWith(`${config.prefix} rank set `)) {
        //     specifieduser = message.replace(config.prefix,'').replace(/rank set .* /,'');
        //     rankrequest = 
        //     console.log(`Log > ${username} asked for the rank ${rankrequest}`)
        //     if(rankrequest.length > 6){
        //         bot.chat(`/gc Your rank must be 6 characters or lower`)
        //         channel.send(`:no_entry: Your rank must be 6 characters or lower`)
        //         return
        //     }
        //     if(DB.GetUser(username.toLowerCase())){
        //         bot.chat(`/gc you have a rank already! Remove it with "${config.prefix} rank remove"`)
        //         channel.send(`:no_entry: ${username} has a rank already`)
        //         return
        //     }
        //     DB.AddUser(username.toLowerCase(), rankrequest.replace(/[\\\.\ \,\*\?\^\$\[\]\(\)\{\}\/\'\#\:\!\=\|]/ig,''))
        //     bot.chat(`/gc rank successfully added to ${username}`)
        //     channel.send(`:white_check_mark: added the rank to ${username}`)
        // }
    
    
        // this works I just dont like it
        // if (message.startsWith(`${config.prefix} rank remove `) && username == config.owner) {
        //     specifieduser = message.replace(`${config.prefix} rank remove `,``)
        //     if(DB.GetUser(specifieduser.toLowerCase())){
        //         DB.RemoveUser(specifieduser.toLowerCase())
        //         console.log(`Log > ${username} removed ${specifieduser}'s rank from their profile`)
        //         bot.chat(`/gc ${username} removed ${specifieduser}'s rank`)
        //         channel.send(`:white_check_mark: ${username} removed ${specifieduser}'s rank`)
        //         return
        //     }
        //     bot.chat(`/gc ${specifieduser} did not have a rank to remove!`)
        //     channel.send(`:no_entry: ${specifieduser} did not have a rank to remove`)
        //     return
        // }
    
    
    
        if(message == `${config.prefix} help`){
            bot.chat(`/gc ----------Commands-----------`)
            waity(0.1)
            bot.chat(`/gc ${config.prefix} rank add <rank>: sets your rank`)
            waity(0.1)
            bot.chat(`/gc ${config.prefix} rank remove: removes your rank`)
            waity(0.1)
            bot.chat(`/gc -----------------------------`)
            console.log(`Log > ${username} asked for help`)
        }
    
        if (message.startsWith(`${config.prefix} override `)) {
            if(username.toLowerCase() == config.owner.toLowerCase()){
                message = message.replace(config.prefix,'').replace(/ override /,'');
                bot.chat(`${message}`)
                console.log(`Log > ${username} overrided me to say ${message}`)
            }
        }
    
        if (message == `${config.prefix} test`) {
            bot.chat(`/gc Test sucessful!`)
            console.log(`Log > ${username} asked for a test`)
        }
    
        if (message.startsWith(`${config.prefix} restart`) && username == config.owner) {
            bot.quit();
            bot.chat(`/gc restarting process`)
            console.log(`Log > ${username} asked me to restart`)
        }
    
        if (message.includes(`@everyone`)){ return }
        if (message.match(/@!?\d{18}/g)){ return }
        
        if(DB.GetUser(username.toLowerCase())){ 
    
            if(DB.GetUser(username.toLowerCase()) == `uwu`){
                channel.send(`:sparkles: [${DB.GetUser(username.toLowerCase())}] ${username}: ${message}`)
                return
            }
            if(DB.GetUser(username.toLowerCase()) == `bruh`){
                channel.send(`:moyai: [${DB.GetUser(username.toLowerCase())}] ${username}: ${message}`)
                return
            }
            if(DB.GetUser(username.toLowerCase()) == `amogus`){
                channel.send(`:hot_face: [${DB.GetUser(username.toLowerCase())}] ${username}: ${message}`)
                return
            }
    
            channel.send(`<:hypixel:807757743409987586> [${DB.GetUser(username.toLowerCase())}] ${username}: ${message}`)
        }else{
            channel.send(`<:hypixel:807757743409987586> [${rank}] ${username}: ${message}`)
        }
    })

    // bot.on('chat:GUILD_PLAYERLIST', (list) => {
    //     console.log(`LISTY`)
    //     console.log(list)
    //     // pull out every playername with this regex ([^\s\\].*?) ●

    //     let usernames = []
    //     let matches = list.matchAll(/([^\s\\].*?) ●/g)
    //     for (const match of matches) {
    //         usernames.push(match[1])
    //     }
    //     console.log(usernames)
    // })

    
    client.on('ready', () => {
        console.log(`Log > Logged in as discord user ${client.user.tag}`);
        channel = client.channels.cache.get(channel)
        if (!channel) {
            console.log(`Log > I could not find the channel (${config.channelid})!`)
            process.exit(1)
        }
        console.log(`Log > I found the channel (${channel.name})!`)
        // send message to channel
        channel.send(`:white_check_mark: I am now online!`)
    })
    
    client.on('message', message => {
        // Only handle messages in specified channel
        if (message.channel.id !== channel.id) return
        // Ignore messages from the bot itself
        if (message.author.id === client.user.id) return

        // if message starts with !
        if (message.content.startsWith(`!`)){
            if(message.content == `!online` || message.content == `!gl` || message.content == `!list`){
                bot.chat(`/guild list`)
                return
            }
        }
    
        let guild = client.guilds.cache.get(config.guildid);
        let member = guild.member(message.author);
        let nickname = member ? member.displayName : null; 
    
        if (message.content.match(/@!?\d{18}/g) || message.content.includes("https://") || message.content.includes("http://") || message.content.length > 257){
            channel.send(`:no_entry: Message from ${nickname} not sent due to containing blacklisted characters`)
            return;
        }

        var finalchat = message.content.replace(/(ez)/igm,'éz')
        var finalnickname = nickname.replace(/(ez)/igm,'éz')
        bot.chat(`/gc ${finalnickname}: ${finalchat}`)
    });
    
    
    client.login(config.token);

    const express = require('express')
    const app = express()
    const port = config.webport
    
    // production environment, dont send errors to the user
    app.set('env', 'production')

    
    app.get('/', (req, res) => {
        res.send('<form action="/restart" method="post"><button type="submit">Restart</button></form>')
    })
    
    app.post('/restart', (req, res) => {
        // send a message to the channel
        channel.send(`:white_check_mark: Restarting`)
        bot.quit()
        console.log(`Log > restart from webui`)
        res.send('Restarting')
    })
    
    app.listen(port, () => {
        console.log(`Log > WebUI listening at http://localhost:${port}`)
    })
    


    bot.on('error', (err) => console.log(err))
    bot.on('end', client.destroy)
    // delete the express server when the bot ends so it doesnt conflict with the new one
    bot.on('end', () => {
        app.delete()
    })
    bot.on('end', createBot)
}
    
createBot()