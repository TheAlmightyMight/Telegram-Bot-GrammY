import { Bot, session, InlineKeyboard } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import * as dotenv from "dotenv";
import db from "./db.js";

db.connect();
dotenv.config();
const bot = new Bot(process.env.TOKEN);

// Command handlers
// import helpHandler from "./commands/help.js";
// import startHandler from "./commands/start.js";

// Middleware

// Keyboards
import menuKeyboard from "./keyboards/regular/menu.js";

//Conversations
import greeting from "./conversations/greeting.js";
import complaint from "./conversations/complaint.js";

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(greeting));
bot.use(createConversation(complaint));

// Commands

bot.command("complaint", async ctx => {
  await ctx.conversation.enter("complaint");
});

bot.command("start", async ctx => {
  await ctx.conversation.enter("greeting");
});

bot.on("message:text", async ctx => {
  console.log(ctx.message, ctx.chat);
  switch (ctx.message.text) {
    case "menu": {
      await ctx.reply("Здесь контакты", {
        reply_markup: menuKeyboard,
      });
      break;
    }
    case "Оставить заявку": {
      await ctx.conversation.enter("complaint");
      break;
    }
    case "Связаться": {
      break;
    }
    case "Настройки": {
      break;
    }
    case "Полезные контакты": {
      await ctx.reply("Здесь контакты", {
        reply_markup: new InlineKeyboard().text("Обратно в меню", "menu").row(),
      });
      break;
    }
    default: {
      await ctx.reply("yes");
      break;
    }
  }
});

bot.on("callback_query", async ctx => {
  if (ctx.callbackQuery.data === "menu") {
    await ctx.reply("Меню", {
      reply_markup: menuKeyboard,
    });
  }
});

await bot.start();
