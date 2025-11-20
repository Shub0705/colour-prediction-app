import React, { useEffect, useState } from 'react';
import { getBalance, getHistory, join, recharge } from './api';
import {
  Box, Typography, Button, Modal, Checkbox, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';

const contractOptions = [10, 100, 1000, 10000];
const colors = [
  { key: 'green', label: 'Join Green', color: 'green' },
  { key: 'violet', label: 'Join Violet', color: 'purple' },
  { key: 'red', label: 'Join Red', color: 'red' },
];

export default function App() {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [modalData, setModalData] = useState(null);

  const [amount, setAmount] = useState(contractOptions[0]);
  const [number, setNumber] = useState(1);
  const [agree, setAgree] = useState(true);
  const [modalType, setModalType] = useState(null); // 'color' or 'number'
  const [selectedButton, setSelectedButton] = useState(null);

  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    const bal = await getBalance();
    setBalance(bal.balance);
    const hist = await getHistory();
    setHistory(hist);
  };

  useEffect(() => { fetchData(); }, []);

  // Modal handlers
  const openColorModal = (colorKey) => {
    setModalType('color');
    setModalData({ color: colorKey });
    setSelectedButton(colorKey);
    setAmount(contractOptions[0]);
    setNumber(1);
    setAgree(true);
    setMsg('');
  };
  const openNumberModal = (num) => {
    setModalType('number');
    setModalData({ number: num });
    setAmount(contractOptions[0]);
    setNumber(num);
    setAgree(true);
    setMsg('');
  };
  const closeModal = () => {
    setModalType(null);
    setModalData(null);
    setSelectedButton(null);
    setMsg('');
  };

  const handleConfirm = async () => {
    if (!agree) return setMsg('Please agree to the rules');
    let payload = {};
    if (modalType === 'color') payload = { colour: modalData.color, amount };
    if (modalType === 'number') payload = { number, amount };
    const result = await join(payload);
    if (result.error) setMsg(result.error);
    else {
      setMsg(`Your guess: ${modalData.color || number}. Correct number: ${result.correctNumber}. Result: ${result.result}`);
      await fetchData();
      setTimeout(closeModal, 1800);
    }
  };

  // Recharge (demo)
  const handleRecharge = async () => {
    const result = await recharge(1000);
    setBalance(result.balance);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ bgcolor: '#1976d2', color: "#fff", p: 2, borderRadius: 1 }}>
        <Typography variant="h6">Available balance: ₹ {balance}</Typography>
        <Button variant="contained" sx={{ mx: 1, bgcolor: "#ffeb3b", color: "#000" }} onClick={handleRecharge}>
          Recharge
        </Button>
        <Button variant="outlined" color="inherit" sx={{ mx: 1 }}>Read Rule</Button>
      </Box>

      {/* Color buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        {colors.map(col =>
          <Button
            key={col.key}
            variant={selectedButton === col.key ? 'contained' : 'outlined'}
            sx={{ bgcolor: col.color, color: '#fff', fontWeight: 600 }}
            onClick={() => openColorModal(col.key)}
          >
            {col.label}
          </Button>
        )}
      </Box>

      {/* Number grid */}
      <Box sx={{ my: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {[...Array(10)].map((_, n) =>
          <Button key={n}
            sx={{
              width: 48,
              height: 48,
              bgcolor: (n % 2 === 0) ? 'red' : 'green', color: '#fff',
              fontWeight: 700
            }}
            onClick={() => openNumberModal(n)}
          >
            {n}
          </Button>
        )}
      </Box>

      {/* History table */}
      <TableContainer component={Paper} sx={{ my: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.period}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.number !== null ? row.number : '-'}</TableCell>
                <TableCell>
                  <span style={{
                    color: row.result === 'win' ? 'green' : 'red',
                    fontWeight: 700
                  }}>
                    {row.result === 'win' ? '●' : '●'}
                  </span>
                  <span style={{ marginLeft: 6 }}>{row.result}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal (color/number selection) */}
      <Modal open={!!modalData} onClose={closeModal}>
        <Box sx={{ bgcolor: "#fff", px: 2, py: 3, borderRadius: 2, maxWidth: 350, mx: 'auto', mt: '12vh' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {modalType === 'color'
              ? `Join ${modalData.color.charAt(0).toUpperCase() + modalData.color.slice(1)}`
              : `Select ${number}`
            }
          </Typography>
          {/* Contract Money */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            {contractOptions.map(opt =>
              <Button key={opt}
                variant={amount === opt ? 'contained' : 'outlined'}
                onClick={() => setAmount(opt)}
              >{opt}</Button>
            )}
          </Box>
          {/* Number selection for number mode */}
          {modalType === 'number' &&
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <IconButton onClick={() => setNumber(Math.max(0, number - 1))} >-</IconButton>
              <TextField size="small" type="number" value={number} onChange={e => setNumber(parseInt(e.target.value) || 0)} sx={{ width: 68, mx: 1 }} />
              <IconButton onClick={() => setNumber(Math.min(9, number + 1))} >+</IconButton>
            </Box>
          }
          <Typography variant="body2" sx={{ mb: 2 }}>Total contract money is {amount}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Checkbox checked={agree} onChange={e => setAgree(e.target.checked)} />
            <Typography variant="body2">I agree&nbsp;<a href="#">PRESALE RULE</a></Typography>
          </Box>
          {msg && <Typography color="error" sx={{ mb: 1 }}>{msg}</Typography>}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={closeModal}>Close</Button>
            <Button variant="contained" onClick={handleConfirm}>Confirm</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
