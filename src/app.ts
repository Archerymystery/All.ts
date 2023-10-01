import { Telegraf } from "telegraf"
import { Hendler } from "./Handlers/Hendler"
import dotenv from "dotenv"
dotenv.config()
class Bot {
  bot: Telegraf
  hendlers: Hendler[] = [];

  constructor(token: string) {
    this.bot = new Telegraf(token)
  }

  init() {
    this.hendlers = []
    for (const hendler of this.hendlers) {
      hendler.handler()
    }
    this.bot.launch()
  }
}
if (!process.env.TOKEN) {
  throw new Error("Token was not found in .env file")
}
const bot = new Bot(process.env.TOKEN)
bot.init()
