import React, { Component, Fragment } from 'react';
import EventDashboard from '../../features/event/EventDashboard/EventDashboard';
import NavBar from '../../features/Nav/NavBar/NavBar';
import { Container } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import EventDetailedPage from '../../features/event/EventDetailed/EventDetailedPage';
import PeopleDashboard from '../../features/user/PeopleDashboard/PeopleDashboard';
import UserDetailedPage from '../../features/user/UserDetailed/UserDetailedPage';
import SettingsDashboard from '../../features/user/Settings/SettingsDashboard';
import EventForm from '../../features/event/EventForm/EventForm';
import TestComponent from '../../features/TestArea/TestComponent';
import ModalManager from '../../features/modals/ModalManager';

class App extends Component {
  render() {
    return (
      <Fragment>
        {
          // we have two main routes. 1 for homepage aka "/", if it is "/" plus anything else
          //then it will go into sub routes to match whatever else is in the sub routes
        }
        <Route exact path='/' component={HomePage} />
        <Route
          path='/(.+)' // see section 6 #45
          render={() => (
            // () are used instead of {} to simplify returning a function of only one expression aka Fragment is one expression
            //https://stackoverflow.com/questions/49895339/difference-between-arrow-functions-with-parentheses-or-brackets
            <Fragment>
              <ModalManager />
              <NavBar />
              <Container className='main'>
                <Switch key={this.props.location.key}>
                  {
                    // Switch only loads the one route that matches with url
                    // key property fixes issue with route array ' createEvent, manage/id
                    // see sec8.lession71 in udemy course
                  }
                  <Route exact path='/events' component={EventDashboard} />
                  <Route path='/events/:id' component={EventDetailedPage} />
                  <Route path='/people' component={PeopleDashboard} />
                  <Route path='/profile/:id' component={UserDetailedPage} />
                  <Route path='/settings' component={SettingsDashboard} />
                  <Route
                    path={['/createEvent', '/manage/:id']}
                    component={EventForm}
                  />
                  <Route path='/test' component={TestComponent} />
                </Switch>
              </Container>
            </Fragment>
          )}
        />
      </Fragment>
    );
  }
}

export default withRouter(App);
