import db from "../db.js";
import menuKeyboard from "../keyboards/regular/menu.js";
import settingsKeyboard from "../keyboards/regular/settings.js";
import phoneValidator from "../utils/phoneValidator.js";
import nameValidator from "../utils/nameValidator.js";

async function settings(conversation, ctx) {
  await ctx.reply("Настройки", { reply_markup: settingsKeyboard });
  const context = await conversation.wait();

  console.log(context);

  if (context.update?.callback_query?.data === "back") {
    await context.reply("Обратно в меню", { reply_markup: menuKeyboard });
    return;
  } else if (context.update?.callback_query?.data === "name") {
    await context.reply("Ввведите новое имя");
    const contextLocal = await conversation.wait();

    console.log(contextLocal.message.text);
    const newName = nameValidator(contextLocal.message.text);

    if (newName) {
      const user = await db.getUser({ id: contextLocal.message.from.id });
      console.log(user, newName);
      await db.updateUser(
        { id: contextLocal.message.from.id },
        { ...user, name: newName[0], surname: newName[1] },
      );
    } else {
      await contextLocal.reply("Неправильный формат", {
        reply_markup: menuKeyboard,
      });
      return;
    }

    await contextLocal.reply("Настройки успешно применены!", {
      reply_markup: menuKeyboard,
    });
  } else if (context.update?.callback_query?.data === "number") {
    await context.reply("Ввведите новый номер телефона");
    const contextLocal = await conversation.wait();

    console.log(contextLocal.message.text);
    const newPhone = phoneValidator(contextLocal.message.text);

    if (newPhone) {
      const user = await db.getUser({ id: contextLocal.message.from.id });
      await db.updateUser(
        { id: contextLocal.message.from.id },
        { ...user, phone: newPhone },
      );
    } else {
      await contextLocal.reply("Неправильный формат", {
        reply_markup: menuKeyboard,
      });
      return;
    }

    await contextLocal.reply("Настройки успешно применены!", {
      reply_markup: menuKeyboard,
    });
  } else {
    await ctx.reply("Такой команды нет", { reply_markup: menuKeyboard });
    return;
  }
}

export default settings;
