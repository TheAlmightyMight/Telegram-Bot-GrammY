import { InlineKeyboard } from "grammy";

const mainContactKeyboard = new InlineKeyboard()
  .text("Перезвоните мне", "call")
  .row()
  .text("Свяжитесь со мной в чат боте", "bot")
  .row()
  .text("Назад", "back");

const callContactKeyboard = new InlineKeyboard()
  .text("Да, отправить номер", "yes")
  .text("Нет, поменять номер телефона", "no")
  .row()
  .text("Назад", "back");

const botContactKeyboard = new InlineKeyboard().text(
  "Выйти из диалога",
  "exit",
);

const adminContactKeyboard = new InlineKeyboard().text("Ответить", "answer");

export {
  mainContactKeyboard,
  callContactKeyboard,
  botContactKeyboard,
  adminContactKeyboard,
};
