// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Use Routes instead of Switch
import ModelListPage from './ClientRoute/ModelListPage';
import HomePage from './ClientRoute/HomePage';
import AnnotationPage from './ClientRoute/AnnotationPage'; // import the Annotation component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/models" element={<ModelListPage />} />
        <Route path="/annotation" element={<AnnotationPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
