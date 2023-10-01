import { Telegraf } from "telegraf";
import { Hendler } from "../Hendler";

export class Text extends Hendler {
  constructor(bot: Telegraf) {
    super(bot)
  }
  handler(): void {
    this.bot.on('text', (ctx) => {
      ctx.reply(ctx.message.text)
    })
  }
}
