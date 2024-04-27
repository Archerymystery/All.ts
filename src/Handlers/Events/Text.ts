import { Context, Telegraf } from "telegraf";
import { Handler } from "../Handler";
import { TiktokDL } from "@tobyg74/tiktok-api-dl"
import type { Update, Message, InputMediaPhoto } from "telegraf/types";
import { MusicalDownResponse } from "@tobyg74/tiktok-api-dl/lib/types/musicaldown";
export default class Text extends Handler {
  constructor(bot: Telegraf) {
    super(bot)
  }
  sendTiktok(ctx: Context<Update.MessageUpdate<Message.TextMessage>>): void {
    const url = ctx.message.text
    TiktokDL(url, {
      version: "v3"

    }).then((result) => {
      const MusicalDownAPI = result as MusicalDownResponse;
      if (MusicalDownAPI.status === "error") {
        ctx.reply("This video is private or remove")
      }
      if (
        MusicalDownAPI.result?.type === "video" &&
        MusicalDownAPI.result.video1
      ) {
        ctx.sendVideo(
          {
            url: MusicalDownAPI.result.video1,
          },
          {
            caption:
              `${MusicalDownAPI.result.desc}\n[${MusicalDownAPI.result.author.nickname}](https://www.tiktok.com/@${MusicalDownAPI.result.author.nickname})`,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: "HD Video", callback_data: `tiktokHD:${url}` }]
              ]
            }
          }).then(() => {
            if (MusicalDownAPI.result?.music &&
              MusicalDownAPI.result.music
            ) {
              ctx.replyWithAudio(
                {
                  url: MusicalDownAPI.result.music,
                }
              )
            }
          });
      } else if (result.result?.type === "image" && MusicalDownAPI.result?.images) {
        const groop: InputMediaPhoto[] = []

        MusicalDownAPI.result?.images.forEach((item) => {
          groop.push({ type: "photo", media: { url: item } })
        });
        ctx.replyWithMediaGroup(groop, {}).then(() => {
          if (MusicalDownAPI.result?.music && MusicalDownAPI.result.music) {
            ctx.replyWithAudio(
              {
                url: MusicalDownAPI.result.music
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
    this.bot.action(/^tiktokHD:(.*)$/, (ctx) => {
      if (!ctx) return
      TiktokDL(ctx.match[1], {
        version: "v3"

      }).then((result) => {
        const MusicalDownAPI = result as MusicalDownResponse;
        if (MusicalDownAPI.status === "error") {
          ctx.reply("This video is private or remove")
        }
        if (
          MusicalDownAPI.result?.type === "video" &&
          MusicalDownAPI.result.video_hd
        ) {
          ctx.sendVideo(
            {
              url: MusicalDownAPI.result.video_hd,
            },
          )
        }
      });
    });

  }
}
