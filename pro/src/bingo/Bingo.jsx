import React, { useState } from 'react';
import { Grid, Button, Typography } from '@mui/material';

const Bingo = () => {
  const [numbers, setNumbers] = useState(generateNumbers());
  const [strikedOut, setStrikedOut] = useState('');

  // Function to generate random numbers initially
  function generateNumbers() {
    return Array.from({ length: 25 }, () => Math.floor(Math.random() * 25) + 1);
  }

  // Function to handle button click
  const handleClick = (index) => {
    const newNumbers = [...numbers]; // Create a copy of the numbers array
    newNumbers[index] = 'X'; // Directly modify the clicked number
    setNumbers(newNumbers); // Update the numbers state
    checkForWin(newNumbers); // Check for win after click
  };

  // Function to check for winning combinations
  const checkForWin = (newNumbers) => {
    const lines = [
      [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24], // Rows
      [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24], // Columns
      [0, 6, 12, 18, 24], [4, 8, 12, 16, 20], // Diagonals
    ];

    let completedLinesCount = 0;
    for (const line of lines) {
      if (line.every(cell => newNumbers[cell] === 'X')) {
        completedLinesCount++;
      }
    }

    const newStrikedOut = 'BINGO'.slice(0, completedLinesCount);
    if (newStrikedOut.length > strikedOut.length) {
      setStrikedOut(newStrikedOut); // Update strikedOut state
    }
  };

  // Function to generate a new set of numbers
  const handleGenerateNumbers = () => {
    const newNumbers = generateNumbers(); // Efficiently regenerate all numbers
    setNumbers(newNumbers); // Update the numbers state
    setStrikedOut(''); // Reset strikedOut state
  };

  return (
    <div>
      <Typography variant="h3" gutterBottom>Bingo Game</Typography>
      <Grid container spacing={2}>
        {numbers.map((number, index) => (
          <Grid item key={index} xs={2.3}>
            <Button
              variant={"outlined"}
              fullWidth
              onClick={() => handleClick(index)}
              disabled={number === 'X'}
              sx={{ height: '70px' }}
            >
              {number}
            </Button>
          </Grid>
        ))}
      </Grid>
      <div style={{ marginTop: '20px' }}>
        <Button variant="contained" onClick={handleGenerateNumbers}>Generate Numbers</Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Typography variant="h3" gutterBottom>Strikes:</Typography>
        {strikedOut.split('').map((letter, index) => (
          <Typography
            key={index}
            variant='h4'
            component="span"
            style={{ textDecoration: letter === ' ' ? 'none' : 'line-through', marginRight: '10px' }}
          >
            {letter}
          </Typography>
        ))}
      </div>
    </div>
  );
};

export default Bingo;
