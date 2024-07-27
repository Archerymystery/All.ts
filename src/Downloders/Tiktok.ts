import { TiktokAPIResponse } from "@tobyg74/tiktok-api-dl/lib/types/downloader/tiktokApi";
import logger from "../logger";
import { Downloader } from "@tobyg74/tiktok-api-dl"
import type { Update, Message, InputMediaPhoto } from "telegraf/types";
import { Context } from "telegraf";
export default function sendTiktoks(ctx: Context<Update.MessageUpdate<Message.TextMessage>>, urls: string[]): void {
  if (urls.length == 0) return
  Downloader(urls[0], {
    version: "v1"

  }).then((result: TiktokAPIResponse) => {
    logger.info(`Start sending tiktok: ${urls[0]} for user: @${ctx.message.from.username} chat id: ${ctx.message.chat.id}  `)
    if (result.status === "error") {
      ctx.reply("This video is private or remove")
      urls.shift()
      sendTiktoks(ctx, urls)

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
            ).then(() => {
              urls.shift()
              sendTiktoks(ctx, urls)
            })
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
          ).then(() => {
            urls.shift()
            sendTiktoks(ctx, urls)
          })
        }
      })
    }

  })
}
