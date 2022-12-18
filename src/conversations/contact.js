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
        `Новое сообщение:\n${ctx.message.text}.\nОт пользователя ${user.name} ${user.surname}\nuser:${USER_ID}.`,
        {
          chat_id: CHAT_ID,
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
    const msg = `Новое сообщение:\n${ctx.message.text}\n.От пользователя ${user.name} ${user.surname}\nuser:${CHAT_ID}.`;
    await localContext.reply(msg, { chat_id: CHAT_ID, parse_mode: "HTML" });
    await localContext.reply("Заявка принята. Перевожу в меню", {
      reply_markup: menuKeyboard,
    });
  } else {
    await ctx.reply("Такой команды нет", { reply_markup: menuKeyboard });
    return;
  }

  await ctx.reply("Вы вышли из диалога.");
}

export default contact;
