import { Keyboard } from "grammy";

const menuKeyboard = new Keyboard()
  .text("Контакты")
  .text("Отправить мне письмо по почте")
  .text("Посмотреть резюме")
  .row()
  .text("Рассказать о себе")
  .text("Прислать фотку котика")
  .text("Some other option")
  .oneTime()
  .resized(true);

export default menuKeyboard;
