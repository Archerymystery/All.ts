import { Telegraf } from "telegraf"
import fs from "fs/promises"
import path from "path";
import { Start } from "./Handlers/Commands/Start";

async function addHandlers(modulePath: string, bot: Telegraf) {
  const files = await fs.readdir(modulePath);
  console.log(files)
  for (const file of files) {
    const fullPath = path.join(modulePath, file);
    if ((await fs.stat(fullPath)).isDirectory()) {
      await addHandlers(fullPath, bot);
    } else if (file.endsWith('.ts') && !file.endsWith('Handler.ts')) {
      const moduleImport = await import(fullPath);
      const module = moduleImport
      if (module.handler && typeof module.handler === 'function') {
        module.handler()
      }
    }
  }
}

class Bot {
  bot: Telegraf


  constructor(token: string) {
    this.bot = new Telegraf(token)
  }

  init() {
    const handlerPath = path.join(__dirname, "Handlers")
    addHandlers(handlerPath, this.bot)
    console.log("start")
    this.bot.launch()
  }
}
//if (!process.env.TOKEN) {
// throw new Error("")

//}
const bot = new Bot("5723902855:AAEurpRxqMTQ-LPWART-lkQIVqGl4vauUBE")
bot.init()
