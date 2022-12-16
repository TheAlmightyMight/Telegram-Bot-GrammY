import { Bot, InlineKeyboard, Keyboard, session } from "grammy";
import * as dotenv from "dotenv";
dotenv.config();

export const bot = await Promise.resolve(new Bot(process.env.TOKEN));

// Command handlers
import helpHandler from "./commands/help.js";
import startHandler from "./commands/start.js";

// Middleware
import menuMd from "./middleware/menu.js";

// Keyboards
import menuKeyboard from "./keyboards/regular/menu.js";

bot.use(session({ initial: () => {} }));

// Commands
bot.command("start", startHandler);
bot.command("help", helpHandler);

bot.on("message", menuMd, async ctx => {
  const keyboard = new InlineKeyboard().text("Вернуться в меню", "menu");
  await ctx.reply(
    "Ой, ой, ой, похоже ты прогадал с командой. Вернуть тебя в меню? Если хочешь пообщаться напиши Клим - это все что я могу тебе рассказать.",
    { reply_markup: keyboard },
  );
});

bot.callbackQuery("menu", async ctx => {
  await ctx.reply("Добро пожаловать обратно в меню!", {
    reply_markup: menuKeyboard,
  });
});

bot.route;

await bot.start();

bot.catch(err => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});
