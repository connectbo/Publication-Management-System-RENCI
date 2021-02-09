import React from 'react';
import Header from './components/Header';
import Search from './components/Search';
import Add from './components/Add';
import { Router } from '@reach/router';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Admin from './components/Admin';
import Home from './views/Home';
import AdminLogin from './views/AdminLogin';

function App() {

  return (
      <div>
        <Header />
        <Router>
          <Add path="/add" />
          <Admin path='/admin' />
          <AdminLogin path='/login' />
          <Search path='/publications' />
          <Home path="/" />
        </Router>
      </div>
  );
}

export default App;
