// const { Client, GatewayIntentBits } = require('discord.js')
// const CHANNEL_ID = process.env.CHANNEL_ID
// const TOKEN_DISCORD = process.env.TOKEN_DISCORD


// class LogService {
//     constructor() {
//         this.client = new Client({
//             intents: [
//                 GatewayIntentBits.DirectMessages,
//                 GatewayIntentBits.Guilds,
//                 GatewayIntentBits.GuildMessages,
//                 GatewayIntentBits.MessageContent
//             ]
//         })

//         this.channelId = CHANNEL_ID

//         this.client.on('ready', () => {
//             console.log(`Logged as ${this.client.user.tag}`)
//         })
//         this.client.login(TOKEN_DISCORD)
//     }

//     sendFormatCode(logData) {
//         const { method, start, code, host, content } = logData
//         const formatted = {
//             content: `📝 ${method} request from: ${host}\n🕒 ${new Date(start).toLocaleString()}\n`,
//             embeds: [
//                 {
//                     color: parseInt(code.toString()[0]=='2'?'00ff00':'ff0000', 16), // Xanh lá (200~299), bạn có thể thay theo status code
//                     title: `${method} -- ${code}`,
//                     description: '```json\n' + JSON.stringify(content, null, 2) + '\n```',
//                 }
//             ]
//         }


//         this.sendMessageTo(formatted)

//     }


//     sendMessageTo(message = 'message') {
//         const channel = this.client.channels.cache.get(this.channelId)
//         if (!channel) {
//             console.error('Channel not found: ', this.channelId, typeof this.channelId)
//             return
//         }

//         channel.send(message).catch((e) => console.error(e))
//     }

// }

// // const logService = new LogService()
// module.exports = new LogService()