// FILE: ColorBoxes.js
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';
import Confetti from 'react-confetti';

const ColorBoxes = () => {
  const [userColor, setUserColor] = useState('#ffffff');
  const [randomColor, setRandomColor] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let randomColor = generateRandomColor();
    console.log(randomColor);
    setRandomColor(randomColor);
  }, []);

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const handleInputChange = (e) => {
    setUserColor(e.target.value);
  };

  const handleResetClick = () => {
    setRandomColor(generateRandomColor());
    setAttempts(0);
    toast.success('Game reset!');
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

  const calculateAccuracy = (color1, color2) => {
    // Convert hex to RGB
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    // Calculate the difference
    const diff = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );

    // Calculate accuracy
    const maxDiff = Math.sqrt(Math.pow(255, 2) * 3);
    return Math.round((1 - diff / maxDiff) * 100);
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
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
          className="w-32 h-32 rounded-lg shadow-md"
          style={{ backgroundColor: randomColor }}
        ></div>
      </div>
      <button
        onClick={handleSubmitGuess}
        className="p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
      >
        Submit Guess
      </button>
      <button
        onClick={handleResetClick}
        className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Reset Random Color
      </button>
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
            setRandomColor(generateRandomColor());
            setAttempts(0);
            toast.success('Game reset!');
          }}
          className="mt-4 p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Close & Restart
        </button>
      </Modal>
    </div>
  );
};

export default ColorBoxes;