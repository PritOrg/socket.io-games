import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import Swal from 'sweetalert2';
import { User, BookOpen, PenTool, Share2, Zap, Circle } from 'lucide-react';

const BingoIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <rect x="4" y="4" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <text x="24" y="28" textAnchor="middle" className="text-lg font-bold" fill="currentColor">
      B
    </text>
  </svg>
);

const TicTacToeIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <line x1="16" y1="4" x2="16" y2="44" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <line x1="32" y1="4" x2="32" y2="44" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <line x1="4" y1="16" x2="44" y2="16" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <line x1="4" y1="32" x2="44" y2="32" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <text x="10" y="14" className="text-lg font-bold" fill="currentColor">
      X
    </text>
    <text x="26" y="30" className="text-lg font-bold" fill="currentColor">
      O
    </text>
  </svg>
);

const UTTTIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <rect x="26" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <rect x="2" y="26" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <rect
      x="26"
      y="26"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="4 2"
    />
    <text x="12" y="16" className="text-sm font-bold" fill="currentColor">
      X
    </text>
    <text x="36" y="40" className="text-sm font-bold" fill="currentColor">
      O
    </text>
  </svg>
);

const DotsAndBoxesIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <circle cx="8" cy="8" r="3" fill="currentColor" />
    <circle cx="24" cy="8" r="3" fill="currentColor" />
    <circle cx="40" cy="8" r="3" fill="currentColor" />
    <circle cx="8" cy="24" r="3" fill="currentColor" />
    <circle cx="24" cy="24" r="3" fill="currentColor" />
    <circle cx="40" cy="24" r="3" fill="currentColor" />
    <circle cx="8" cy="40" r="3" fill="currentColor" />
    <circle cx="24" cy="40" r="3" fill="currentColor" />
    <circle cx="40" cy="40" r="3" fill="currentColor" />
    <line x1="8" y1="8" x2="24" y2="8" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="24" x2="8" y2="8" stroke="currentColor" strokeWidth="2" />
    <line x1="24" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <line x1="40" y1="24" x2="40" y2="8" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="40" x2="8" y2="24" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
  </svg>
);

const SOSIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <rect x="4" y="4" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <text x="12" y="16" className="text-sm font-bold" fill="currentColor">
      S
    </text>
    <text x="24" y="28" className="text-sm font-bold" fill="currentColor">
      O
    </text>
    <text x="36" y="40" className="text-sm font-bold" fill="currentColor">
      S
    </text>
  </svg>
);

const Connect4Icon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <rect x="4" y="8" width="40" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
    <circle cx="12" cy="16" r="4" fill="#ef4444" />
    <circle cx="24" cy="16" r="4" fill="#eab308" />
    <circle cx="36" cy="16" r="4" fill="#ef4444" />
    <circle cx="12" cy="28" r="4" fill="#eab308" />
    <circle cx="24" cy="28" r="4" fill="#ef4444" />
    <circle cx="36" cy="28" r="4" fill="#eab308" />
  </svg>
);

const ComingSoonIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" strokeDasharray="6 4" />
    <text x="24" y="28" textAnchor="middle" className="text-xs font-bold" fill="currentColor">
      ?
    </text>
  </svg>
);

const GameCard = ({ title, description, onClick, icon: Icon, accentColor, badge }) => (
  <div onClick={onClick} className="group relative cursor-pointer transition-all duration-300 hover:-translate-y-1">
    <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative glass rounded-2xl p-4 sm:p-6 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 text-${accentColor}-500`}>
          <Icon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base sm:text-xl font-bold hand-drawn text-gray-800">{title}</h3>
            {badge && (
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-bold">
                {badge}
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-sm paper-font text-gray-500 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-400 group-hover:text-gray-600 transition-colors">
        <PenTool size={12} />
        <span>Click to play</span>
        <svg
          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
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
        confirmButtonText: "Let's Play!",
        customClass: {
          popup: 'glass rounded-3xl paper-font',
          title: 'hand-drawn text-3xl',
          confirmButton: 'bg-blue-500/80 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold transition-all',
        },
        buttonsStyling: false,
        inputValidator: (value) => {
          if (!value || !value.trim()) return 'We need a name to start the party!';
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setPlayerName(result.value.trim());
        }
      });
    }
  }, [playerName, setPlayerName]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(transparent, transparent 23px, #333 24px)`,
          backgroundSize: '100% 24px',
        }}
      />

      <div className="absolute top-4 left-4 w-32 h-32 text-gray-300 transform -rotate-12">
        <BookOpen size={128} strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-4 right-4 w-24 h-24 text-gray-300 transform rotate-12">
        <Share2 size={96} strokeWidth={0.5} />
      </div>
      <div className="absolute top-1/4 right-8 w-16 h-16 text-gray-200 transform rotate-45">
        <Zap size={64} strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-1/4 left-8 w-12 h-12 text-gray-200 transform -rotate-30">
        <Circle size={48} strokeWidth={0.5} />
      </div>

      <div className="relative text-center mb-8 sm:mb-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl hand-drawn mb-2 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          PaperParty
        </h1>
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <PenTool size={14} />
          <p className="text-xs sm:text-base paper-font max-w-2xl">
            Multiplayer games that feel like the back of your notebook.
          </p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          ))}
        </div>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl w-full px-2">
        <GameCard
          title="Bingo"
          description="The classic 5x5 numbers game. Race to cross out your lines and shout BINGO!"
          icon={BingoIcon}
          accentColor="purple"
          onClick={() => navigate('/bingo')}
        />
        <GameCard
          title="Tic Tac Toe"
          description="Strategize and outsmart your opponent in this timeless 3x3 battle."
          icon={TicTacToeIcon}
          accentColor="blue"
          onClick={() => navigate('/tictactoe')}
        />
        <GameCard
          title="Ultimate Tic-Tac-Toe"
          description="The mind-bending 9x9 grid where every move sends your opponent to a new battlefield!"
          icon={UTTTIcon}
          accentColor="green"
          onClick={() => navigate('/uttt')}
        />
        <GameCard
          title="Dots & Boxes"
          description="Connect the dots and claim boxes in this classic strategy game!"
          icon={DotsAndBoxesIcon}
          accentColor="orange"
          onClick={() => navigate('/dab')}
        />
        <GameCard
          title="SOS"
          description="Place S or O to form SOS patterns. Quick to learn, hard to master!"
          icon={SOSIcon}
          accentColor="red"
          onClick={() => navigate('/sos')}
        />
        <GameCard
          title="Connect 4"
          description="Drop discs to get 4 in a row. Classic gravity gameplay with smooth animations!"
          icon={Connect4Icon}
          accentColor="yellow"
          onClick={() => navigate('/connect4')}
        />
      </div>

      {playerName && (
        <div className="relative mt-8 sm:mt-12 paper-font text-gray-500 glass px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-xs sm:text-base">
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
            <User size={12} className="text-white" />
          </div>
          <span>Playing as</span>
          <span className="font-bold text-blue-600">{playerName}</span>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-gray-300 text-xs">
        <Circle size={6} />
        <Circle size={6} />
        <Circle size={6} />
      </div>
    </div>
  );
};

export default PaperPartyLanding;
