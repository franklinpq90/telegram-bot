import dotenv from 'dotenv';
dotenv.config();
import { Bot, webhookCallback } from "grammy";
import express from "express";
import crypto from "crypto";
import fetch from "node-fetch";

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
const USER_ID = 352099074; 
const GROUP_ID = -1001944748227; 
const WAKE_UP_DELAY = 2000;

const generateAlertMessage = (name: string) => {
    return `*${name}* se ha registrado correctamente en el sistema de alarma.`;
};

const neighborsMapping: { [key: string]: string } = {
    "andreafabiola1997@gmail.com": generateAlertMessage("Andrea Rodríguez"),
    "andreavera1010@icloud.com": generateAlertMessage("Andrea Vera, hija de Juan"),
    "portoviejojc@gmail.com": generateAlertMessage("Antonio Chinga"),
    "candraus@gmail.com": generateAlertMessage("César Andraus"),
    "cindygiselle6@gmail.com": generateAlertMessage("Cindy Díaz"),
    "dannyserrano0708@gmail.com": generateAlertMessage("Danny Serrano"),
    "davidordonez46@gmail.com": generateAlertMessage("David Ordóñez"),
    "dayiarteaga94@hotmail.com": generateAlertMessage("Dayanna Arteaga"),
    "equindemil@gmail.com": generateAlertMessage("Eneida Quindemil"),
    "exiochaparro@gmail.com": generateAlertMessage("Exio Chaparro"),
    "frumbaut@gmail.com": generateAlertMessage("Felipe Rumbaut"),
    "franklin.pq90@gmail.com": generateAlertMessage("Franklin Padrón"),
    "gabita307@hotmail.com": generateAlertMessage("Gaby Miranda"),
    "ginamera307@gmail.com": generateAlertMessage("Gina Mera"),
    "irinuskauz@gmail.com": generateAlertMessage("Irinuska Ureta"),
    "janicerumbaut4@gmail.com": generateAlertMessage("Janice Rumbaut"),
    "josmirbega@gmail.com": generateAlertMessage("Josmir Benítez"),
    "yiyoverapigsa@gmail.com": generateAlertMessage("Juan Vera"),
    "pablitogod123@gmail.com": generateAlertMessage("Juan Pablo Mogro Miranda"),
    "otromen1999@gmail.com": generateAlertMessage("Leonardo Benítez"),
    "leslievelez39@gmail.com": generateAlertMessage("Leslie Velez"),
    "cedenolorenat66@gmail.com": generateAlertMessage("Lorena Cedeño"),
    "luisanajc1965@gmail.com": generateAlertMessage("Luisana Hurtado"),
    "ma.eugeniazevallos@hotmail.com": generateAlertMessage("María Eugenia Zevallos"),
    "gemabravo48@gmail.com": generateAlertMessage("Mariana Cedeño"),
    "pmarinaez@hotmail.com": generateAlertMessage("Marina Espinel"),
    "mauricio94-29@hotmail.com": generateAlertMessage("Mauricio Macias"),
    "vazquezmichel616@gmail.com": generateAlertMessage("Michel Vázquez"),
    "futbol1986@hotmail.com": generateAlertMessage("Orlando Alava"),
    "patriciomiranda58@gmail.com": generateAlertMessage("Patricio Miranda"),
    "delnorteporton@gmail.com": generateAlertMessage("Pedro Rodríguez"),
    "rramosh89@gmail.com": generateAlertMessage("Rafael Ramos"),
    "ramonvelez123456@gmail.com": generateAlertMessage("Ramón Velez"),
    "mirandashailyn@gmail.com": generateAlertMessage("Shailyn Miranda"),
    "silvipatty875@hotmail.com": generateAlertMessage("Silvia Saltos"),
    "xscarrera@hotmail.com": generateAlertMessage("Ximena Carrera"),
    "biomedick.ec@gmail.com": generateAlertMessage("Yuna Nuñez"),
    "zulbeyrivero@gmail.com": generateAlertMessage("Zulbey Rivero"),
    "verac9730@gmail.com": generateAlertMessage("Carlos Vera"),
    "viankmeza@gmail.com": generateAlertMessage("Vianka Meza"),
    "ney_zapata@hotmail.com": generateAlertMessage("Ney Zapata"),
    "juancmoreirab@hotmail.com": generateAlertMessage("Juan Carlos Moreira"),
    "enriqueruiz68@hotmail.com": generateAlertMessage("Enrique Ruiz"),
    "joronues@hotmail.com": generateAlertMessage("Jhonny Nuñez"),
    "mabelchacon7@gmail.com": generateAlertMessage("Mabel Chacón"),
    "ingvictormacias_13@hotmail.com": generateAlertMessage("Victor Macias"),
    "luiswittong87@gmail.com": generateAlertMessage("Luis Wittong"),
    "marcosbenicha@gmail.com": generateAlertMessage("Marcos Benitez"),
    "dpmiranda_@outlook.com": generateAlertMessage("David Miranda")
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

// NUEVO ENDPOINT PARA ENCENDER EL VENTILADOR DESDE LA WEB
app.post("/tuya-ventilador", async (req, res) => {
    const data = req.body;

    if (!data || !data.user_id) {
        return res.status(400).json({ error: "Falta user_id" });
    }

    const ACCESS_ID = "g5phehaqdn5pvdmvfvp48";
    const ACCESS_SECRET = "49a2d1a17bb74bf58b9c7d896748c40f";
    const DEVICE_ID = "eb2a758589951542e4qhi3";
    const API_HOST = "https://openapi.tuyaus.com";

    try {
        const t1 = Date.now().toString();
        const sign1 = crypto.createHmac("sha256", ACCESS_SECRET)
            .update(ACCESS_ID + t1)
            .digest("hex")
            .toUpperCase();

        const tokenRes = await fetch(`${API_HOST}/v1.0/token?grant_type=1`, {
            headers: {
                "client_id": ACCESS_ID,
                "sign": sign1,
                "t": t1,
                "sign_method": "HMAC-SHA256"
            }
        });

        const tokenData = await tokenRes.json();
        const token = tokenData.result.access_token;

        const t2 = Date.now().toString();
        const sign2 = crypto.createHmac("sha256", ACCESS_SECRET)
            .update(ACCESS_ID + token + t2)
            .digest("hex")
            .toUpperCase();

        const controlRes = await fetch(`${API_HOST}/v1.0/devices/${DEVICE_ID}/commands`, {
            method: "POST",
            headers: {
                "client_id": ACCESS_ID,
                "access_token": token,
                "sign": sign2,
                "t": t2,
                "sign_method": "HMAC-SHA256",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                commands: [
                    { code: "switch_1", value: true }
                ]
            })
        });

        const result = await controlRes.json();
        console.log("✅ Ventilador encendido:", result);
        res.json({ ok: true, result });

    } catch (err) {
        console.error("❌ Error al encender el ventilador:", err);
        res.status(500).json({ error: "Error al encender el ventilador" });
    }
});

app.use(webhookCallback(bot, "express"));

const PORT = process.env.PORT || 3000;
app.listen(PORT);

if (process.env.NODE_ENV !== "production") {
    bot.start();
}
