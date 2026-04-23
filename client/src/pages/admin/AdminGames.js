import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from '../../utils/api';

const AdminGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [currentTab, setCurrentTab] = useState('texttwist');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gameType: 'texttwist',
    difficulty: 'medium',
    maxXP: 200,
    timeLimit: 120,
    isActive: true
  });

  const [textTwistWords, setTextTwistWords] = useState([]);
  const [wordleWords, setWordleWords] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [hangmanWords, setHangmanWords] = useState([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await api.get('/games/admin/all');
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games: ', error);
      alert('Error loading games');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingGame(null);
    setFormData({
      title: '',
      description: '',
      gameType: 'texttwist',
      difficulty: 'medium',
      maxXP: 200,
      timeLimit: 120,
      isActive: true
    });
    setTextTwistWords([]);
    setWordleWords([]);
    setQuizQuestions([]);
    setHangmanWords([]);
    setCurrentTab('texttwist');
    setShowModal(true);
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setFormData({
      title: game.title,
      description: game.description,
      gameType: game.gameType,
      difficulty: game.difficulty,
      maxXP: game.maxXP,
      timeLimit: game.timeLimit,
      isActive: game.isActive
    });

    setCurrentTab(game.gameType);

    switch (game.gameType) {
      case 'texttwist':
        setTextTwistWords(game.content.words || []);
        break;
      case 'wordle':
        setWordleWords(game.content.words || []);
        break;
      case 'quickquiz':
        setQuizQuestions(game.content.questions || []);
        break;
      case 'hangman':
        setHangmanWords(game.content.words || []);
        break;
      default: 
        setQuizQuestions([]);
        break;
    }

    setShowModal(true);
  };

  const handleDelete = async (gameId) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await api.delete(`/games/admin/${gameId}`);
        fetchGames();
        alert('Game deleted successfully!');
      } catch (error) {
        console.error('Error deleting game: ', error);
        alert('Error deleting game');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let content = {};

    switch (formData.gameType) {
      case 'texttwist':
        if (textTwistWords.length === 0) {
          alert('Please add at least one word for Text Twist');
          return;
        }
        content = { words: textTwistWords };
        break;
      case 'wordle':
        if (wordleWords.length === 0) {
          alert('Please add at least one word for Wordle');
          return;
        }
        content = { words: wordleWords };
        break;
      case 'quickquiz':
        if (quizQuestions.length === 0) {
          alert('Please add at least one question for Quick Quiz');
          return;
        }
        content = { questions: quizQuestions };
        break;
      case 'hangman':
        if (hangmanWords.length === 0) {
          alert('Please add at least one word for Hangman');
          return;
        }
        content = { words: hangmanWords };
        break;
      default:
        alert('Please Please Please');
        break;
    }

    const gameData = {
      ...formData,
      content
    };

    try {
      if (editingGame) {
        await api.put(`/games/admin/${editingGame._id}`, gameData);
        alert('Game updated successfully!');
      } else {
        await api.post('/games/admin/create', gameData);
        alert('Game created successfully!');
      }
      setShowModal(false);
      fetchGames();
    } catch (error) {
      console.error('Error saving game: ', error);
      alert('Error saving game');
    }
  };

  // TT Editor
  const renderTextTwistEditor = () => (
    <div>
      <h3 style={{ fontSize: '14px', marginBottom: '15px' }}>Text Twist Words</h3>

      {textTwistWords.map((wordObj, idx) => (
        <div key={idx} style={{
          padding: '15px',
          background: 'var(--bg-light)',
          border: '2px solid var(--border-color)',
          paddingTop: '20px',
          marginBottom: '10px',
          zIndex: '9999'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Word {idx + 1}</span>
            <button type="button" onClick={() => setTextTwistWords(textTwistWords.filter((_, i) => i !== idx))}
              className="retro-btn secondary" style={{ fontSize: '10px', padding: '5px 10px' }}>
                Remove
              </button>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              Main Word (6-8 letters)
            </label>
            <input type="text" value={wordObj.mainWord} onChange={(e) => {
              const updated = [...textTwistWords];
              updated[idx].mainWord = e.target.value.toUpperCase();
              setTextTwistWords(updated);
            }}
            style={{ width: '100%', padding: '8px', fontSize: '12px', border: '2px solid var(--border-color)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              Valid Subwords (comma-separated, 3+ letters)
            </label>
            <textarea value={wordObj.subwords.join(', ')} onChange={(e) => {
              const updated = [...textTwistWords];
              updated[idx].subwords = e.target.value.split(',').map(w => w.trim().toUpperCase()).filter(w => w);

              setTextTwistWords(updated);
            }}
            rows={3}
            style={{ width: '100%', padding: '8px', fontSize: '12px', border: '2px solid var(--border-color)' }}
            placeholder="WORD, TEST, RISK..."
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={() => setTextTwistWords([...textTwistWords, { mainWord: '', subwords: [] }])} className="retro-btn secondary" style={{ width: '100%' }}>
        + Add Word
      </button>
    </div>
  );

  // Wordle Editor
  const renderWordleEditor = () => (
    <div>
      <h3 style={{ fontSize: '14px', marginBottom: '15px' }}>Wordle Words</h3>
      {wordleWords.map((wordObj, idx) => (
        <div key={idx} style={{
          padding: '15px',
          background: 'var(--bg-light)',
          border: '2px solid var(--border-color)',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
              Word {idx + 1}
            </span>
            <button type="button" onClick={() => setWordleWords(wordleWords.filter((_, i) => i !== idx ))}
              className="retro-btn secondary" style={{ fontSize: '10px', padding: '5px 10px' }}>
                Remove
              </button>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              Word (5 letters)
            </label>
            <input type="text" maxLength={5} value={wordObj.word} onChange={(e) => {
              const updated = [...wordleWords];
              updated[idx].word = e.target.value.toUpperCase();

              setWordleWords(updated);
            }}
            style={{ width: '100%', padding: '8px', fontSize: '12px', border: '2px solid var(--border-color)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Hint</label>
            <input type="text" value={wordObj.hint} onChange={(e) => {
              const updated = [...wordleWords];
              updated[idx].hint = e.target.value;
              setWordleWords(updated);
            }}
            style={{ width: '100%', padding: '8px', fontSize: '12px', border: '2px solid var(--border-color)' }}
            placeholder="Place clue here..."
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={() => setWordleWords([...wordleWords, { word: '', hint: '' }])}
        className="retro-btn secondary" style={{ width: '100%' }}>
          + Add Word
        </button>
    </div>
  );

  // QUICK QUIZ Editor
  const renderQuizEditor = () => (
    <div>
      <h3 style={{ fontSize: '14px', marginBottom: '15px' }}>Quiz Questions</h3>
      {quizQuestions.map((q, idx) => (
        <div key={idx} style={{
          padding: '15px',
          background: 'var(--bg-light)',
          border: '2px solid var(--border-color)',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Question {idx + 1}</span>
            <button type="button" onClick={() => setQuizQuestions(quizQuestions.filter((_, i) => i !== idx))}
              className="retro-btn secondary" style={{ fontSize: '10px', padding: '5px 10px' }}>
                Remove
              </button>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              Question
            </label>
            <input type="text" value={q.question} onChange={(e) => {
              const updated = [...quizQuestions];
              updated[idx].question = e.target.value;
              
              setQuizQuestions(updated);
            }}
            style={{ width: '100%', padding: '8px', fontSize: '12px', border: '2px solid var(--border-color)' }}
            />
          </div>

          {[0, 1, 2, 3].map(optIdx => (
            <div key={optIdx} style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                Option {String.fromCharCode(65 + optIdx)}
                {q.correctAnswer === optIdx && '(Correct)'}
              </label>
              <input type="text" value={q.options[optIdx] || ''} onChange={(e) => {
                const updated = [...quizQuestions];

                updated[idx].options[optIdx] = e.target.value;

                setQuizQuestions(updated);
              }}
              style={{ width: '100%', padding: '8px', fontSize: '12px', border: '2px solid var(--border-color)' }}
              />
            </div>
          ))}

          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              Correct Answer
            </label>
            <select value={q.correctAnswer} onChange={(e) => {
              const updated = [...quizQuestions];
              updated[idx].correctAnswer = parseInt(e.target.value);

              setQuizQuestions(updated);
            }}
            style={{ width: '100%', padding: '8px', fontSize: '12px', border: '2px solid var(--border-color)' }}
            >
              <option value={0}>A</option>
              <option value={1}>B</option>
              <option value={2}>C</option>
              <option value={3}>D</option>
            </select>
          </div>
        </div>
      ))}

      <button type="button" onClick={() => setQuizQuestions([...quizQuestions, {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 10
      }])}
      className="retro-btn secondary"
      style={{ width: '100%' }}
      >
        + Add Question
      </button>
    </div>
  );

  // HANGMAN Editor
  const renderHangmanEditor = () => (
    <div>
      <h3 style={{ fontSize: '14px', marginBottom: '15px' }}>Hangman Words</h3>
      
      {hangmanWords.map((wordObj, idx) => (
        <div key={idx} style={{
          padding: '15px',
          background: 'var(--bg-light)',
          border: '2px solid var(--border-color)',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Word {idx + 1}</span>
            <button type="button" onClick={() => setHangmanWords(hangmanWords.filter((_, i) => i !== idx))}
              className="retro-btn secondary" style={{ fontSize: '10px', padding: '5px 10px' }}>
                Remove
              </button>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              Word or Phrase
            </label>
            <input type="text" value={wordObj.word} onChange={(e) => {
              const updated = [...hangmanWords];
              updated[idx].word = e.target.value.toUpperCase();

              setHangmanWords(updated);
            }}
            style={{ width: '100%', padding: '8px', fontSize: '12px', border: '2px solid var(--border-color)' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              Hint
            </label>
            <input type="text" value={wordObj.hint} onChange={(e) => {
              const updated = [...hangmanWords];
              updated[idx].hint = e.target.value;

              setHangmanWords(updated);
            }}
            style={{ width: '100%', padding: '8px', fontSize: '12px', border: '2px solid var(--border-color)' }}
            placeholder="Place clue here..."
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Category</label>
            <input type="text" value={wordObj.category} onChange={(e) => {
              const updated = [...hangmanWords];
              updated[idx].category = e.target.value;

              setHangmanWords(updated);
            }}
            style={{ width: '100%', padding: '8px', fontSize: '12px', border: '2px solid var(--border-color)' }}
            placeholder="e.g., IMS Topic Terms, concepts..."
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={() => setHangmanWords([...hangmanWords, { word: '', hint: '', category: '' }])}
        className="retro-btn secondary" style={{ width: '100%' }}>
          + Add Word
        </button>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading neon-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="retro-container" style={{ paddingTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', color: 'var(--primary-navy)' }}>Manage Games</h1>
        <button onClick={handleCreate} className="retro-btn">+ Create Game</button>
      </div>

      {/* Games Table */}
      <div className="retro-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '11px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Game</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Type</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Difficulty</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Max XP</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Completions</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => (
              <tr key={game._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {game.title}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-medium)' }}>
                    {game.description}
                  </div>
                </td>
                <td style={{ padding: '15px', textAlign: 'center', textTransform: 'capitalize' }}>
                  {game.gameType.replace('texttwist', 'Text Twist').replace('quickquiz', 'Quick Quiz')}
                </td>
                <td style={{ padding: '15px', textAlign: 'center', textTransform: 'capitalize' }}>
                  {game.difficulty}
                </td>
                <td style={{ padding: '15px', textAlign: 'center', color: 'var(--bright-blue)', fontWeight: 'bold' }}>
                  {game.maxXP}
                </td>
                <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                  {game.completionCount || 0}
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <span style={{
                    padding: '5px 10px',
                    background: game.isActive ? 'var(--success-green)' : 'var(--text-medium)',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    borderRadius: '3px'
                  }}>
                    {game.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button onClick={() => handleEdit(game)} className="retro-btn secondary" style={{ fontSize: '10px', padding: '8px 12px', marginRight: '5px' }}>
                    EDIT
                  </button>
                  <button onClick={() => handleDelete(game._id)} className="retro-btn secondary" style={{ fontSize: '10px', padding: '8px 12px' }}>
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {games.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-medium)' }}>
            No games found.
          </div>
        )}
      </div>

      {/* Create & Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            overflowY: 'auto'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="retro-card"
              style={{ maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto', margin: '20px' }}>
                <h2 style={{ fontSize: '18px', color: 'var(--primary-navy)', marginBottom: '20px' }}>
                  {editingGame ? 'EDIT GAME' : 'CREATE GAME'}
                </h2>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                      Title
                    </label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                      required
                      style={{ width: '100%', padding: '10px', fontSize: '12px', border: '2px solid var(--border-color)' }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                      Description
                    </label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={2}
                      style={{ width: '100%', padding: '10px', fontSize: '12px', border: '2px solid var(--border-color)' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                        Game Type
                      </label>
                      <select value={formData.gameType} onChange={(e) => {
                        setFormData({ ...formData, gameType: e.target.value });

                        setCurrentTab(e.target.value);
                      }}
                      disabled={!!editingGame}
                      style={{ width: '100%', padding: '10px', fontSize: '12px', border: '2px solid var(--border-color)' }}
                      >
                        <option value="texttwist">Text Twist</option>
                        <option value="wordle">Wordle</option>
                        <option value="quickquiz">Quick Quiz</option>
                        <option value="hangman">Hangman</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                        Difficulty
                      </label>
                      <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        style={{ width: '100%', padding: '10px', fontSize: '12px', border: '2px solid var(--border-color)' }}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                        Max XP
                      </label>
                      <input type="number" value={formData.maxXP} onChange={(e) => setFormData({ ...formData, maxXP: parseInt(e.target.value) })}
                        min="0" style={{ width: '100%', padding: '10px', fontSize: '12px', border: '2px solid var(--border-color)' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                        Time (sec)
                      </label>
                      <input type="number" value={formData.timeLimit} onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                        min="0" style={{ width: '100%', padding: '10px', fontSize: '12px', border: '2px solid var(--border-color)' }}
                      />
                    </div>
                  </div>

                  {editingGame && (
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: 'bold' }}>
                        <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          style={{ marginRight: '10px' }}
                        />
                        Active
                      </label>
                    </div>
                  )}

                  {/* Content Editor */}
                  <div style={{ marginBottom: '20px', padding: '20px', background: 'var(--bg-light)', border: '2px solid var(--border-color)' }}>
                    {currentTab === 'texttwist' && renderTextTwistEditor()}
                    {currentTab === 'wordle' && renderWordleEditor()}
                    {currentTab === 'quickquiz' && renderQuizEditor()}
                    {currentTab === 'hangman' && renderHangmanEditor()}
                  </div>

                  {/* Submit */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="retro-btn" style={{ flex: 1 }}>
                      {editingGame ? 'UPDATE GAME' : 'CREATE GAME'}
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} className="retro-btn secondary" style={{ flex: 1 }}>
                      CANCEL
                    </button>
                  </div>
                </form>
              </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGames;