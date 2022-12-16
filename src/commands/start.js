const startHandler = async ctx => {
  const message = `<b>Привет ${ctx.message.from.first_name}!\nНапиши мне следующие команды, чтобы начать общение!</b>
  <i>Меню или <strong>/menu</strong></i>
  <i>Помощь или <strong>/help</strong></i>
  `;
  await ctx.reply(message, { parse_mode: "HTML" });
};

export default startHandler;
