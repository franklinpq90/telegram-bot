import { Bot } from "grammy";
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

bot.on("message", (ctx) => {
    const codigo = ctx.message?.text;
    if (codigo && vecinos.hasOwnProperty(codigo)) {
        ctx.reply(`El vecino ${vecinos[codigo]} ha activado la alarma`);
    }
});

// Añadir un punto final para el webhook
app.use(express.json());
app.post('/webhook', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started and listening on port ${PORT}`);
});
