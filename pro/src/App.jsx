import './App.css';
import Typography from '@mui/material/Typography'
import {Outlet} from 'react-router-dom'
function App() {
  return (
    <Typography variant="body1" color="initial">
      Hello And Welcome to The hells kitchen
      <Outlet />
    </Typography>
  );
}

export default App;
