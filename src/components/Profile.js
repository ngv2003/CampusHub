import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import UserDetailsModal from "./UserDetailsModal";
import {
  fetchUserDetails,
  uploadCertificates,
  deleteCertificate,
  addSkill,
  deleteSkill
} from "../actions";

const Profile = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const certificateInputRef = useRef(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [skill, setSkill] = useState("");

  useEffect(() => {
    if (props.user) {
      props.fetchUserDetails(props.user.email);
    }
  }, [props.user]);

  useEffect(() => {
    if (props.userDetails.certificates) {
      setCertificates(props.userDetails.certificates);
    }
  }, [props.userDetails.certificates]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCertificateUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      props.uploadCertificates(props.user.email, files);
    }
  };

  const handleCertificateClick = (cert) => {
    setSelectedCertificate(cert);
  };

  const handleCertificateDelete = (cert) => {
    props.deleteCertificate(props.user.email, cert);
    setSelectedCertificate(null);
  };

  const handleAddSkill = () => {
    if (skill.trim() !== "") {
      props.addSkill(props.user.email, skill.trim());
      setSkill("");
    }
  };

  const handleDeleteSkill = (skill) => {
    props.deleteSkill(props.user.email, skill);
  };

  return (
    <Container>
      {!props.user && <Navigate to="/" />}
      <ProfileCard>
        <div>
          {props.user && props.user.photoURL ? (
            <img className="profileImg" src={props.user.photoURL} alt="User" />
          ) : (
            <img className="profileImg" src="/images/user.svg" alt=" " />
          )}
          <UserInfo>
            <h2>{props.user ? props.user.displayName : "User Name"}</h2>
            <p>{props.user ? props.user.email : "user@example.com"}</p>
            <h3>{props.userDetails.headline}</h3>
            <h3>{props.userDetails.branch}</h3>
            <h3>{props.userDetails.semester}</h3>
            {props.userDetails.links && (
              <h3>
                <a href={props.userDetails.links} target="_blank" rel="noopener noreferrer">
                  {props.userDetails.links}
                </a>
              </h3>
            )}
          </UserInfo>
        </div>
        <ProfileActions>
          <button onClick={toggleModal}>Edit Profile</button>
        </ProfileActions>
      </ProfileCard>
      <ProfileCard>
        <div>
          <h3>Certificates</h3>
          <input
            type="file"
            multiple
            ref={certificateInputRef}
            style={{ display: "none" }}
            onChange={handleCertificateUpload}
          />
          <button onClick={() => certificateInputRef.current.click()}>Upload Certificates</button>
          {certificates.map((cert, index) => (
            <div key={index} onClick={() => handleCertificateClick(cert)}>
              <img className="certificate" src={cert.url} alt={cert.name} />
            </div>
          ))}
        </div>
      </ProfileCard>
      <ProfileCard>
        <div>
          <h3>Skills</h3>
          <SkillInput>
            <input
              type="text"
              placeholder="Add a skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
            <button onClick={handleAddSkill}>Add Skill</button>
          </SkillInput>
          <SkillList>
            {props.userDetails.skills && props.userDetails.skills.map((skill, index) => (
              <SkillItem key={index}>
                {skill}
                <button onClick={() => handleDeleteSkill(skill)}>Delete</button>
              </SkillItem>
            ))}
          </SkillList>
        </div>
      </ProfileCard>
      {selectedCertificate && (
        <EnlargedCertificate>
          <img src={selectedCertificate.url} alt={selectedCertificate.name} />
          <div>
            <button onClick={() => setSelectedCertificate(null)}>Close</button>
            <button onClick={() => handleCertificateDelete(selectedCertificate)}>Delete</button>
          </div>
        </EnlargedCertificate>
      )}
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

  .profileImg {
    width: 100px;
    border-radius: 50%;
    margin-bottom: 20px;
  }

  .certificate {
    height: 100px;
    width: 150px;
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

    &:hover {
      background-color: #f0f0f0;
    }
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

  h3 {
    margin: 5px 0;
    color: #001838;

    a {
      color: #001838;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const SkillInput = styled.div`
  display: flex;
  align-items: center;
  input {
    padding: 10px;
    margin-right: 10px;
  }
`;

const SkillList = styled.div`
  margin-top: 20px;
`;

const SkillItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f3f3f3;
  margin-bottom: 10px;
  border-radius: 5px;
  button {
    background: none;
    border: none;
    color: red;
    cursor: pointer;
  }
`;

const EnlargedCertificate = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border: 3px solid #001838;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    max-width: 90%;
    max-height: 90%;
    margin-bottom: 10px;
  }

  button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #001838;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }

    &:nth-child(2) {
      margin-left: 10px;
      background-color: red;
    }

    &:nth-child(2):hover {
      background-color: darkred;
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    userDetails: state.userState.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchUserDetails: (email) => dispatch(fetchUserDetails(email)),
  uploadCertificates: (email, files) => dispatch(uploadCertificates(email, files)),
  deleteCertificate: (email, certificate) => dispatch(deleteCertificate(email, certificate)),
  addSkill: (email, skill) => dispatch(addSkill(email, skill)),
  deleteSkill: (email, skill) => dispatch(deleteSkill(email, skill)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);