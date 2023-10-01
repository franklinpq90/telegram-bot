import dotenv from 'dotenv';
dotenv.config();
import { Bot, webhookCallback } from "grammy";
import express from "express";

// Create a bot using the Telegram token
const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

// Definición del mapeo de códigos de vecinos
const neighborsMapping: { [key: string]: string } = {
    "/001": "El vecino Pepito ha activado la alarma",
    "/002": "El vecino Ana ha activado la alarma",
    "/003": "El vecino Luis ha activado la alarma",
    "/004": "El vecino Marta ha activado la alarma",
    "/005": "El vecino Pedro ha activado la alarma",
    "/006": "El vecino Carmen ha activado la alarma",
    "/007": "El vecino Antonio ha activado la alarma",
    "/008": "El vecino Teresa ha activado la alarma",
    "/009": "El vecino José ha activado la alarma",
    "/010": "El vecino Isabel ha activado la alarma",
    // ... añade más si es necesario
};

const registerNeighborCommands = () => {
    for (const [command, message] of Object.entries(neighborsMapping)) {
        bot.command(command.slice(1), (ctx) => ctx.reply(message));
    }
}

registerNeighborCommands();  // Aquí está la llamada que faltaba
bot.api.setMyCommands([]);
// Start the server
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  // Use Long Polling for development
  bot.start();
}
