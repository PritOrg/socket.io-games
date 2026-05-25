import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaperPartyLanding from './components/PaperPartyLanding';
import Bingo from './bingo/Bingo';
import TicTacToe from './tictactoe/TicTacToe';
import UTTTGame from './uttt/UTTTGame';
import DabGame from './dab/DabGame';
import SOSGame from './sos/SOSGame';
import Connect4Game from './connect4/Connect4Game';
import NotFound from './components/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<PaperPartyLanding />} />
          <Route path="/bingo" element={<Bingo />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/uttt" element={<UTTTGame />} />
          <Route path="/dab" element={<DabGame />} />
          <Route path="/sos" element={<SOSGame />} />
          <Route path="/connect4" element={<Connect4Game />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
