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
import settingsKeyboard from "./keyboards/regular/settings.js";

//Conversations
import greeting from "./conversations/greeting.js";
import complaint from "./conversations/complaint.js";

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(greeting));
bot.use(createConversation(complaint));
bot.use(
  createConversation(async function settings(conversation, ctx) {
    await ctx.reply("Настройки", { reply_markup: settingsKeyboard });
    const context = conversation.wait();

    if (context.update.callback_query.data === "back") {
      await context.reply("Обратно в меню", { reply_markup: menuKeyboard });
      return;
    } else if (context.update.callback_query.data === "name") {
      await context.reply("Ввведите новое имя");
      const contextLocal = await conversation.wait();

      // await db.updateUser({ id: contextLocal.message.from.id }, {name: arr[0], surname: arr[1], phone: });
      await contextLocal.reply("Настройки успешно применены!", {
        reply_markup: menuKeyboard,
      });
    } else if (context.update.callback_query.data === "phone") {
      await context.reply("Ввведите новый номер телефона");
      const contextLocal = await conversation.wait();
      await contextLocal.reply("Настройки успешно применены!", {
        reply_markup: menuKeyboard,
      });
    }
  }),
);

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
      await ctx.reply(await db.getUser({ id: ctx.message.from.id }));
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
