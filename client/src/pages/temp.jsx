import React, { useEffect, useState } from 'react';
import { styled, Paper, InputBase, IconButton, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
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
  const [displayEvents, setDisplayEvents] = useState(false);
  const [artistUrl, setArtistUrl] = useState("");
  const [view, setView] = useState("");

  console.log(view);

  const handleShowEvents = () => {
    setDisplayEvents(true);
  };
  const handleHideEvents = () => {
    setDisplayEvents(false);
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
          <ToggleButton aria-label={artist.name} value={artist.name} onClick={() => setView(artist.name)}>
            {artist.name}
          </ToggleButton>)}
        </StyledToggleButtonGroup>
      )
    }
    return [];
  }
  
  const Events = ({ url }) => {
    const [ events, setEvents ] = useState([]);
  
    useEffect(() => {
      fetch(url)
        .then(res => res.json())
        .then(res => setEvents(res))
        .catch(() => null);
    }, [url]);
  
    if (events !== []) {
      return (
        <div>{events.map((event) => 
          <Box class="event-card">
            <div>{event.title}</div>
            <div>Date: {event.date}</div>
            <div>Time: UTC {event.time}</div>
            <div>Venue: {event.venue}</div>
            <div>Location: {event.location}</div>
          </Box>)}</div>
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
  
  function updateUrl(input) {
    let url = `/musicbrainz/${input}`;
    setArtistUrl(url);
  }

    return (
      <div class="search">
        <div class="header">
          <div class="header-title">FIND EVENTS</div>
          <div class="description">Find events with contries where the artists are from.</div>
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
                  updateUrl(country);
                  setDisplayArtists(true);
                }
              }}>
              <SearchIcon />
            </IconButton>
          </Paper>
        </div>
        <div class="container">

        { (displayArtists & view === "") ?
          <div class="search-result">
            <div>Artists in { country }</div>
            <Artists url={ artistUrl } />
          </div>
        :
            null 
        }

        { (displayArtists & view !== "") ?
        
          <div class="event-result">
            <Events url='/seatgeek/air-supply' />
          </div>
          :
          null
        }

        </div>
      </div>
    )
}
