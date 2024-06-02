import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getEventsAPI } from '../actions';
import { useNavigate } from 'react-router-dom';

const Rightside = (props) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.eventState.events);
  const navigate = useNavigate();
  const [todayEvents, setTodayEvents] = useState([]);

  useEffect(() => {
    dispatch(getEventsAPI());
  }, [dispatch]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; 
    console.log("Today's date:", today);
    console.log("Fetched events:", events);
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      console.log("Event date:", eventDate);
      return eventDate === today;
    });
    console.log("Filtered events for today:", filteredEvents);
    setTodayEvents(filteredEvents);
  }, [events]);

  const handleExploreEventClick = () => {
    navigate('/events')
  }

  return (
    <Container>
      <FollowCard>
        <Title>
          <h2>Today's Events</h2>
          <img src="/images/feed-icon.svg" alt="" />
        </Title>
        <FeedList>
          {todayEvents.length > 0 ? (
            todayEvents.map(event => (
              <li key={event.id}>
                <EventItem>
                  <Avatar />
                  <EventInfo>
                    <span>{event.name}</span>
                    <span>{event.time}</span>
                  </EventInfo>
                </EventItem>
              </li>
            ))
          ) : (
            <p>No events for today</p>
          )}
        </FeedList>
        <Recommendation onClick={handleExploreEventClick}>
          Explore more events
          <img src="/images/right-icon.svg" alt="" onClick={handleExploreEventClick} />
        </Recommendation>
      </FollowCard>
    </Container>
  );
};

const Container = styled.div`
  grid-area: rightside;
`;

const FollowCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #98c5e9;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  padding: 12px;
  border: 3px solid #001838;
`;

const Title = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  color: rgba(0, 0, 0, 0.6);
`;

const FeedList = styled.ul`
  margin-top: 16px;
  li {
    display: flex;
    align-items: center;
    margin: 12px 0;
    position: relative;
    font-size: 14px;
  }
`;

const EventItem = styled.div`
  display: flex;
  align-items: center;
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 5px;
  margin-bottom: 10px;
`;

const Avatar = styled.div`
  background-image: url("images/today's-event.svg");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  margin-right: 8px;
`;

const Recommendation = styled.a`
  color: #001838;
  display: flex;
  align-items: center;
  font-size: 14px;

  img {
    height: 20px;
    width: 30px;
  }
`;

export default Rightside;