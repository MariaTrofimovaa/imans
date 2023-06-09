const express = require("express");
const fs = require('fs');

const router = express.Router();

// Обработчик POST-запроса на добавление в csv
router.post('/', (req, res) => {
  const formData = req.body;

  // Преобразование данных формы в CSV-строку
  const date = new Date().toISOString()
  const csvData = date + ';' + Object.keys(formData).map(field => `${formData[field]}`).join(';');

  // Чтение существующего CSV файла
  const fileName = 'imans_data.csv';
  fs.readFile(fileName, 'utf8', (error, existingData) => {
    if (error) {
      console.error('Ошибка при чтении данных формы:', error);
      res.status(500).send('Ошибка при чтении данных формы');
      return;
    }

    // Объединение существующих данных с новыми данными
    const updatedData = existingData + '\n' + csvData;

    // Запись обновленных данных в файл
    fs.writeFile(fileName, updatedData, 'utf8', error => {
      if (error) {
        console.error('Ошибка при сохранении данных формы:', error);
        res.status(500).send('Ошибка при сохранении данных формы');
      } else {
        console.log(`Данные формы добавлены в файл ${fileName}`);
        res.download(fileName); // Отправка файла клиенту для скачивания
      }
    });
  });
});

module.exports = router;