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

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(greeting));
bot.use(createConversation(complaint));
bot.use(createConversation(settings));

bot.use(
  createConversation(async function contact(conversation, ctx) {
    const CHAT_ID = "-1001302181106";
    const USER_ID = ctx.message.from.id;
    await ctx.reply("Способы свзяи", { reply_markup: mainContactKeyboard });
    const context = await conversation.wait();

    if (context.update.callback_query.data === "back") {
      await context.reply("Перевожу обратно в меню", {
        reply_markup: menuKeyboard,
      });
    } else if (context.update.callback_query.data === "bot") {
      const user = await db.getUser({ id: USER_ID });
      await context.reply("Добрый день, я диспетчер. Опишите ваш вопрос.", {
        reply_markup: botContactKeyboard,
      });
      while (true) {
        const localContext = await conversation.wait();
        if (localContext?.update?.callback_query?.data === "exit") {
          await localContext.reply("Диалог закончен.", {
            reply_markup: menuKeyboard,
          });
          break;
        }

        await localContext.reply(
          `Новое сообщение от пользователя ${user.name} ${user.surname}\nCHAT_ID:${CHAT_ID}`,
          {
            chat_id: CHAT_ID,
            reply_markup: new InlineKeyboard().text(
              "Ответить",
              "answer_" + USER_ID,
            ),
          },
        );
      }
    } else if (context.update.callback_query.data === "call") {
      await context.reply("Выберите вариант", {
        reply_markup: callContactKeyboard,
      });
      const localContext = await conversation.wait();
      if (localContext.update.callback_query.data === "no") {
        await settings(conversation, ctx);
        return;
      }
      const user = await db.getUser({ id: USER_ID });
      const msg = `Поступила новая заявка на звонок!\n Контактные данные: \n Имя - ${user.name} \n Фамилия - ${user.surname} \n Номер - ${user.phone}`;
      await localContext.reply(msg, { chat_id: CHAT_ID, parse_mode: "HTML" });
      await localContext.reply("Заявка принята. Перевожу в меню", {
        reply_markup: menuKeyboard,
      });
    } else {
      await ctx.reply("Такой команды нет", { reply_markup: menuKeyboard });
      return;
    }

    return;
  }),
);

// Commands

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
  const CHAT_ID = "-1001302181106";
  if (ctx.chat.id === CHAT_ID) {
  } else {
    await ctx.reply("Недостаточно прав!");
  }
});

bot.command("contact", async ctx => {
  await ctx.conversation.enter("contact");
});

bot.on("message:text", async ctx => {
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
        reply_markup: new InlineKeyboard().text("Обратно в меню", "menu").row(),
      });
      break;
    }
    default: {
      await ctx.reply("Такой команды нет :(");
      break;
    }
  }
});

bot.on("callback_query", async ctx => {
  if (ctx.callbackQuery.data === "menu") {
    await ctx.reply("Меню", {
      reply_markup: menuKeyboard,
    });
  } else if (/^answer/gi.test(ctx.callbackQuery.data)) {
    console.log(ctx.message);
    const CHAT_ID = ctx.callbackQuery.data.split(/_/)[1];
    console.log(CHAT_ID);
    await ctx.reply("Ага", { chat_id: CHAT_ID });
  }
});

await bot.start();
