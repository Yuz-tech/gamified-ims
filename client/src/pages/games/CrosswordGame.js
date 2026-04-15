import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import api from '../../utils/api';

const Crossword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [grid, setGrid] = useState([]);
  const [clues, setClues] = useState({ across: [], down: [] });
  const [selectedCell, setSelectedCell] = useState(null);
  const [direction, setDirection] = useState('across');
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());

}

export default Crossword;