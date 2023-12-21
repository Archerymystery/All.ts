import { Context, Markup, Telegraf } from "telegraf";
import { Handler } from "../Handler";
import { TiktokDL } from "@tobyg74/tiktok-api-dl"
import type { Update, Message, InputMediaPhoto, CallbackQuery } from "telegraf/types";

import { MusicalDownResponse } from "@tobyg74/tiktok-api-dl/lib/types/musicaldown";
import { MatchedMiddleware } from "telegraf/typings/composer";
export default class Text extends Handler {
  constructor(bot: Telegraf) {
    super(bot)
  }
  sendTiktok(ctx: Context<Update.MessageUpdate<Message.TextMessage>>): void {
    TiktokDL(ctx.message.text, {
      version: "v3"

    }).then((result) => {
      const musicalResult = result as MusicalDownResponse;
      const kayBoard = Markup.inlineKeyboard([
        Markup.button.callback("Download", `music:${ctx.message.text}`)
      ]);
      if (musicalResult.status === "error") {
        ctx.reply("This video is private or remove")
      }
      if (result.result?.type === "video" && musicalResult.result?.video1) {
        ctx.replyWithVideo({ url: musicalResult.result?.video1 }).then(() => {
          ctx.reply("Music", kayBoard)
        });;
      } else if (result.result?.type === "image") {
        const groop: InputMediaPhoto[] = []
        result.result.images?.forEach((item) => {
          groop.push({ type: "photo", media: { url: item } })
        });
        ctx.replyWithMediaGroup(groop, {}).then(() => {
          ctx.reply("Music", kayBoard)
        })

      }

    })
  }
  handler(): void {
    console.log("Text")
    this.bot.action(/music:(.+)/, async (ctx) => {
      TiktokDL(ctx.match[1], {
        version: "v3"
      }).then((result) => {
        const musicalResult = result as MusicalDownResponse
        if (musicalResult.result?.music) {
          ctx.replyWithAudio({ url: musicalResult.result?.music })
        }
      })
    });
    this.bot.on('text', async (ctx: Context<Update.MessageUpdate<Message.TextMessage>>) => {

      if (ctx.message.text.startsWith("https://www.tiktok.com/")
        || ctx.message.text.startsWith("https://vm.tiktok.com/")
      ) {
        this.sendTiktok(ctx)
      }
    })

  }
}
