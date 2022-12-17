import db from "../db.js";
import { InlineKeyboard } from "grammy";
import menuKeyboard from "../keyboards/regular/menu.js";

async function complaint(conversation, ctx) {
  const CHAT_ID = "-1001302181106";
  const stages = [
    {
      keyboard: new InlineKeyboard()
        .text("Оставить заявку", "complaint")
        .text("Поделиться предложением", "suggestion")
        .row()
        .text("back", "back")
        .row(),
      stage: 1,
    },
    {
      keyboard: new InlineKeyboard().text("Stage2").text("back", "back").row(),
      stage: 2,
    },
    {
      keyboard: new InlineKeyboard().text("Stage3").text("back", "back").row(),
      stage: 3,
    },
    {
      keyboard: new InlineKeyboard().text("Stage4").text("back", "back").row(),
      stage: 4,
    },
    {
      message: "bye",
      stage: 5,
    },
  ];

  let current = stages[0];

  while (true) {
    if (current.stage === 5) {
      await ctx.reply("Заявка создана, перевожу обратно в меню.", {
        reply_markup: menuKeyboard,
      });
      return;
    }

    await ctx.reply(String(current.stage), {
      reply_markup: current.keyboard,
    });

    const context = await conversation.wait();

    //suggestion
    if (/suggestion/gi.test(context.update.callback_query.data)) {
      console.log("yay", context.update.callback_query.data);
      await context.reply("Опишите ваше предложение", {
        reply_markup: new InlineKeyboard().text("Назад", "back"),
      });

      const contextLocal = await conversation.wait();
      if (contextLocal.update.callback_query?.data === "back") {
        continue;
      }

      if (!contextLocal.message.text?.length) {
        await contextLocal.reply("Ответьте пожалуйста текстом!");
        continue;
      } else {
        const user = await db.getUser({ id: contextLocal.message.from.id });
        await db.saveSuggestion({
          description: contextLocal.message.text,
          user: user,
        });

        await contextLocal.reply(
          "Ваше предложение принято! Возвращаю вас в меню.",
          {
            reply_markup: menuKeyboard,
          },
        );

        return;
      }
    }

    //complaint back btn
    if (/back/.test(context.update.callback_query.data)) {
      if (current.stage === 1) {
        await ctx.reply("Перевожу обратно в меню.", {
          reply_markup: menuKeyboard,
        });
        return;
      } else {
        current = stages[current.stage - 2];
        continue;
      }
    }

    current = stages[current.stage];
  }
}

export default complaint;
