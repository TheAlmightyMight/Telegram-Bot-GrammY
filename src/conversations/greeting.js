import menuKeyboard from "../keyboards/regular/menu.js";
import db from "../db.js";
import nameValidator from "../utils/nameValidator.js";
import phoneValidator from "../utils/phoneValidator.js";

async function greeting(conversation, ctx) {
  const contacts = { phone: "", name: "", surname: "" };
  const greeting =
    "Доброго времени суток, бот создан чтобы обрабатывать заявки и обращения пользователей. Чтобы вопользоваться этим пришлите сначала ваше <b>Имя</b> и <b>Фамилию</b>";
  await ctx.reply(greeting, { parse_mode: "HTML" });

  while (true) {
    const {
      message: { text },
    } = await conversation.wait();
    console.log(text);
    if (/[а-я]/gi.test(text) && /^([А-Я][а-я]+)(\s[А-Я][а-я]+)$/g.test(text)) {
      const arr = text.split(/\s/);

      contacts.name = arr[0];
      contacts.surname = arr[1];
      break;
    } else {
      const message =
        "Неподходяшее имя. Используйте кириллицу не забудьте заглавные буквы и пробел между именами. Пример:<b>'Иван Попов'</b>";
      await ctx.reply(message, { parse_mode: "HTML" });
    }
  }

  await ctx.reply("Теперь отправьте свой номер телефона");

  while (true) {
    const {
      message: { text },
    } = await conversation.wait();
    if (/\+\d{11}/g.test(text)) {
      contacts.phone = text;
      break;
    } else {
      const message =
        "Неподходящий номер телефона. Используйте + перед началом номера. Пример:<b>+79976517654</b>";
      await ctx.reply(message, { parse_mode: "HTML" });
    }
  }

  await (async () => {
    await ctx.reply("Подождите...");

    const user = await db.getUser({ id: ctx.message.from.id });
    if (user) {
      await ctx.reply(
        "Я вас помню, вы уже зарегистрированы. Добро пожаловать!",
        {
          reply_markup: menuKeyboard,
        },
      );
      return;
    }
    await db.saveUser({ id: ctx.message.from.id, ...contacts });
  })();

  await ctx.reply("Добро пожаловать в главное меню!", {
    reply_markup: menuKeyboard,
  });
}

export default greeting;
