import React, { useState, useEffect } from 'react';
import './GameBoard.css';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 8, y: 8 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

function GameBoard({ onScoreUpdate }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFoodPosition());
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(200);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isPaused || gameOver) return;
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          togglePause();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isPaused, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = {
          x: newSnake[0].x + direction.x,
          y: newSnake[0].y + direction.y,
        };

        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE ||
          newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setFood(generateFoodPosition());
          onScoreUpdate(newSnake.length - 1);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);

    return () => clearInterval(interval);  // Clear interval on component unmount or reset
  }, [snake, food, direction, gameOver, isPaused, speed, onScoreUpdate]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFoodPosition());
    setGameOver(false);
    setIsPaused(false); // Reset pause state as well
    onScoreUpdate(0);
  };

  if (gameOver) {
    return (
      <div className="game-over">
        <h2>Game Over! Your score: {snake.length - 1}</h2>
        <button onClick={resetGame}>Play Again</button>
      </div>
    );
  }

  return (
    <div>
      <div className="game-board">
        {Array.from({ length: GRID_SIZE }).map((_, row) => (
          <div key={row} className="row">
            {Array.from({ length: GRID_SIZE }).map((_, col) => (
              <div
                key={col}
                className={`cell ${
                  snake.some((segment) => segment.x === col && segment.y === row)
                    ? 'snake'
                    : food.x === col && food.y === row
                    ? 'food'
                    : ''
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <button className="pause-btn" onClick={togglePause}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
}

function generateFoodPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
}

export default GameBoard;
