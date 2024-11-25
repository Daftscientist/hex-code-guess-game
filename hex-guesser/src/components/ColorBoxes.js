// FILE: ColorBoxes.js
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';
import Confetti from 'react-confetti';
import { FaLightbulb, FaRedo } from 'react-icons/fa';

const ColorBoxes = () => {
  const [userColor, setUserColor] = useState('#ffffff');
  const [randomColor, setRandomColor] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRandomColor(generateRandomColor());
  }, []);

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const handleInputChange = (e) => {
    setUserColor(e.target.value);
  };

  const handleResetClick = () => {
    setLoading(true);
    setTimeout(() => {
      setRandomColor(generateRandomColor());
      setAttempts(0);
      setHintUsed(false);
      setLoading(false);
      toast.success('Game reset!');
    }, 1000);
  };

  const handleSubmitGuess = () => {
    setAttempts(attempts + 1);
    const accuracy = calculateAccuracy(userColor, randomColor);
    setAccuracy(accuracy);

    if (accuracy === 100) {
      toast.success('Perfect match!');
      setShowConfetti(true);
      setIsModalOpen(true);
    } else if (accuracy >= 80) {
      toast.success('Very close!');
      setIsModalOpen(true);
    } else {
      toast.error("Your far off, try again!");
    }
  };

  const handleHintClick = () => {
    if (!hintUsed) {
      const hint = calculateHint(userColor, randomColor);
      toast(hint, {
        icon: '💡',
      });
      setHintUsed(true);
    } else {
      toast.error('Hint already used!');
    }
  };

  const calculateHint = (color1, color2) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const redDiff = rgb2.r - rgb1.r;
    const greenDiff = rgb2.g - rgb1.g;
    const blueDiff = rgb2.b - rgb1.b;

    let hint = 'You need ';
    if (Math.abs(redDiff) > Math.abs(greenDiff) && Math.abs(redDiff) > Math.abs(blueDiff)) {
      hint += redDiff > 0 ? 'more red' : 'less red';
    } else if (Math.abs(greenDiff) > Math.abs(redDiff) && Math.abs(greenDiff) > Math.abs(blueDiff)) {
      hint += greenDiff > 0 ? 'more green' : 'less green';
    } else {
      hint += blueDiff > 0 ? 'more blue' : 'less blue';
    }

    return hint;
  };

  const calculateAccuracy = (color1, color2) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const diff = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );

    const maxDiff = Math.sqrt(Math.pow(255, 2) * 3);
    return Math.round((1 - diff / maxDiff) * 100);
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = (bigint & 255);
    return { r, g, b };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">Color Guesser</h1>
      <input
        type="text"
        value={userColor}
        onChange={handleInputChange}
        placeholder="Enter hex color"
        className="mb-4 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex space-x-4 mb-6">
        <div
          className="w-32 h-32 rounded-lg shadow-md"
          style={{ backgroundColor: userColor }}
        ></div>
        <div
          className="w-32 h-32 rounded-lg shadow-md flex items-center justify-center"
          style={{ backgroundColor: randomColor }}
        >
          {loading && <div className="loader"></div>}
        </div>
      </div>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={handleResetClick}
          className="p-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={loading}
        >
          {loading ? <div className="loader"></div> : <FaRedo />}
        </button>
        <button
          onClick={handleSubmitGuess}
          className="p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        >
          Submit Guess
        </button>
        <button
          onClick={handleHintClick}
          className="p-3 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          disabled={loading}
        >
          <FaLightbulb />
        </button>
      </div>
      <p className="mt-4">Attempts: {attempts}</p>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setShowConfetti(false);
        }}
        className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        {showConfetti && <Confetti />}
        <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
        <p>Your guess was {accuracy}% accurate.</p>
        <p>Total attempts: {attempts}</p>
        <button
          onClick={() => {
            setIsModalOpen(false);
            setShowConfetti(false);
          }}
          className="mt-4 p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default ColorBoxes;