import { Telegraf } from "telegraf";
import { Handler } from "../Handler";

export class Start extends Handler {
  constructor(bot: Telegraf) {
    super(bot);
  }
  handler(): void {
    console.log("Start")
    this.bot.start((ctx) => (
      ctx.telegram.sendMessage(ctx.chat.id, "start")
    ))
  }
}
