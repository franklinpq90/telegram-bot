import dotenv from 'dotenv';
dotenv.config();
import { Bot, webhookCallback } from "grammy";
import express from "express";

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const USER_ID = 352099074; 
const GROUP_ID = -1001944748227; 
const WAKE_UP_DELAY = 2000;

const generateRegistrationMessage = (name: string) => {
    return `*${name}* se ha registrado correctamente en el sistema de alarma.`;
};

const neighborsMapping: { [key: string]: string } = {
    "andreafabiola1997@gmail.com": generateRegistrationMessage("Andrea Rodríguez, hija de Pedro"),
    "andreavera1010@icloud.com": generateRegistrationMessage("Andrea Vera, hija de Juan"),
    "portoviejojc@gmail.com": generateRegistrationMessage("Antonio Chinga"),
    "candraus@gmail.com": generateRegistrationMessage("César Andraus"),
    "cindygiselle6@gmail.com": generateRegistrationMessage("Cindy Díaz, esposa de Franklin"),
    "dannyserrano0708@gmail.com": generateRegistrationMessage("Danny Serrano"),
    "davidordonez46@gmail.com": generateRegistrationMessage("David Ordóñez"),
    "dayiarteaga94@hotmail.com": generateRegistrationMessage("Dayanna Arteaga"),
    "equindemil@gmail.com": generateRegistrationMessage("Eneida Quindemil"),
    "exiochaparro@gmail.com": generateRegistrationMessage("Exio Chaparro"),
    "frumbaut@gmail.com": generateRegistrationMessage("Felipe Rumbaut"),
    "franklin.pq90@gmail.com": generateRegistrationMessage("Franklin Padrón"),
    "gabita307@hotmail.com": generateRegistrationMessage("Gaby Miranda"),
    "ginamera307@gmail.com": generateRegistrationMessage("Gina Mera"),
    "irinuskauz@gmail.com": generateRegistrationMessage("Irinuska Ureta"),
    "janicerumbaut4@gmail.com": generateRegistrationMessage("Janice Rumbaut"),
    "josmirbega@gmail.com": generateRegistrationMessage("Josmir Benítez"),
    "yiyoverapigsa@gmail.com": generateRegistrationMessage("Juan Vera"),
    "pablitogod123@gmail.com": generateRegistrationMessage("Juan Pablo Mogro Miranda"),
    "otromen1999@gmail.com": generateRegistrationMessage("Leonardo Benítez"),
    "leslievelez39@gmail.com": generateRegistrationMessage("Leslie Velez"),
    "cedenolorenat66@gmail.com": generateRegistrationMessage("Lorena Cedeño"),
    "luisanajc1965@gmail.com": generateRegistrationMessage("Luisana Hurtado"),
    "ma.eugeniazevallos@hotmail.com": generateRegistrationMessage("María Eugenia Zevallos"),
    "gemabravo48@gmail.com": generateRegistrationMessage("Mariana Cedeño"),
    "pmarinaez@hotmail.com": generateRegistrationMessage("Marina Espinel"),
    "mauricio94-29@hotmail.com": generateRegistrationMessage("Mauricio Macias"),
    "vazquezmichel616@gmail.com": generateRegistrationMessage("Michel Vázquez"),
    "futbol1986@hotmail.com": generateRegistrationMessage("Orlando Alava"),
    "patriciomiranda58@gmail.com": generateRegistrationMessage("Patricio Miranda"),
    "delnorteporton@gmail.com": generateRegistrationMessage("Pedro Rodríguez"),
    "rramosh89@gmail.com": generateRegistrationMessage("Rafael Ramos"),
    "ramonvelez123456@gmail.com": generateRegistrationMessage("Ramón Velez"),
    "mirandashailyn@gmail.com": generateRegistrationMessage("Shailyn Miranda"),
    "silvipatty875@hotmail.com": generateRegistrationMessage("Silvia Saltos"),
    "xscarrera@hotmail.com": generateRegistrationMessage("Ximena Carrera"),
    "biomedick.ec@gmail.com": generateRegistrationMessage("Yuna Nuñez"),
    "zulbeyrivero@gmail.com": generateRegistrationMessage("Zulbey Rivero"),
    "verac9730@gmail.com": generateRegistrationMessage("Carlos Vera"),
    "viankmeza@gmail.com": generateRegistrationMessage("Vianka Meza"),
    "ney_zapata@hotmail.com": generateRegistrationMessage("Ney Zapata"),
    "juancmoreirab@hotmail.com": generateRegistrationMessage("Juan Carlos Moreira"),
    "enriqueruiz68@hotmail.com": generateRegistrationMessage("Enrique Ruiz"),
    "joronues@hotmail.com": generateRegistrationMessage("Jhonny Nuñez"),
    "mabelchacon7@gmail.com": generateRegistrationMessage("Mabel Chacón"),
    "ingvictormacias_13@hotmail.com": generateRegistrationMessage("Victor Macias"),
    "luiswittong87@gmail.com": generateRegistrationMessage("Luis Wittong"),
    "marcosbenicha@gmail.com": generateRegistrationMessage("Marcos Benitez"),
    "edgargarcia9565@gmail.com": generateRegistrationMessage("Edgar García")
};

bot.command('wake_up', (ctx) => {});

const app = express();
app.use(express.json());

app.post("/ifttt-webhook", async (req, res) => {
    const data = req.body;

    if (data && data.user_id) {
        const messageToSend = neighborsMapping[data.user_id];
        if (messageToSend) {
            bot.api.sendMessage(USER_ID, "/wake_up");
            bot.api.sendMessage(GROUP_ID, "/wake_up");

            await new Promise(resolve => setTimeout(resolve, WAKE_UP_DELAY));

            bot.api.sendMessage(USER_ID, messageToSend, { parse_mode: 'Markdown' });
            bot.api.sendMessage(GROUP_ID, messageToSend, { parse_mode: 'Markdown' });
        }
    }

    res.status(200).send("OK");
});

app.use(webhookCallback(bot, "express"));

const PORT = process.env.PORT || 3000;
app.listen(PORT);

if (process.env.NODE_ENV !== "production") {
    bot.start();
}