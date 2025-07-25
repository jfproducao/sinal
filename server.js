const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Caminho para o arquivo JSON
const scheduleFilePath = path.join(__dirname, 'data', 'schedule.json');

// Rota para obter os horários
app.get('/api/schedule', (req, res) => {
  fs.readFile(scheduleFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return res.status(500).json({ error: 'Erro ao ler o arquivo' });
    }
    res.json(JSON.parse(data));
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
