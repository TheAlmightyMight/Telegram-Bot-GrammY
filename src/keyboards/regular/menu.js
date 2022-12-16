import { Keyboard } from "grammy";

const menuKeyboard = new Keyboard()
  .text("Оставить заявку")
  .text("Связаться")
  .row()
  .text("Настройки")
  .row()
  .text("Полезные контакты")
  .oneTime()
  .resized(true);

export default menuKeyboard;
