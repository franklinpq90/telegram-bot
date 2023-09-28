import { Bot } from "grammy";
import express from "express";

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

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

bot.on("message", (ctx) => {
    const codigo = ctx.message?.text;
    if (codigo && vecinos.hasOwnProperty(codigo)) {
        ctx.reply(`El vecino ${vecinos[codigo]} ha activado la alarma`);
    }
});

// Añadiendo servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot está en funcionamiento.');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    bot.start().catch(err => console.error(err));
});
