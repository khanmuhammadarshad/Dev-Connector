import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/layouts/NavBar";
import Landing from "./components/layouts/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import Profiles from "./components/profiles/Profiles";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import Profile from "./components/profile/Profile";
import PrivateRoute from "./components/routing/PrivateRoute";
import { Provider } from "react-redux";
import store from "./redux/store";
import { loadUser } from "./redux/action/auth";
import Alert from "./components/layouts/alert";
import setAuthToken from "./utils/setAuthToken";
if (localStorage.token) setAuthToken(localStorage.token);
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <Route exact path='/' component={Landing} />
        <section className='container'>
          <Alert />
          <switch>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            {/* <Route exact path='/dashboard' component={Dashboard} /> */}
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute
              exact
              path='/create-profile'
              component={CreateProfile}
            />
            <PrivateRoute exact path='/edit-profile' component={EditProfile} />
            <Route exact path='/profiles' component={Profiles} />
            <PrivateRoute
              exact
              path='/add-experience'
              component={AddExperience}
            />
            <PrivateRoute
              exact
              path='/add-education'
              component={AddEducation}
            />
            <Route exact path='/profile/:id' component={Profile} />
          </switch>
        </section>
      </Router>
    </Provider>
  );
};
export default App;
