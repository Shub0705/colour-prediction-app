# Colour & Number Prediction App
```bash
colour-prediction-app/
  ├── backend/
  │     ├── index.js
  │     ├── models/
  │     └── db.sqlite3
  ├── frontend/
  │     ├── src/
  │     │    ├── App.js
  │     │    ├── components/
  │     │    └── pages/
  │     └── package.json
  ├── docker-compose.yml
  └── README.md
```
## Features

- Colour/Number prediction
- Simulated result, win/loss
- Table history, balance, recharge (demo)
- Modern UI (React + MUI), Express + SQLite backend

## Run

### Backend
```bash
cd backend
npm install
node index.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```

- Open the frontend at: [http://localhost:3000](http://localhost:3000)
- Make sure backend is running at port 5000.

---

You can edit/expand components in `frontend/src/components/` and multi-page support in `frontend/src/pages/` as you learn more!
