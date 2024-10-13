import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  shadows: [
    'none', // elevation 0
    '0px 1px 3px rgba(0, 0, 0, 0.2)', // elevation 1
    '0px 3px 6px rgba(0, 0, 0, 0.16)', // elevation 2
    '0px 6px 12px rgba(0, 0, 0, 0.12)', // elevation 3
    '0px 9px 16px rgba(0, 0, 0, 0.1)', // elevation 4
    '0px 12px 24px rgba(0, 0, 0, 0.09)', // elevation 5
    '0px 16px 32px rgba(0, 0, 0, 0.08)', // elevation 6
    '0px 21px 40px rgba(0, 0, 0, 0.07)', // elevation 7
    '0px 24px 48px rgba(0, 0, 0, 0.06)', // elevation 8
    '0px 28px 56px rgba(0, 0, 0, 0.05)', // elevation 9
    '0px 32px 64px rgba(0, 0, 0, 0.04)', // elevation 10
    '0px 36px 72px rgba(0, 0, 0, 0.03)', // elevation 11
    '0px 40px 80px rgba(0, 0, 0, 0.02)', // elevation 12
    '0px 44px 88px rgba(0, 0, 0, 0.01)', // elevation 13
    '0px 48px 96px rgba(0, 0, 0, 0.01)', // elevation 14
    '0px 52px 104px rgba(0, 0, 0, 0.01)', // elevation 15
    '0px 56px 112px rgba(0, 0, 0, 0.01)', // elevation 16
    '0px 60px 120px rgba(0, 0, 0, 0.01)', // elevation 17
    '0px 64px 128px rgba(0, 0, 0, 0.01)', // elevation 18
    '0px 68px 136px rgba(0, 0, 0, 0.01)', // elevation 19
    '0px 72px 144px rgba(0, 0, 0, 0.01)', // elevation 20
    '0px 76px 152px rgba(0, 0, 0, 0.01)', // elevation 21
    '0px 80px 160px rgba(0, 0, 0, 0.01)', // elevation 22
    '0px 84px 168px rgba(0, 0, 0, 0.01)', // elevation 23
    '0px 88px 176px rgba(0, 0, 0, 0.01)', // elevation 24
  ],
  palette: {
    primary: {
      main: '#4361ee',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 400,
    },
  },
});
