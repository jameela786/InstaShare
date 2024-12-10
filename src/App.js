import {Route, Switch, Redirect} from 'react-router-dom'

import {Component} from 'react'

import Login from './components/Login'
import Home from './components/Home'
import UserProfile from './components/UserProfile'
import MyProfile from './components/MyProfile'
import SearchResults from './components/SearchResults'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/users/:id" component={UserProfile} />
        <ProtectedRoute exact path="/my-profile" component={MyProfile} />
        <ProtectedRoute
          exact
          path="/searchResult/:searchTxt"
          component={SearchResults}
        />
        <Route path="/not-found" component={NotFound} />
        <Redirect to="not-found" />
      </Switch>
    )
  }
}

export default App
