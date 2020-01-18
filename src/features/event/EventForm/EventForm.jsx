/*global google*/
import React, { Component } from 'react';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from 'revalidate';
import { createEvent, updateEvent, cancelToggle } from '../eventActions';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';
import { withFirestore } from 'react-redux-firebase';

//map state for React-Redux
const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  // initialize state object 'event'
  let event = {};

  // match params id with the state id and return single event object
  if (
    state.firestore.ordered.events &&
    state.firestore.ordered.events.length > 0
  ) {
    event =
      state.firestore.ordered.events.filter(
        (event) => event.id === eventId
      )[0] || {};
  }

  return {
    initialValues: event,
    event,
    loading: state.async.loading
  };
};

//boiler plate
const actions = {
  createEvent,
  updateEvent,
  cancelToggle
};

// Form Validation via 'validator npm'
const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired({ message: 'The cateory is required' }),
  description: composeValidators(
    isRequired({ message: 'Please enter a description' }),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 characters'
    })
  )(), // extra () is just wierd boilerplate, see docs
  city: isRequired('city'),
  venue: isRequired('venue'),
  date: isRequired('date')
});

const category = [
  { key: 'drinks', text: 'Drinks', value: 'drinks' },
  { key: 'culture', text: 'Culture', value: 'culture' },
  { key: 'film', text: 'Film', value: 'film' },
  { key: 'food', text: 'Food', value: 'food' },
  { key: 'music', text: 'Music', value: 'music' },
  { key: 'travel', text: 'Travel', value: 'travel' }
];

class EventForm extends Component {
  state = { cityLatLng: {}, venueLatLng: {} };

  async componentDidMount() {
    const { firestore, match } = this.props;
    // if (match.path !== '/createEvent') {
    await firestore.setListener(`events/${match.params.id}`);
    // }
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  //On submit either create new event or update exsisting depending on router
  onFormSubmit = async (values) => {
    values.venueLatLng = this.state.venueLatLng;
    console.log(`the values of event are? ${this.props.event}`);
    try {
      if (this.props.initialValues.id) {
        if (Object.keys(values.venueLatLng).length === 0) {
          console.log('this occureed');
          values.venueLatLng = this.props.event.venueLatLng;
        }
        await this.props.updateEvent(values);
        this.props.history.push(`/events/${this.props.initialValues.id}`);
      } else {
        let createdEvent = await this.props.createEvent(values);
        this.props.history.push(`/events/${createdEvent.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleCitySelect = (selectedCity) => {
    geocodeByAddress(selectedCity)
      .then((results) => getLatLng(results[0]))
      .then((latlng) => {
        this.setState({
          cityLatlng: latlng
        });
      })
      .then(() => {
        this.props.change('city', selectedCity); // .change comes from redux form
      });
  };

  handleVenueSelect = (selectedVenue) => {
    geocodeByAddress(selectedVenue)
      .then((results) => getLatLng(results[0]))
      .then((latlng) => {
        this.setState({
          venueLatLng: latlng
        });
      })
      .then(() => {
        this.props.change('venue', selectedVenue); // .change comes from redux form
      });
  };

  render() {
    const {
      history,
      initialValues,
      invalid,
      submitting,
      pristine,
      event,
      cancelToggle,
      loading
    } = this.props;
    return (
      <Grid>
        <Grid.Column width={10}>
          <Segment>
            <Header sub color='teal' content='Event Details' />
            <br />
            <Form
              onSubmit={this.props.handleSubmit(this.onFormSubmit)}
              autoComplete='off'
            >
              <Field
                name='title'
                component={TextInput}
                placeholder='Give your event a name'
              />
              <Field
                name='category'
                component={SelectInput}
                options={category}
                placeholder='What is your event about?'
              />
              <Field
                name='description'
                component={TextArea}
                rows={3}
                placeholder='Tell us about your event'
              />
              <Header
                sub
                color='teal'
                padding='5'
                content='Event Location Details'
              />
              <Field
                name='city'
                component={PlaceInput}
                options={
                  {
                    types: ['(cities)']
                  } /* places api & react-places-autocomplete*/
                }
                onSelect={this.handleCitySelect}
                placeholder='Event City'
              />
              <Field
                name='venue'
                component={PlaceInput}
                options={{
                  location: new google.maps.LatLng(this.state.cityLatlng),
                  radius: 1000,
                  types: ['establishment']
                }}
                onSelect={this.handleVenueSelect}
                placeholder='Event Venue'
              />
              <Field
                name='date'
                component={DateInput}
                dateFormat='dd LLL yyyy h:mm a'
                showTimeSelect
                timeFormat='hh:mm a'
                placeholder='Event Date'
              />
              <Button
                loading={loading}
                disabled={invalid || submitting || pristine}
                positive
                type='submit'
              >
                Submit
              </Button>
              <Button
                onClick={
                  // have to use expression aka array function, bc we dont want the..
                  // ..parentheses from .push() to immediately fire
                  initialValues.id
                    ? () => history.push(`/events/${initialValues.id}`)
                    : () => history.push('/events')
                }
                type='button'
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type='button'
                color={event.cancelled ? 'green' : 'red'}
                floated='right'
                onClick={() => cancelToggle(!event.cancelled, event.id)}
              >
                {event.cancelled ? 'Reactivated event' : 'Cancel event'}
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default withFirestore(
  connect(
    mapState,
    actions
  )(
    reduxForm({ form: 'eventForm', validate, enableReinitialize: true })(
      EventForm
    )
  )
);
