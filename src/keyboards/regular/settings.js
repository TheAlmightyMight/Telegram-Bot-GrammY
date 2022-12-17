import { InlineKeyboard } from "grammy";

const settingsKeyboard = new InlineKeyboard()
  .text("Сменить номер", "number")
  .text("Сменить имя", "name")
  .row()
  .text("Назад", "back");

export default settingsKeyboard;
