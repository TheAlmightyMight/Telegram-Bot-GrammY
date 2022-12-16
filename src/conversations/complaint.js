import db from "../db.js";
import { InlineKeyboard } from "grammy";
import menuKeyboard from "../keyboards/regular/menu.js";

async function complaint(conversation, ctx) {
  const stages = [
    {
      keyboard: new InlineKeyboard().text("Stage1").text("back", "back").row(),
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
      await ctx.reply("Перевожу обратно в меню.", {
        reply_markup: menuKeyboard,
      });
      return;
    }

    console.log(current, "current");

    await ctx.reply(String(current.stage), {
      reply_markup: current.keyboard,
    });

    const context = await conversation.wait();

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
