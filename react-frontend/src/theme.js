import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
    },
    secondary: {
      main: '#f50057',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
