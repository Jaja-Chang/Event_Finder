import React, { useEffect, useState } from 'react';
import { styled, Paper, InputBase, IconButton, Box, ToggleButtonGroup, ToggleButton, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// import Paper from '@mui/material/Paper';
// import InputBase from '@mui/material/InputBase';
// import IconButton from '@mui/material/IconButton';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  border: '0px',
  fontFamily: 'monospace'
}));

export default function Search() {
  const [country, setCountry] = useState("");
  const [displayArtists, setDisplayArtists] = useState(false);
  const [artistUrl, setArtistUrl] = useState("");
  const [eventsUrl, setEventsUrl] = useState("");
  const [hotelsUrl, setHotelsUrl] = useState("");
  const [view, setView] = useState("");

  function updateEvents(artist){
    setView(artist.name);
    setEventsUrl(`/seatgeek/${artist.artist_dash}`);
  }

  const Artists = ({ url }) => {
    const [ artists, setArtists ] = useState([]);
    
    useEffect(() => {
      fetch(url)
        .then(res => res.json())
        .then(res => setArtists(res))
        .catch(() => null);
    }, [url]);
  
    if (artists !== []) {
      return (
        <StyledToggleButtonGroup
          orientation="vertical"
          value={view}
          exclusive
        >{artists.map((artist) => 
          <ToggleButton aria-label={artist.name} value={artist.name} onClick={() => updateEvents(artist)}>
            {artist.name}
          </ToggleButton>)}
        </StyledToggleButtonGroup>
      )
    }
    return [];
  }

  const EventList = ({ url }) => {
    const [ events, setEvents ] = useState([]);

    useEffect(() => {
      console.log(url);
      fetch(url)
        .then(res => res.json())
        .then(res => setEvents(res))
        .catch(() => null);
    }, [url]);
  
    if (events !== []) {
      return (
        <div>{events.map((event) => 
          <EventCard event={event} />
        )}</div>
      )
    }
    return [];
  }

  const EventCard = ({event}) => {
    console.log("EVENT: ", event);
    const [ displayHotels, setDisplayHotels ] = useState(false);
    const handleDisplayHotels = () => {
      if (displayHotels) {
        setDisplayHotels(false);
      }
      else {
        setDisplayHotels(true);
        setHotelsUrl(`/googlemap/${event.latlon}`);
      }
    };

    return (
      <Box class="event-card">
        <div>{event.title}</div>
        <div>Date: {event.date}</div>
        <div>Time: UTC {event.time}</div>
        <div>Venue: {event.venue}</div>
        <div>Location: {event.location}</div>
        <Button variant="contained" onClick={handleDisplayHotels}>
          HOTEL NEARBY
        </Button>
        { displayHotels ? <Hotels url={hotelsUrl} /> : null}
      </Box>
    );
  }

  const Hotels = ({ url }) => {
    const [ hotels, setHotels ] = useState([]);

    useEffect(() => {
      console.log(url);
      fetch(url)
        .then(res => res.json())
        .then(res => setHotels(res))
        .catch(() => null);
    }, [url]);
  
    if (hotels !== []) {
      return (
        <div>{hotels.map((hotel) => 
          <p>{hotel.address}</p>
        )}</div>
      )
    }
    return [];
  }

  function Counter() {
    return fetch('\counter')
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          return res.view_count;
        })
  }

  // const Counter = ({ url }) => {
  //   const [ numView, setNumView ] = useState(null);

  //   useEffect(() => {
  //     console.log(url);
  //     fetch(url)
  //       .then(res => res.json())
  //       .then(res => setNumView(res))
  //       .catch(() => null);
  //   }, [url]);
  
  //   if (numView !== null) {
  //     return (
  //       <div>{numView.view_count} Views</div>
  //     )
  //   }
  //   return null;
  // }


  function updateCountry(input) {
    if (input != null) {
      setCountry(input);
      console.log(country);
    } else {
      setCountry("");
    }
  }
  
    return (
      <div class="search">
        <div class="header">
          <div class="header-title">FIND EVENTS</div>
          <div class="description">Find events with contries where the artists are from.</div>
          <div>{Counter} Views</div>
          {/* <div><Counter url="/counter"/></div> */}
        </div>
        <div class="input-bar">
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '60%' }}
            >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search by country"
              inputProps={{ 'aria-label': 'search by country' }}
              onChange={ (e) => {updateCountry(e.target.value)} }
            />
            <IconButton 
              type="button" 
              sx={{ p: '10px' }} 
              aria-label="search" 
              onClick={() => {
                if (country === "") {
                  alert("Please enter a valid country");
                }
                else {
                  setArtistUrl(`/musicbrainz/${country}`);
                  setDisplayArtists(true);
                }
              }}>
              <SearchIcon />
            </IconButton>
          </Paper>
        </div>
        <div class="container">

        { (displayArtists) ?
          <div class="search-result">
            <div>Artists in { country }</div>
            <Artists url={ artistUrl } />
          </div>
        :
            null 
        }

        { (displayArtists & view !== "") ?
        
          <div class="event-result">
            <EventList url={eventsUrl} />
          </div>
          :
          null
        }

        </div>
      </div>
    )
}
