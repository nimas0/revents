import React from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import GoogleMapReact from 'google-map-react';

const Marker = () => <Icon name='marker' size='big' color='red' />;

const EventDetailedMap = ({ lat, lng }) => {
 const zoom = 14;
 return (
  <Segment attached='bottom' style={{padding: 0}}>
      {
          // Important! Always set the container height explicitly
      }
      <div style={{ height: '50vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyAFL35Gd5MBU7MjKxIBAF9K4k4DX-XKG1s' }}
          defaultCenter={{lat, lng}}
          defaultZoom={zoom}
        >
          <Marker lat={lat} lng={lng} />
        </GoogleMapReact>
      </div>
  </Segment>
 );
};

export default EventDetailedMap;
