import { Telegraf } from "telegraf";
import { Handler } from "../Handler";

export class Text extends Handler {
  constructor(bot: Telegraf) {
    super(bot)
  }
  tiktok_dounloder(videoUrl: string): void {
    fetch("", { method: "GET" }).then(response => {

    }).catch((err) => {

    })
  }
  handler(): void {
    console.log("Text")
    this.bot.on('text', (ctx) => {

    })

  }
}
