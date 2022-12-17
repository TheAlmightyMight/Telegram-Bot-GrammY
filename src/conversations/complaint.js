import { Context } from "grammy";
import db from "../db.js";
import { InlineKeyboard } from "grammy";
import menuKeyboard from "../keyboards/regular/menu.js";

async function complaint(conversation, ctx) {
  const CHAT_ID = "-1001302181106";
  const USER_ID = ctx.message.from.id;
  const stages = [
    {
      keyboard: new InlineKeyboard()
        .text("Оставить заявку", "complaint")
        .text("Поделиться предложением", "suggestion")
        .row()
        .text("back", "back")
        .row(),
      stage: 1,
      message: "Выберите варианты",
    },
    {
      keyboard: new InlineKeyboard()
        .text("Назад", "back")
        .text("Пропустить", "skip")
        .row(),
      stage: 2,
      message: "Оставьте адресc",
    },
    {
      keyboard: new InlineKeyboard()
        .text("Назад", "back")
        .text("Пропустить", "skip")
        .row(),
      stage: 3,
      message: "Прикрепите фото",
    },
    {
      keyboard: new InlineKeyboard().text("Назад", "back").row(),
      stage: 4,
      message: "Причина обращения",
    },
    {
      stage: 5,
    },
  ];

  const info = {
    address: "",
    photo: "",
    description: "",
    issuer: await db.getUser({ id: USER_ID }),
  };
  let current = stages[0];

  while (true) {
    console.log(current);
    if (current.stage === 5) {
      await db.saveComplaint(info);
      await ctx.reply("Заявка создана, перевожу обратно в меню.", {
        reply_markup: menuKeyboard,
      });
      return;
    }

    await ctx.reply(current.message, {
      reply_markup: current.keyboard,
    });

    const context = await conversation.wait();

    //complaint back btn
    if (/back/.test(context?.update?.callback_query?.data)) {
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

    if (current.stage === 2) {
      info.address = context?.message?.text;
    } else if (current.stage === 3) {
      console.log(context.message);
      if (context.message?.photo) {
        info.photo = context.message.photo[0].file_id;
      } else {
        continue;
      }
    } else if (current.stage === 4) {
      console.log("DESCRIPTION!!!!!!!!");
      if (context.message?.text.length < 15) {
        await context.reply("Мало слов");
        continue;
      }
      info.description = context.message.text;
    }

    //suggestion
    if (/suggestion/gi.test(context?.update?.callback_query?.data)) {
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
          `Поступило новое предложение: ${contextLocal.message.text}.\nКонтакты:\nИмя: ${user.name}\nФамилия: ${user.surname}`,
          { chat_id: CHAT_ID },
        );

        await contextLocal.reply(
          "Ваше предложение принято! Возвращаю вас в меню.",
          {
            reply_markup: menuKeyboard,
          },
        );
      }
    }

    current = stages[current.stage];
  }
}

export default complaint;
