import { Bot, webhookCallback } from "grammy";
import express from "express";

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const app = express();

const vecinos: { [key: string]: string } = {
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

bot.command("start", (ctx) => {
    ctx.reply("¡Hola! Este es el bot de la urbanización. Envía un código para obtener la respuesta correspondiente.");
});

bot.on("message", (ctx) => {
    const codigo = ctx.message?.text;
    if (codigo && vecinos.hasOwnProperty(codigo)) {
        ctx.reply(`El vecino ${vecinos[codigo]} ha activado la alarma`);
    }
});

// Actualización para manejar las peticiones del webhook
app.use(express.json());
app.use('/webhook', webhookCallback(bot));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started and listening on port ${PORT}`);
});
