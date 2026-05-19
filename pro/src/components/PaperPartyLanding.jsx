import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import RetroButton from './ui/RetroButton';
import Swal from 'sweetalert2';
import { Dices, Hash, User, Grid3X3, Square } from 'lucide-react';

const GameCard = ({ title, description, onClick, icon: Icon }) => (
  <div 
    onClick={onClick}
    className="group relative p-4 sm:p-8 rounded-xl sm:rounded-2xl glass cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl sm:rounded-2xl" />
    <div className="mb-2 sm:mb-4 text-blue-600 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
      <Icon size={32} className="sm:size-48" strokeWidth={1.5} />
    </div>
    <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 hand-drawn text-gray-800">{title}</h3>
    <p className="text-xs sm:text-gray-600 paper-font text-[10px] sm:text-base">{description}</p>
  </div>
);

const PaperPartyLanding = () => {
  const { playerName, setPlayerName } = useGameContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!playerName) {
      Swal.fire({
        title: 'Welcome to PaperParty!',
        text: 'What is your name, player?',
        input: 'text',
        inputPlaceholder: 'Enter your name...',
        allowOutsideClick: false,
        confirmButtonText: 'Let\'s Play!',
        customClass: {
          popup: 'glass rounded-3xl paper-font',
          title: 'hand-drawn text-3xl',
          confirmButton: 'bg-blue-500/80 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold transition-all'
        },
        buttonsStyling: false,
        inputValidator: (value) => {
          if (!value) return 'We need a name to start the party!';
        }
      }).then((result) => {
        if (result.isConfirmed) {
          setPlayerName(result.value);
        }
      });
    }
  }, [playerName, setPlayerName]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="text-center mb-6 sm:mb-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl hand-drawn mb-2 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
          PaperParty
        </h1>
        <p className="text-sm sm:text-xl md:text-2xl paper-font text-gray-600 max-w-2xl mx-auto">
          Multiplayer games that feel like the back of your notebook.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 max-w-5xl w-full px-2 sm:px-0">
        <GameCard 
          title="Bingo" 
          description="The classic 5x5 numbers game. Race to cross out your lines!"
          icon={Hash}
          onClick={() => navigate('/bingo')}
        />
        <GameCard 
          title="Tic Tac Toe" 
          description="Strategize and outsmart your opponent in this timeless 3x3 battle."
          icon={Dices}
          onClick={() => navigate('/tictactoe')}
        />
        <GameCard 
          title="Ultimate Tic-Tac-Toe" 
          description="The mind-bending 9x9 grid where every move sends your opponent to a new battlefield!"
          icon={Grid3X3}
          onClick={() => navigate('/uttt')}
        />
        <GameCard 
          title="Dots & Boxes" 
          description="Connect the dots and claim boxes in this classic strategy game!"
          icon={Square}
          onClick={() => navigate('/dab')}
        />
      </div>

      {playerName && (
        <div className="mt-6 sm:mt-12 paper-font text-gray-500 glass px-4 sm:px-6 py-1 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 text-xs sm:text-base">
          <User size={14} className="sm:w-[18px] text-blue-600" />
          <span>Playing as <span className="font-bold text-blue-600">{playerName}</span></span>
        </div>
      )}
    </div>
  );
};

export default PaperPartyLanding;
