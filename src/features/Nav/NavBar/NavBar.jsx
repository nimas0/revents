import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import { Menu, Container, Button } from 'semantic-ui-react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';
import { openModal } from '../../modals/modalActions';
const actions = {
  openModal
};

const mapState = (state) => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile
});

class NavBar extends Component {
  handleSignIn = () => this.props.openModal('LoginModal');
  handleSignOut = () => {
    this.props.firebase.logout();
    this.props.history.push('/');
  };

  handleRegister = () => {
    this.props.openModal('RegisterModal');
  };

  render() {
    const { auth, profile } = this.props;
    const authenticated = auth.isLoaded && !auth.isEmpty;
    return (
      <Menu inverted fixed='top'>
        <Container>
          {
            //Link up nav bar with NavLink routes. "Link" is used for button because NavLink talks to semantic UI to highlight active page, do not want button highlighted
          }
          <Menu.Item as={NavLink} exact to='/' header>
            <img src='/assets/logo.png' alt='logo' />
            Re-vents
          </Menu.Item>
          <Menu.Item as={NavLink} exact to='/events' name='Events' />
          {// expressions can not return mutliple items or nests so use fragment to fix
          authenticated  && (
            <Fragment>
              <Menu.Item as={NavLink} to='/people' name='People' />
              <Menu.Item as={NavLink} to='/test' name='test' />
              <Menu.Item>
                <Button
                  as={Link}
                  to='/createEvent'
                  floated='right'
                  positive
                  inverted
                  content='Create Event'
                />
              </Menu.Item>
            </Fragment>
          )}
          {authenticated ? (
            <SignedInMenu
              signOut={this.handleSignOut}
              profile={profile}
              auth={auth}
            />
          ) : (
            <SignedOutMenu
              signIn={this.handleSignIn}
              register={this.handleRegister}
            />
          )}
        </Container>
      </Menu>
    );
  }
}

export default withRouter(withFirebase(connect(mapState, actions)(NavBar)));
