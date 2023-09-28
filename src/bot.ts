import { Bot } from "grammy";

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

const alarmCodes: Record<string, string> = {
  "001": "El vecino Carlos ha activado la alarma",
  "002": "El vecino Ana ha activado la alarma",
  "003": "El vecino Pedro ha activado la alarma",
  "004": "El vecino Maria ha activado la alarma",
  "005": "El vecino Jorge ha activado la alarma",
  "006": "El vecino Carmen ha activado la alarma",
  "007": "El vecino Roberto ha activado la alarma",
  "008": "El vecino Lucia ha activado la alarma",
  "009": "El vecino Sergio ha activado la alarma",
  "010": "El vecino Mariana ha activado la alarma"
};

bot.on("message", (ctx) => {
  const code = ctx.message?.text;
  if (code && alarmCodes[code]) {
    ctx.reply(alarmCodes[code]);
  }
});

bot.command("start", (ctx) => {
  ctx.reply("Hola, soy el bot de alarma de la urbanización. Esperando códigos...");
});

bot.start().catch(err => console.error(err));
