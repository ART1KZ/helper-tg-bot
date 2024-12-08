import { Bot } from "grammy";
import "dotenv/config"

const BOT_TOKEN: string = process.env.BOT_TOKEN as string

const bot = new Bot(String(BOT_TOKEN))

bot.on("message", (ctx) => {
    console.log(ctx.update.message.text)
    ctx.reply("Hi there!")
});

bot.start();