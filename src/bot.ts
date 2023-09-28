import { Bot } from "grammy";

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

const neighbors = {
    "001": "El vecino Carlos ha activado la alarma",
    "002": "El vecino Pedro ha activado la alarma",
    "003": "La vecina Maria ha activado la alarma",
    "004": "El vecino Juan ha activado la alarma",
    "005": "La vecina Carla ha activado la alarma",
    "006": "El vecino Roberto ha activado la alarma",
    "007": "La vecina Gabriela ha activado la alarma",
    "008": "El vecino Esteban ha activado la alarma",
    "009": "La vecina Clara ha activado la alarma",
    "010": "El vecino Jose ha activado la alarma",
};

bot.on("message", (ctx) => {
    const text = ctx.message?.text || "";
    const response = neighbors[text];
    if (response) {
        ctx.reply(response);
    }
});

bot.command("start", (ctx) => {
    ctx.reply("Hola, soy el bot de la urbanización. Esperando códigos de alarma...");
});

bot.start().catch(err => console.error(err));
