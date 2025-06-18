import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import crypto from 'crypto';
import axios from 'axios';

const app = express();
app.use(express.json());

// Variables desde Render
const CLIENT_ID = process.env.TUYA_ACCESS_ID || '';
const CLIENT_SECRET = process.env.TUYA_ACCESS_SECRET || '';
const DEVICE_ID = process.env.TUYA_DEVICE_ID || '';
const COMMAND_CODE = process.env.TUYA_DEVICE_COMMAND_CODE || 'switch_1';

// Función para firmar la petición
function getTuyaSignature(clientId: string, clientSecret: string, timestamp: string): string {
  const message = clientId + timestamp;
  return crypto.createHmac('sha256', clientSecret).update(message).digest('hex').toUpperCase();
}

// Ruta para encender el dispositivo
app.post('/encender-ventilador', async (req, res) => {
  try {
    const timestamp = Date.now().toString();
    const sign = getTuyaSignature(CLIENT_ID, CLIENT_SECRET, timestamp);

    const response = await axios.post(
      `https://openapi.tuyaus.com/v1.0/devices/${DEVICE_ID}/commands`,
      {
        commands: [
          {
            code: COMMAND_CODE,
            value: true,
          },
        ],
      },
      {
        headers: {
          'client_id': CLIENT_ID,
          'sign': sign,
          't': timestamp,
          'sign_method': 'HMAC-SHA256',
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false, error: response.data });
    }
  } catch (error) {
    console.error('Error al enviar comando a Tuya:', error);
    res.status(500).json({ success: false, error });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot activo en puerto ${PORT}`);
});
