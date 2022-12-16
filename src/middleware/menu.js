import { Keyboard } from "grammy";

const menuMd = async (ctx, next) => {
  if (/menu/gi.test(ctx.message.text)) {
    await ctx.reply("Что бы вы хотели сделать?", {
      reply_markup: new Keyboard()
        .text("Контакты")
        .text("Отправить мне письмо по почте")
        .text("Посмотреть резюме")
        .row()
        .text("Рассказать о себе")
        .text("Прислать фотку котика")
        .text("Some other option")
        .oneTime()
        .resized(true),
    });
  } else {
    next();
  }
};

export default menuMd;
