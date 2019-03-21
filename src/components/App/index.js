import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import AccountPage from "../Account";
import LivePage from "../Live";
import StreamPage from "../StreamingPages";
import AdvertPage from "../Advertise";

import { withAuthentication } from "../Session";

import * as ROUTES from "../../constants/routes";
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      channels: {}
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.Channels().on("value", snapshot => {
      this.setState({
        channels: snapshot.val(),
        loading: false
      });
    });
  }
  componentWillUnmount() {
    this.props.firebase.Channels().off();
  }
  render() {
    const { channels, loading } = this.state;
    const DynamicRoutes = [];
    for (const key in channels) {
      if (!channels.hasOwnProperty(key)) continue;

      const obj = channels[key];

      console.log(key);
      /*  for (const prop in obj) {
        if (!obj.hasOwnProperty(prop)) continue;
        if (prop === "Stream") console.log(obj[prop]);
        if (prop === "ShortDescription") console.log(obj[prop]);
        if (prop === "LongDescription") console.log(obj[prop]);
        if (prop === "Path") console.log(obj[prop]);
       
      }*/
      DynamicRoutes.push(
        <Route
          path={obj.Path}
          key={key}
          render={props => (
            <StreamPage
              {...props}
              LiveStream={obj.Stream}
              Name={obj.Name}
              Description={obj.LongDescription}
            />
          )}
        />
      );
    }
    return (
      <Router>
        <div>
          <Navigation />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.LIVE} component={LivePage} />
          <Route path={ROUTES.ADVERTIES} component={AdvertPage} />
          {
            <div>
              {loading && <div className="MyPreLoader">Loading...</div>}
            </div>
          }
          {DynamicRoutes}
        </div>
      </Router>
    );
  }
}
export default withAuthentication(App);
