import { Bot } from "grammy";

// Asegúrate de que esta línea esté obteniendo el token adecuadamente
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
if (!TELEGRAM_TOKEN) {
    throw new Error("TELEGRAM_TOKEN is not set in the environment variables.");
}

const bot = new Bot(TELEGRAM_TOKEN);

const vecinos = {
    "001": "Carlos",
    "002": "María",
    "003": "Jorge",
    "004": "Luisa",
    "005": "Roberto",
    "006": "Elena",
    "007": "Pedro",
    "008": "Ana",
    "009": "Miguel",
    "010": "Sofía",
};

bot.on("message", (ctx) => {
    const codigo = ctx.message?.text;
    if (vecinos[codigo]) {
        ctx.reply(`El vecino ${vecinos[codigo]} ha activado la alarma`);
    }
});

bot.start().catch(err => console.error(err));
