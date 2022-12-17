import { Keyboard } from "grammy";

const settingsKeyboard = new Keyboard()
  .text("Сменить номер", "number")
  .text("Сменить имя", "name")
  .row()
  .text("Назад", "back");

export default settingsKeyboard;
