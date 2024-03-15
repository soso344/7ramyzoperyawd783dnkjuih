const express = require("express");
const app = express();
const SelfDiscord = require("discord.js-selfbot-v13");
const Discord = require("discord.js");
const client = new SelfDiscord.Client();
const bot = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
});
const options = {
    showAuthor: false,
    filterShitposts: true,
    filterMentions: true,
    mainGuild: "1112383386602975332",
    mainChannel: "1144089774634836068",
    log: "1144089778128683049",
    guilds: [
        { id: "762115688881586186", channels: ["934062419733536768", "934062483931533362", "1034685248098795520"] }, //r memes
        { id: "648574378677764126", channels: ["648577686423207955", "959266199353585684", "1077698812283453460"] }, //nsfw mems
        { id: "945285266048966687", channels: ["1109129666259857439", "1093461221757435974", "1093461220511727626", "1114899434774483034", "1093479380841414656", "1093479714569588806", "1094003726815068231", "1107032092375789599"] }, //meme zone
        { id: "967548369763455086", channels: ["969721918276132904", "969722377724371024", "969722578912575508", "969722791152721920", "969722950582423552", "1034651847207698562", "969723319110729769", "969723526749761576"] }, //memesmasturbation
        { id: "834109081110839296", channels: ["834111256306253876", "835245580417892362"] }, //shitposting zone
        { id: "328390874281017344", channels: ["1045428820175499335", "1095821214309679247", "800338253528956980", "800337553998741555", "800963078590038066", "329054273029668866", "905948828811800629"] }, //shitpost central
        { id: "905636502296485888", channels: ["972675519625703464", "984334189396627466", "976475578947489832", "976919558273245234"] }, // DRKP shitpost central
        { id: "962036879304319037", channels: ["1135442598631321623", "1135442790147424316", "1136256158936604752"] } //fbt team عربي
    ]
};

bot.on("ready", () => {
    bot.user.setActivity('هسرجك', { type: 'WATCHING' });
    bot.user.setStatus('idle');
    console.log("shitpostCollectorManager IS READY AT: ", bot.user.tag);
});

client.on("ready", () => {
    console.log("shitpostCollector IS READY AT: ", client.user.tag);
});

client.on("messageCreate", async (message) => {
    if (message.author.id === client.user.id) return;
    let shitpostGuild = bot.guilds.cache.get(options.mainGuild);
    let lopChannel = shitpostGuild.channels.cache.get(options.log);
    try {
        let shitpostCollectorChannel = shitpostGuild.channels.cache.get(
            options.mainChannel
        );
        let guildOptions = options.guilds.find(
            (guild) => guild.id === message.guild.id
        );
        if (!guildOptions || !guildOptions.channels.includes(message.channel.id))
            return;
        let { content, attachments } = message;
        let messageOptions = {
            files: attachments.map((attachment) => attachment.url)
        };
        if (content || options.showAuthor) {
            messageOptions.content = options.showAuthor ? content + `\n By: ${message.author.tag}}` : content;
        }

        if (options.filterMentions) {
            if (messageOptions.content) messageOptions.content = messageOptions.content.replace(/\@everyone/g, "").replace(/\@here/g, "");
        }

        if (options.filterShitposts) {
            if (attachments.size <= 0 && !content.includes("http")) return lopChannel.send({
                content: `🛡️ Shitpost Gaurd! I Couldn't find any shitposts in ${message.guild.name} (${message.guild.id}) in ${message.channel.name} (${message.channel.id}) this time so i didn't send any!`,
            });

        }
        await shitpostCollectorChannel.send(messageOptions);
        lopChannel.send({
            content: `✅ DONE! Collected ${1 + attachments.size} shitposts from ${message.guild.name} (${message.guild.id}) in ${message.channel.name} (${message.channel.id})`,
        });
    } catch (err) {
        console.log(err)
        lopChannel.send({
            content: `❌ ERR! Error in collecting shitposts from ${message.guild?.name} (${message.guild?.id}) in ${message.channel?.name} (${message.channel?.id})`,
        });
    }
});


app.get("/", (req, res) => res.send("امك حلوه جدا"));


async function login() {
    try {
        await bot.login(process.env['bot']);
    } catch (err) {
        console.log("ERR IN BOT TOKEN", err)
    }
    try {

        await client.login(process.env['selfBot']);
    } catch (err) {
        console.log("ERR IN SELF BOT TOKEN", err)
    }
}

login();
app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));