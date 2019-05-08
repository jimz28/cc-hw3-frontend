import React from 'react';
import { Route, Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import Header from './views/header';
import Home from './views/home';
import Album from './views/album';
import AddPhoto from './views/addPhoto';



function App() {
  return (
    <div className="App">
      <Router history={createHistory()}>
        <div className="route">
          <Header />
          <Route exact path="/" component={Home} />
          <Route exact path="/album" component={Album} />
          <Route exact path="/photo" component={AddPhoto} />
        </div>
      </Router>
    </div>
  );
}

export default App;