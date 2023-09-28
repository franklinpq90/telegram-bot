import { Bot } from "grammy";

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

// Tabla de Correspondencia
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
    // Si el código no se encuentra en la tabla, simplemente no hará nada
});

bot.start();
