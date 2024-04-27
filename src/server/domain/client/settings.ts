export default class Settings {
  randomizeCards: boolean;
  reminderTime: string;
  sendWOTDNotifications: boolean;

  constructor(
    randomizeCards: boolean,
    reminderTime: string,
    sendWOTDNotifications: boolean
  ) {
    this.randomizeCards = randomizeCards;
    this.reminderTime = reminderTime;
    this.sendWOTDNotifications = sendWOTDNotifications;
  }
}
