import { Telegraf } from "telegraf";

export abstract class Handler {
  protected bot: Telegraf
  constructor(bot: Telegraf) {
    this.bot = bot;
  }
  abstract handler(): void;
}
