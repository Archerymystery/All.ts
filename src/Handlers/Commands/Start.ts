import { Telegraf } from "telegraf";
import { Hendler } from "../Hendler";

export class Start extends Hendler {
  constructor(bot: Telegraf) {
    super(bot);
  }
  handler(): void {
    this.bot.start((ctx) => (
      ctx.telegram.sendMessage(ctx.chat.id, "start")
    ))
  }
}
