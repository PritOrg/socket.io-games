import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Bingo from './bingo/Bingo';
import BingoForm from './bingo/BingoForm';
import { CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <BrowserRouter>
      <Routes>
        <CssBaseline />
        {/* <Route element={<BingoForm />} path='/'></Route> */}
        <Route element={<Bingo />} path='/'></Route>
      </Routes>
    </BrowserRouter>
    <App />
  </>
);
