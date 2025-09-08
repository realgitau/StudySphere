// components/FocusTimer.jsx
'use client';
import { useState, useEffect } from 'react';

export default function FocusTimer() {
    const FOCUS_MINUTES = 25 * 60;
    const BREAK_MINUTES = 5 * 60;

    const [time, setTime] = useState(FOCUS_MINUTES);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' or 'break'

    useEffect(() => {
        let interval = null;

        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            // Play a sound or notification
            alert(mode === 'focus' ? 'Time for a break!' : 'Break is over, back to focus!');
            // Switch modes
            const newMode = mode === 'focus' ? 'break' : 'focus';
            setMode(newMode);
            setTime(newMode === 'focus' ? FOCUS_MINUTES : BREAK_MINUTES);
            setIsActive(false);
        }

        return () => clearInterval(interval); // Cleanup interval on unmount or re-render
    }, [isActive, time, mode]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setMode('focus');
        setTime(FOCUS_MINUTES);
    };
    
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">Focus Timer</h2>
            <div className="text-6xl font-bold text-center my-6 p-4 bg-gray-100 rounded-lg">
                {formatTime(time)}
            </div>
            <p className="text-center text-gray-500 mb-6 font-medium uppercase tracking-wider">
                {mode === 'focus' ? 'Time to Focus' : 'Time for a Break'}
            </p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={toggleTimer}
                    className={`px-8 py-3 rounded-md font-semibold text-white ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button
                    onClick={resetTimer}
                    className="px-8 py-3 rounded-md font-semibold bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}