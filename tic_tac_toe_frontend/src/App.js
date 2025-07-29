import React, { useState, useEffect } from 'react';
import './App.css';

// ICONS
const ClownIcon = () => (
  <span role="img" aria-label="Clown" style={{ fontSize: '2.5rem', lineHeight: 1 }}>🤡</span>
);
const KingIcon = () => (
  <span role="img" aria-label="King" style={{ fontSize: '2.5rem', lineHeight: 1 }}>🤴</span>
);

// Helpers
const getWinner = (squares) => {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6], // diags
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a]; // "X" or "O"
    }
  }
  if (squares.every(x => x)) return 'tie';
  return null;
};

// PUBLIC_INTERFACE
function App() {
  // State definitions
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({X: 0, O: 0, tie: 0});
  const [winner, setWinner] = useState(null);

  // Theme (fixed light per requirements, ignore toggle feature)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Game state effect
  useEffect(() => {
    const w = getWinner(board);
    setWinner(w);
    // Update scoreboard if just ended
    if (w && board.some(cell => cell)) {
      setScore(prev => {
        if (w === 'tie') return { ...prev, tie: prev.tie + 1 };
        if (w === 'X') return { ...prev, X: prev.X + 1 };
        if (w === 'O') return { ...prev, O: prev.O + 1 };
        return prev;
      });
    }
    // eslint-disable-next-line
  }, [board]);

  // PUBLIC_INTERFACE
  const handleClick = (idx) => {
    if (board[idx] || winner) return;
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const onRestart = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXIsNext(true);
  };

  // UI constants
  const playerXStyle = { color: '#1E90FF', filter: 'drop-shadow(0 0 4px #1E90FF33)' };
  const playerOStyle = { color: '#FFD700', filter: 'drop-shadow(0 0 2px #FFD70077)' };

  // Determine status line
  let status;
  if (winner === 'tie') {
    status = <span style={{ color: '#FF69B4', fontWeight: 500 }}>It&apos;s a tie!</span>;
  } else if (winner) {
    status = (
      <span>
        {winner === 'X' ? <ClownIcon /> : <KingIcon />}{" "}
        <span style={{
          color: winner === 'X' ? '#1E90FF' : '#FFD700',
          fontWeight: 500,
          letterSpacing: '0.04em'
        }}>
          {winner === 'X' ? "Clown Wins!" : "King Wins!"}
        </span>
      </span>
    );
  } else {
    status = (
      <span>
        Next move:{" "}
        {xIsNext ? (
          <span style={{ ...playerXStyle, fontWeight: 600 }}><ClownIcon /> Clown</span>
        ) : (
          <span style={{ ...playerOStyle, fontWeight: 600 }}><KingIcon /> King</span>
        )}
      </span>
    );
  }

  // Square rendering
  const renderSquare = idx => {
    const val = board[idx];
    let content = '';
    let style = {
      width: '64px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.5rem',
      background: '#fff',
      border: `2px solid #e7eaf3`,
      borderRadius: '14px',
      cursor: winner || val ? 'default' : 'pointer',
      transition: 'box-shadow 0.15s, border-color 0.15s',
      margin: '2px',
      boxShadow: '0 1px 4px rgba(30,144,255,0.06)'
    };
    if (val === 'X') {
      content = <ClownIcon />;
      style = { ...style, ...playerXStyle, background: '#f0f8ff', borderColor: '#1E90FF77' };
    }
    if (val === 'O') {
      content = <KingIcon />;
      style = { ...style, ...playerOStyle, background: '#FFFDE0', borderColor: '#FFD70099' };
    }
    if (!val && !winner) {
      style = { ...style, ':hover': { boxShadow: '0 2px 6px #FF69B422' } };
    }
    return (
      <button
        key={idx}
        className="ttt-square"
        style={style}
        tabIndex={0}
        disabled={!!val || !!winner}
        aria-label={val ? (val === 'X' ? 'Clown' : 'King') : `Empty cell`}
        onClick={() => handleClick(idx)}
      >
        {content}
      </button>
    );
  };

  // Scoreboard style
  const scoreboardStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '2.5rem',
    marginTop: '1.2rem',
    fontSize: '1.1rem'
  };

  // PUBLIC_INTERFACE
  return (
    <div
      className="App"
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', 'Arial', sans-serif"
      }}
    >
      {/* Header */}
      <header
        style={{
          fontSize: '2.2rem',
          fontWeight: 700,
          marginBottom: '0.7em',
          letterSpacing: '0.02em',
          color: '#1E90FF',
          textShadow: '0 1px 0 #FFD70033'
        }}>
        <ClownIcon /> <span style={{ margin: '0 0.2em', color: '#282c34', fontWeight: 800 }}>Clown <span style={{color: "#FF69B4"}}>vs.</span> King</span> <KingIcon />
      </header>

      {/* Scoreboard */}
      <div style={scoreboardStyle} aria-label="Scoreboard">
        <div style={{display: 'flex', alignItems: 'center', gap: '0.4em'}}>
          <ClownIcon /><span style={{color: '#1E90FF', fontWeight: 600, marginLeft: 3}}>Clown</span>: {score.X}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.4em'}}>
          <KingIcon /><span style={{color: '#FFD700', fontWeight: 600, marginLeft: 3}}>King</span>: {score.O}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.4em'}}>
          <span style={{fontWeight: 600, color: '#FF69B4'}}>Ties</span>: {score.tie}
        </div>
      </div>

      {/* Status message */}
      <div
        style={{
          minHeight: '32px',
          margin: '1.3em 0 0.2em 0',
          color: winner
            ? (winner === 'X' ? '#1E90FF' : winner === 'O' ? '#FFD700' : '#FF69B4')
            : '#282c34',
          fontSize: '1.12rem',
          fontWeight: 500
        }}>
        {status}
      </div>

      {/* Game board */}
      <div
        className="ttt-board"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 68px)',
          gridTemplateRows: 'repeat(3, 68px)',
          gap: '0.6em',
          margin: '0.9em 0 0.9em 0',
          background: '#eaf3ff',
          borderRadius: '18px',
          padding: '14px 14px 10px 14px',
          boxShadow: '0 6px 34px #1E90FF11, 0 1px 1.5px #FFD70023'
        }}
        role="grid"
        aria-label="Tic Tac Toe Board"
      >
        {Array(9).fill(null).map((_, idx) => renderSquare(idx))}
      </div>

      {/* Restart button */}
      <button
        className="restart-btn"
        type="button"
        onClick={onRestart}
        style={{
          background: 'linear-gradient(90deg, #FF69B4 0%, #1E90FF 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '999px',
          fontWeight: 700,
          fontSize: '1rem',
          padding: '0.9em 2em',
          marginTop: '0.2em',
          marginBottom: '1.6em',
          boxShadow: '0 2px 12px #ff69b433',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        aria-label="Restart game"
      >
        🔄 Restart
      </button>

      <footer style={{
        marginTop: 'auto',
        fontSize: '1em',
        color: '#aaa',
        letterSpacing: '.02em'
      }}>
        Built with <span style={{color:"#FF69B4"}}>♥</span> • React, Clown & King
      </footer>
    </div>
  );
}

export default App;
