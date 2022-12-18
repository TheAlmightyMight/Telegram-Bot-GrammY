import { Bot, session, InlineKeyboard } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import * as dotenv from "dotenv";
import db from "./db.js";

db.connect();
dotenv.config();
const bot = new Bot(process.env.TOKEN);

// Middleware

// Keyboards
import menuKeyboard from "./keyboards/regular/menu.js";
import {
  callContactKeyboard,
  botContactKeyboard,
  mainContactKeyboard,
  adminContactKeyboard,
} from "./keyboards/inline/contact.js";

//Conversations
import greeting from "./conversations/greeting.js";
import complaint from "./conversations/complaint.js";
import settings from "./conversations/settings.js";
import contact from "./conversations/contact.js";

import { Context } from "grammy";
const hasFile = Context.has.filterQuery("msg:photo");

bot.use(session({ initial: () => ({}) }));

bot.use(conversations());
bot.use(createConversation(greeting));
bot.use(createConversation(complaint));
bot.use(createConversation(settings));
bot.use(createConversation(contact));

// Commands

bot.hears("lol", async ctx => {
  await ctx.reply(ctx.chat.id);
});

bot.command("complaint", async ctx => {
  await ctx.conversation.enter("complaint");
});

bot.command("start", async ctx => {
  await ctx.conversation.enter("greeting");
});

bot.command("settings", async ctx => {
  await ctx.conversation.enter("settings");
});

bot.command("menu", async ctx => {
  await ctx.reply("Это меню", {
    reply_markup: menuKeyboard,
  });
});

bot.command("broadcast", async ctx => {
  const CHAT_ID = "-834967948";
  if (String(ctx.chat.id) === CHAT_ID) {
    const arr = await db.getAllUsers();
    for (let item of arr) {
      await ctx.reply("broadcast to all users", { chat_id: item.id });
    }
  } else {
    await ctx.reply("Недостаточно прав!" + ctx.chat.id);
  }
});

bot.command("contact", async ctx => {
  await ctx.conversation.enter("contact");
});

bot.on(
  "message",
  async (ctx, next) => {
    if (ctx.message?.reply_to_message) {
      const temp = ctx.message.reply_to_message.text.match(
        /(user:\w+)|(user:-\w+)/gim,
      );
      console.log(temp ?? "NONE", ctx.message.reply_to_message);
      if (!temp) {
        await ctx.reply("Do not reply to that!");
        return;
      }
      const id = temp.join("").match(/(\d+)|(-\d+)/g);
      await ctx.reply(ctx.message.text, { chat_id: id[0] });
      return;
    } else {
      await next();
    }
  },
  async ctx => {
    console.log(ctx.message, ctx.chat);
    switch (ctx.message.text) {
      case "Меню": {
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
        await ctx.conversation.enter("contact");
        break;
      }
      case "Настройки": {
        await ctx.conversation.enter("settings");
        break;
      }
      case "Полезные контакты": {
        await ctx.reply("Здесь контакты", {
          reply_markup: new InlineKeyboard()
            .text("Обратно в меню", "menu")
            .row(),
        });
        break;
      }
      default: {
        await ctx.reply("Такой команды нет :(");
        break;
      }
    }
  },
);

bot.on("callback_query", async ctx => {
  if (ctx.callbackQuery.data === "menu") {
    await ctx.reply("Меню", {
      reply_markup: menuKeyboard,
    });
  }
});

await bot.start();
