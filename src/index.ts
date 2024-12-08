import { Bot, InlineKeyboard } from "grammy";
import { createClient } from '@supabase/supabase-js'
import "dotenv/config"

const BOT_TOKEN = process.env.BOT_TOKEN as string
const bot = new Bot(BOT_TOKEN)

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseToken = process.env.SUPABASE_TOKEN as string

const supabase = createClient(supabaseUrl, supabaseToken)

bot.command("start", async (ctx) => {
    const userTelegramID = ctx.update?.message?.from.id

    
    try {
        if (userTelegramID) {
            let { data: users, error } = await supabase
                .from('users')
                .select('*')
                .eq("telegram_id", userTelegramID)

            if (error) {
                ctx.reply("Возникла ошибка при регистрации. Попробуйте еще раз, для этого напишите /start");
                console.error(error);

                return;
            }

            // if user doesn't exist in the db adding new record on table
            if (users === null || users.length === 0) {
                const { data, error } = await supabase
                    .from('users')
                    .insert([
                        { telegram_id: userTelegramID },
                    ])

                if (error) {
                    ctx.reply("Возникла ошибка при регистрации. Попробуйте еще раз, для этого напишите /start");
                    console.error(error);

                    return;
                }

                ctx.reply("Добро пожаловать! Вы успешно авторизовались")

            // if user already exists
            } else {
                ctx.reply("С возвращением!")
            }
        }
    } catch (error) {
        console.error("Произошла ошибка: " + error)
    }

});

bot.on("message", (ctx) => {
    console.log(ctx.update.message)
    ctx.reply("Привет!")
});

bot.start();