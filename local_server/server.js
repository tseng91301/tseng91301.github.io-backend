const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { createClient } = require('redis');

const cors = require('cors');
const allowedOrigins = [
  'http://localhost:8081',
  'https://tseng91301.github.io',
  'https://tseng91301.dpdns.org'
];

const corsOptions = {
  origin: function (origin, callback) {
    // 當 origin 為 undefined（例如 curl 或直接在後端呼叫）時也允許
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

app.use(cors(corsOptions));

const port = 3273;

// 中介軟體，解析 JSON 請求
// app.use(express.json());
app.use(bodyParser.json()); // 支援 JSON
app.use(bodyParser.urlencoded({ extended: true })); // 支援 application/x-www-form-urlencoded

function generateRandomString(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }

  return result;
}

// 假設的城市數據
let cities = [
  { id: 1, name: 'Taipei', population: 2717000 },
  { id: 2, name: 'Tokyo', population: 13960000 },
  { id: 3, name: 'New York', population: 8419600 },
];

// 獲取所有城市
app.get('/cities', (req, res) => {
  console.log("Get cities");
  res.json(cities);
});

// 根據 ID 獲取城市
app.get('/cities/:id', (req, res) => {
  const city = cities.find(c => c.id === parseInt(req.params.id));
  if (!city) return res.status(404).send('City not found');
  res.json(city);
});

// 添加新城市
app.post('/cities', (req, res) => {
  const newCity = {
    id: cities.length + 1,
    name: req.body.name,
    population: req.body.population,
  };
  cities.push(newCity);
  res.status(201).json(newCity);
});

app.post('/time_reservation', (req, res) => {
  const newReservation = {
    id: generateRandomString(10),
    name: req.body.name,
    contact: req.body.contact,
    date: req.body.date,
    message: req.body.message,
    other: req.body.other
  }
  console.log(newReservation);
  (async () => {
    const redis = createClient(); // 預設連 localhost:6379
    await redis.connect();

    await redis.publish('newReservation', JSON.stringify(newReservation));

    console.log('✅ 已儲存到 Redis');

    await redis.disconnect();
  })();
  res.status(201).json({ "id": newReservation.id });
})

// 啟動伺服器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
