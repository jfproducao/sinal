const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Necessário para ler JSON no corpo da requisição

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

// Rota para editar os horários
app.put('/api/schedule', (req, res) => {
  const novoHorario = req.body;

  if (!novoHorario || typeof novoHorario !== 'object') {
    return res.status(400).json({ error: 'Dados inválidos enviados' });
  }

  fs.writeFile(scheduleFilePath, JSON.stringify(novoHorario, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Erro ao escrever no arquivo:', err);
      return res.status(500).json({ error: 'Erro ao salvar os dados' });
    }
    res.json({ message: 'Horários atualizados com sucesso!' });
  });
});


// rota para deletar horarios
app.delete('/api/schedule/:dia/:hora', (req, res) => {
  const { dia, hora } = req.params;

  fs.readFile(scheduleFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erro ao ler o arquivo' });

    let schedule = JSON.parse(data);

    if (!schedule[dia]) {
      return res.status(404).json({ error: `Dia '${dia}' não encontrado` });
    }

    schedule[dia] = schedule[dia].filter(h => h !== hora);

    fs.writeFile(scheduleFilePath, JSON.stringify(schedule, null, 2), 'utf8', err => {
      if (err) return res.status(500).json({ error: 'Erro ao salvar o arquivo' });
      res.json({ message: `Horário ${hora} removido de ${dia}` });
    });
  });
});


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em ${PORT}`);
});
