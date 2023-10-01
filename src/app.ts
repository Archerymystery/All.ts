import { Telegraf } from "telegraf"
import { Hendler } from "./Handlers/Hendler"
import dotenv from "dotenv"
import { Start } from "./Handlers/Commands/Start"
dotenv.config()
class Bot {
  bot: Telegraf
  hendlers: Hendler[] = [];

  constructor(token: string) {
    this.bot = new Telegraf(token)
  }

  init() {
    this.hendlers = [new Start(this.bot)]
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
