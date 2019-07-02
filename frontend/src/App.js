import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Search from './components/Search';
import Add from './components/Add';

function App() {

  return (
      <Router>
          <Header/>
          <Route path="/search" component={Search} />
          <Route path="/add" component={Add} />
          <Route path="/" exact component={Home} />
      </Router> 
  );
}

export default App;
