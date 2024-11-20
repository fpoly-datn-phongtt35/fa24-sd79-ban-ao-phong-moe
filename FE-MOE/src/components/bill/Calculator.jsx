import { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

const Calculator = () => {
    const [screenValue, setScreenValue] = useState('');

    const handleButtonClick = (value) => {
        setScreenValue((prev) => prev + value);
    };

    const handleCalculate = () => {
        try {
            const result = eval(screenValue);
            setScreenValue(result.toString());
        } catch (error) {
            setScreenValue('Error');
        }
    };

    const handleClear = () => {
        setScreenValue('');
    };

    const handleBackspace = () => {
        setScreenValue((prev) => prev.slice(0, -1));
    };

    return (
        <Box>

            {/* Màn hình máy tính */}
            <Box
                sx={{
                    width: '100%',
                    height: '70px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    color: 'black',
                    paddingRight: '20px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    padding: '0 10px',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-line',
                    border: '2px solid black',
                }}
            >
                {screenValue || '0'}
            </Box>

            {/* Bàn phím máy tính */}
            <Grid container spacing={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                {['7', '8', '9', '/'].map((value) => (
                    <Grid item xs={3} key={value}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleButtonClick(value)}
                            sx={{ fontSize: '20px', backgroundColor: '#64b5f6', color: 'white' }}
                        >
                            {value}
                        </Button>
                    </Grid>
                ))}
                {['4', '5', '6', '*'].map((value) => (
                    <Grid item xs={3} key={value}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleButtonClick(value)}
                            sx={{ fontSize: '20px', backgroundColor: '#64b5f6', color: 'white' }}
                        >
                            {value}
                        </Button>
                    </Grid>
                ))}
                {['1', '2', '3', '-'].map((value) => (
                    <Grid item xs={3} key={value}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleButtonClick(value)}
                            sx={{ fontSize: '20px', backgroundColor: '#64b5f6', color: 'white' }}
                        >
                            {value}
                        </Button>
                    </Grid>
                ))}
                {['0', '.', '=', '+'].map((value) => (
                    <Grid item xs={3} key={value}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={value === '=' ? handleCalculate : () => handleButtonClick(value)}
                            sx={{
                                fontSize: '20px',
                                backgroundColor: value === '=' ? '#81c784' : '#64b5f6',
                                color: 'white',
                            }}
                        >
                            {value}
                        </Button>
                    </Grid>
                ))}
            </Grid>

            {/* Các nút chức năng như Clear, Backspace */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 1 }}>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleClear}
                    sx={{
                        backgroundColor: '#f5f5f5',
                        color: '#64b5f6',
                        fontSize: '18px',
                        fontWeight: 'bold',
                    }}
                >
                    Clear
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleBackspace}
                    sx={{
                        backgroundColor: '#f5f5f5',
                        color: '#64b5f6',
                        fontSize: '18px',
                        fontWeight: 'bold',
                    }}
                >
                    ⬅️
                </Button>
            </Box>

        </Box>
    );
};

export default Calculator;
