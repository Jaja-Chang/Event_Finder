import React from 'react';
import './style.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from './pages/Search';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path='/search' element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
