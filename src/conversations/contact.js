import { InlineKeyboard } from "grammy";
import db from "./db.js";

async function contact(conversation, ctx) {
  const CHAT_ID = "-834967948";
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
        `Новое сообщение:\n${ctx.message.text}\n.От пользователя ${user.name} ${user.surname}\nuser:${CHAT_ID}.`,
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
}

export default contact;
