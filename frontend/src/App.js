import React from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Search from './components/Search';
import Add from './components/Add';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {

  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/search" component={Search} />
          <Route path="/add" component={Add} />
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
