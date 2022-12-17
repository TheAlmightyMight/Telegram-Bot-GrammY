import db from "../db.js";
import menuKeyboard from "../keyboards/regular/menu.js";

// async function settings(conversation, ctx) {
//   await ctx.reply("Настройки", { reply_markup: settingsKeyboard });
//   const context = conversation.wait();

//   if (context.update.callback_query.data === "back") {
//     await context.reply("Обратно в меню", { reply_markup: menuKeyboard });
//     return;
//   } else if (context.update.callback_query.data === "name") {
//     await context.reply("Ввведите новое имя");
//     const contextLocal = await conversation.wait();
//     await db.updateUser({ id: contextLocal.});
//     await contextLocal.reply("Настройки успешно применены!", {
//       reply_markup: menuKeyboard,
//     });
//   } else if (context.update.callback_query.data === "phone") {
//     await context.reply("Ввведите новый номер телефона");
//     const contextLocal = await conversation.wait();
//     await contextLocal.reply("Настройки успешно применены!", {
//       reply_markup: menuKeyboard,
//     });
//   }
// }

export default settings;
