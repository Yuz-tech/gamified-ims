// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../../utils/api';
// import Crossword from './Crossword';
// import Wordle from './Wordle';
// import QuickQuiz from './QuickQuiz';


// const GameRouter = () => {
//   const { gameId } = useParams();
//   const navigate = useNavigate();
//   const [game, setGame] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchGame();
//   }, [gameId]);

//   const fetchGame = async () => {
//     try {
//       const response = await api.get(`/games/${gameId}`);
//       setGame(response.data);
//     } catch (error) {
//       console.error('Error fetching game:', error);
//       alert('Failed to load game');
//       navigate('/games');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
//         <div className="loading neon-text">LOADING GAME...</div>
//       </div>
//     );
//   }

//   if (!game) {
//     return (
//       <div style={{ textAlign: 'center', padding: '40px' }}>
//         <h2>Game not found</h2>
//         <button onClick={() => navigate('/games')} className="retro-btn">
//           ← BACK TO GAMES
//         </button>
//       </div>
//     );
//   }

//   switch (game.type) {
//     case 'crossword':
//       return <Crossword game={game} />;
//     case 'wordle':
//       return <Wordle game={game} />;
//     case 'quick_quiz':
//       return <QuickQuiz game={game} />;
//     default:
//       return (
//         <div style={{ textAlign: 'center', padding: '40px' }}>
//           <h2>Unknown game type: {game.type}</h2>
//           <button onClick={() => navigate('/games')} className="retro-btn">
//             ← BACK TO GAMES
//           </button>
//         </div>
//       );
//   }
// };

// export default GameRouter;