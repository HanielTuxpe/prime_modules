// App.jsx
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Index from './Components/Students/Index';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Index />}
        />
      </Routes>
    </Router>
  );
}

export default App;
