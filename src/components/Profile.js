import { useState, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import UserDetailsModal from "./UserDetailsModal";
import { Navigate } from "react-router-dom";

const Profile = (props) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {}, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <Container>
        {!props.user && <Navigate to="/" />}
      <ProfileCard>
        <div>
          {props.user && props.user.photoURL ? (
            <img src={props.user.photoURL} alt="User" />
          ) : (
            <img src="/images/user.svg" alt=" " />
          )}
          <UserInfo>
            <h2>{props.user ? props.user.displayName : "User Name"}</h2>
            <p>{props.user ? props.user.email : "user@example.com"}</p>
            <h2>headline</h2>
            <h3>branch</h3>
            <h3>semester</h3>
            <h3>Links</h3>
          </UserInfo>
        </div>
        <ProfileActions>
          <button onClick={toggleModal}>Edit Profile</button>
        </ProfileActions>
      </ProfileCard>
      <ProfileCard>
        <div>Certificates</div>
      </ProfileCard>
      <ProfileCard>
        <div>Skills</div>
      </ProfileCard>
      <UserDetailsModal
        showModal={showModal ? "open" : "close"}
        handleClick={toggleModal}
      />
    </Container>
  );
};

const Container = styled.div`
  padding-top: 100px;
  grid-area: main;
  margin: 0px;
`;

const CommonCard = styled.div`
  margin-left: 175px;
  margin-right: 175px;
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #98c5e9;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  border: 3px solid #001838;
`;

const ProfileCard = styled(CommonCard)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
  margin-bottom: 50px;

  img {
    width: 100px;
    border-radius: 50%;
    margin-bottom: 20px;
  }
`;

const UserInfo = styled.div`
  text-align: center;

  h2 {
    margin: 0;
    font-size: 24px;
    color: #001838;
  }

  p {
    margin: 5px 0;
    color: rgba(0, 0, 0, 0.6);
  }
`;

const ProfileActions = styled.div`
  margin-top: 20px;

  button {
    margin: 0 10px;
    padding: 10px 20px;
    color: #001838;
    background-color: #fff;
    border: 1px solid #001838;
    border-radius: 20px;
    cursor: pointer;
  }
`;

const Content = styled.div`
  margin-top: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: #98c5e9;
  border-radius: 5px;
  text-align: left;

  h3 {
    margin: 0 0 10px 0;
    color: #001838;
  }

  p {
    margin: 0;
    color: rgba(0, 0, 0, 0.9);
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

export default connect(mapStateToProps)(Profile);