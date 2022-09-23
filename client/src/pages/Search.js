import React, { useEffect, useState } from 'react';
import { Paper, InputBase, IconButton, Box, ToggleButtonGroup } from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import SearchIcon from '@mui/icons-material/Search';
import { StyledButton } from "../components/StyledButton";
import { StyledToggleButton } from "../components/StyledToggleButton";


export default function Search() {
  const [ country, setCountry ] = useState("");
  const [ artists, setArtists ] = useState([]);
  const [ artistUrl, setArtistUrl ] = useState("");
  const [ displayArtists, setDisplayArtists ] = useState(false);
  const [ events, setEvents ] = useState([]);
  const [ eventsUrl, setEventsUrl ] = useState("");
  const [ hotelsUrl, setHotelsUrl ] = useState("");
  const [ view, setView ] = useState("");
  const [ numView, setNumView ] = useState(null);

  useEffect(() => {
    fetch('/counter')
      .then(res => res.json())
      .then(res => setNumView(res.view_count))
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    fetch(artistUrl)
      .then(res => res.json())
      .then(res => setArtists(res))
      .catch((e) => console.log(e));
  }, [artistUrl]);

  useEffect(() => {
    fetch(eventsUrl)
      .then(res => res.json())
      .then(res => setEvents(res))
      .catch((e) => console.log(e));
  }, [eventsUrl]);


  const EventCard = ({event}) => {
    console.log("EVENT: ", event);
    const [ displayHotels, setDisplayHotels ] = useState(false);
    const handleDisplayHotels = () => {
      if (displayHotels) {
        setDisplayHotels(false);
      }
      else {
        setDisplayHotels(true);
        // console.log(event.latlon);
        setHotelsUrl(`/googlemap/${event.latlon}`);
      }
    };

    return (
      <Box class="event-card">
        <div class="info-title">{event.title}</div>
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
        .catch((e) => console.log(e));
    }, [url]);
  
    if (hotels !== []) {
      return (
        <div>{hotels.map((hotel) =>
          <Box class="hotel-card">
            <div class="info-title">{hotel.name}</div>
            <div>Phone number: {hotel.phone_number}</div>
            <div>Address: {hotel.address}</div>
            <div>Rating: {hotel.rating}</div>
            <div class="event-card-buttons">
              <StyledButton onClick={() => {
                window.open(hotel.url);
              }}>
                SHOW IN GOOGLE MAP
              </StyledButton>
            </div>
          </Box> 
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
                setArtists([]);
                setEvents([]);
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
              <div>It takes a while to load or there is no artist in { country }.</div>
            }
          </div>
        :
        null 
      }

        { (displayArtists & view !== "") ?
        
          <div class="event-result">

            {
              (events.length !== 0) ?
                <div>{events.map((event) => 
                  <EventCard event={event} />
                )}</div>
              :
              <div class="event-result-label">It takes a while to load or there is no event. </div>
            }
          </div>
          :
          null
        }

        </div>
      </div>
    )
}
