const helpHandler = async ctx => {
  await ctx.reply(
    `Вот мои команды:\n<i>Меню или <strong>/menu</strong></i>\n<i>Помощь или <strong>/help</strong></i>`,
    { parse_mode: "HTML" },
  );
};

export default helpHandler;
