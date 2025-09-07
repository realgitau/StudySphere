// components/PomodoroTimer.jsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

const POMODORO_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes

export default function PomodoroTimer() {
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro' or 'break'
  const [timeRemaining, setTimeRemaining] = useState(POMODORO_TIME);
  const [isActive, setIsActive] = useState(false);
  
  // A key to force re-render of the progress circle animation
  const [timerKey, setTimerKey] = useState(0);

  const switchMode = useCallback(() => {
    setIsActive(false);
    const newMode = mode === 'pomodoro' ? 'break' : 'pomodoro';
    setMode(newMode);
    setTimeRemaining(newMode === 'pomodoro' ? POMODORO_TIME : SHORT_BREAK_TIME);
    setTimerKey(prevKey => prevKey + 1); // Reset animation
  }, [mode]);

  useEffect(() => {
    let interval = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Play a sound when the timer finishes
      new Audio('/notification.mp3').play().catch(e => console.error("Error playing sound:", e));
      switchMode();
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, switchMode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(mode === 'pomodoro' ? POMODORO_TIME : SHORT_BREAK_TIME);
    setTimerKey(prevKey => prevKey + 1);
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const totalTime = mode === 'pomodoro' ? POMODORO_TIME : SHORT_BREAK_TIME;
  const progress = (timeRemaining / totalTime) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Focus Timer</h2>
      <div className="mb-4">
        <span 
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            mode === 'pomodoro' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}
        >
          {mode === 'pomodoro' ? 'Focus Session' : 'Short Break'}
        </span>
      </div>
      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-gray-200" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle
            key={timerKey}
            className={mode === 'pomodoro' ? 'text-red-500' : 'text-green-500'}
            strokeWidth="7"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute text-4xl font-bold text-gray-800">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={resetTimer} className="p-3 text-gray-500 hover:text-gray-800">
          <RotateCcw size={24} />
        </button>
        <button 
          onClick={toggleTimer} 
          className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700"
        >
          {isActive ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button onClick={switchMode} className="text-gray-500 hover:text-gray-800 text-sm">
          Skip
        </button>
      </div>
    </div>
  );
}