import { Context, Telegraf } from "telegraf";
import { Handler } from "../Handler";
import { Downloader } from "@tobyg74/tiktok-api-dl"
import type { Update, Message, InputMediaPhoto } from "telegraf/types";
import { TiktokAPIResponse } from "@tobyg74/tiktok-api-dl/lib/types/downloader/tiktokApi";
export default class Text extends Handler {
  constructor(bot: Telegraf) {
    super(bot)
  }
  sendTiktok(ctx: Context<Update.MessageUpdate<Message.TextMessage>>): void {
    const url = ctx.message.text
    Downloader(url, {
      version: "v1"

    }).then((result: TiktokAPIResponse) => {
      if (result.status === "error") {
        ctx.reply("This video is private or remove")
      }
      if (
        result.result?.type === "video" &&
        result.result.video?.playAddr[0]
      ) {
        ctx.sendVideo(
          {
            url: result.result.video.playAddr[0],
          },
          {
            caption:
              `${result.result.description}\n[${result.result.author.nickname}](https://www.tiktok.com/@${result.result.author.nickname})`,
            parse_mode: 'Markdown'
          }).then(() => {
            if (result.result?.music) {
              ctx.replyWithAudio(
                {
                  url: result.result.music.playUrl[0],

                },
                {
                  thumbnail: { url: result.result.music.coverThumb[0] },
                  performer: result.result.music.author,
                  title: result.result.music.title,
                  duration: result.result.music.duration,
                }
              )
            }
          });
      } else if (result.result?.type === "image" && result.result?.images) {
        const groop: InputMediaPhoto[] = []

        result.result?.images.forEach((item) => {
          groop.push({ type: "photo", media: { url: item } })
        });
        ctx.replyWithMediaGroup(groop, {}).then(() => {
          if (result.result?.music && result.result.music) {
            ctx.replyWithAudio(
              {
                url: result.result.music.playUrl[0],

              },
              {
                thumbnail: { url: result.result.music.coverThumb[0] },
                performer: result.result.music.author,
                title: result.result.music.title,
                duration: result.result.music.duration,
              }
            )
          }
        })
      }

    })
  }
  handler(): void {
    console.log("Text")
    this.bot.on('text', async (ctx: Context<Update.MessageUpdate<Message.TextMessage>>) => {
      console.log(ctx.message.text)
      if (!ctx.message.text.startsWith("https://www.tiktok.com/@") &&
        ctx.message.text.startsWith("https://www.tiktok.com/") ||
        ctx.message.text.startsWith("https://vm.tiktok.com/") &&
        !ctx.message.text.startsWith("https://vm.tiktok.com/@")
      ) {
        this.sendTiktok(ctx)
      }
    })
  }
}
