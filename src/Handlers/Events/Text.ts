import { Telegraf } from "telegraf";
import { Handler } from "../Handler";

export class Text extends Handler {
  constructor(bot: Telegraf) {
    super(bot)
  }
  tiktok_dounloder(videoUrl: string): void {
    console.log(videoUrl)
  }
  handler(): void {
    console.log("Text")
    this.bot.on('text', (ctx) => {
      console.log(ctx.message.text)
      if (ctx.message.text.startsWith("https://www.tiktok.com/") || ctx.message.text.startsWith("https://vm.tiktok.com/")) {
        this.tiktok_dounloder(ctx.message.text)
      }
    })

  }
}
