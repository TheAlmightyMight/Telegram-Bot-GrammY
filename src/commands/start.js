import { conversations, createConversation } from "@grammyjs/conversations";

const startHandler = async ctx => {
  // const message =
  //   "Доброго времени суток, бот создан чтобы обрабатывать заявки и обращения пользователей. Чтобы вопользоваться этим пришлите сначала ваше <b>Имя</b> и <b>Фамилию</b>";
  // await ctx.reply(message, { parse_mode: "HTML" });
  ctx.conversation.enter("greeting");
};

export default startHandler;
