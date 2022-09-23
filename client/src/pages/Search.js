import React, { useEffect, useState } from 'react';
import { Paper, InputBase, IconButton, Box, ToggleButtonGroup } from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import SearchIcon from '@mui/icons-material/Search';
import { StyledButton } from "../components/StyledButton";
import { StyledToggleButton } from "../components/StyledToggleButton";


export default function Search() {
  const [ country, setCountry ] = useState("");
  const [ displayArtists, setDisplayArtists ] = useState(false);
  const [ artistUrl, setArtistUrl ] = useState("");
  const [ eventsUrl, setEventsUrl ] = useState("");
  const [ hotelsUrl, setHotelsUrl ] = useState("");
  const [ view, setView ] = useState("");
  const [ numView, setNumView ] = useState(null);

  useEffect(() => {
    fetch('/counter')
      .then(res => res.json())
      .then(res => setNumView(res.view_count))
      .catch(() => null);
  }, []);

  const [ artists, setArtists ] = useState([]);
    
  useEffect(() => {
    fetch(artistUrl)
      .then(res => res.json())
      .then(res => setArtists(res))
      .catch(() => null);
  }, [artistUrl]);

  // const Artists = ({ url }) => {
  //   const [ artists, setArtists ] = useState([]);
    
  //   useEffect(() => {
  //     fetch(url)
  //       .then(res => res.json())
  //       .then(res => setArtists(res))
  //       .catch(() => null);
  //   }, [url]);
  
  //   if (artists !== []) {
  //     return (
  //       <ToggleButtonGroup
  //         orientation="vertical"
  //         value={view}
  //         exclusive
  //       >{artists.map((artist) => 
  //         <StyledToggleButton aria-label={artist.name} value={artist.name} onClick={() => updateEvents(artist)}>
  //           {artist.name}
  //         </StyledToggleButton>)}
  //       </ToggleButtonGroup>
  //     )
  //   }
  //   return [];
  // }


  const [ events, setEvents ] = useState([]);

  useEffect(() => {
    fetch(eventsUrl)
      .then(res => res.json())
      .then(res => setEvents(res))
      .catch(() => null);
  }, [eventsUrl]);


  // const EventList = ({ url }) => {
  //   const [ events, setEvents ] = useState([]);

  //   useEffect(() => {
  //     console.log(url);
  //     fetch(url)
  //       .then(res => res.json())
  //       .then(res => setEvents(res))
  //       .catch(() => null);
  //   }, [url]);
  
  //   if (events.length !== 0) {
  //     console.log("some events");
  //     console.log(events);
  //     return (
  //       <div>{events.map((event) => 
  //         <EventCard event={event} />
  //       )}</div>
  //     )
  //   } else {
  //     return (
  //       <div class="event-result-label">There is no event. </div>
  //     )
  //   }
  // }

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
        <div class="event-title">{event.title}</div>
        <div>Date: {event.date}</div>
        <div>Time: UTC {event.time}</div>
        <div>Venue: {event.venue}</div>
        <div>Location: {event.location}</div>
        <div class="event-card-buttons">
          <StyledButton onClick={() => {
            window.open(event.url);
          }}>
            MORE INFO
          </StyledButton>
          <StyledButton onClick={handleDisplayHotels}>
            HOTEL NEARBY
          </StyledButton>
        </div>
        
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

  function updateCountry(input) {
    if (input != null) {
      setCountry(input);
      console.log(country);
    } else {
      setCountry("");
    }
  }

  function updateEvents(artist){
    setView(artist.name);
    setEventsUrl(`/seatgeek/${artist.artist_dash}`);
  }
  
    return (
      <div class="search">
        <div class="header">
          <div class="header-title">FIND EVENTS</div>
          <div class="description">Find events with contries where the artists are from.</div>
          <div class="view-count">
            <VisibilityRoundedIcon />{numView}
          </div>
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
              onChange={ (e) => {
                setDisplayArtists(false);
                updateCountry(e.target.value);
            }}/>
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
            <div class="country-label">Artists in { country }</div>
            {/* <Artists url={ artistUrl } /> */}

            { (artists.length !== 0) ?
              <ToggleButtonGroup
                orientation="vertical"
                value={view}
                exclusive
              >{artists.map((artist) => 
                <StyledToggleButton aria-label={ artist.name } value={ artist.name } onClick={() => updateEvents(artist)}>
                  { artist.name }
                </StyledToggleButton>)}
              </ToggleButtonGroup>
              :
              <div>There is no artist in { country }.</div>
            }
          </div>
        :
            null 
        }

        { (displayArtists & view !== "") ?
        
          <div class="event-result">
            {/* <EventList url={eventsUrl} /> */}

            {
              (events.length !== 0) ?
                <div>{events.map((event) => 
                  <EventCard event={event} />
                )}</div>
              :
              <div class="event-result-label">There is no event. </div>
            }
          </div>
          :
          null
        }

        </div>
      </div>
    )
}
