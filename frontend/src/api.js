const API_URL = "http://localhost:5000/api";

export const getBalance = async () => {
  const res = await fetch(`${API_URL}/balance`);
  return res.json();
};

export const getHistory = async () => {
  const res = await fetch(`${API_URL}/history`);
  return res.json();
};

export const join = async (payload) => {
  const res = await fetch(`${API_URL}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const recharge = async (amount) => {
  const res = await fetch(`${API_URL}/recharge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  return res.json();
};
