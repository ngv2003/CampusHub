import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  getProjectsAPI,
  addProjectAPI,
  deleteProjectAPI,
  updateProjectAPI,
} from "../actions";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Navigate } from "react-router-dom";
import Modal from "./Modal"; // Adjust the path as necessary

const ProjectCollab = (props) => {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectRoles, setProjectRoles] = useState([{ name: "", role: "" }]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.user) {
      props.getProjects();
    }
  }, [props.user]);

  const handleUserClick = (email) => {
    navigate(`/user/${email}`);
  };

  const handleAddRole = () => {
    setProjectRoles([...projectRoles, { name: "", role: "" }]);
  };

  const handleRoleChange = (index, field, value) => {
    const newRoles = [...projectRoles];
    newRoles[index][field] = value;
    setProjectRoles(newRoles);
  };

  const handleRemoveRole = (index) => {
    const newRoles = projectRoles.filter((_, i) => i !== index);
    setProjectRoles(newRoles);
  };

  const handleProjectSubmit = () => {
    const projectData = {
      userName: props.user.displayName,
      profilePic: props.user.photoURL,
      email: props.user.email,
      name: projectName,
      description: projectDescription,
      roles: projectRoles,
      creator: props.user.email,
      timestamp: new Date().toISOString(),
    };

    if (isEditing) {
      props.updateProject(editingProjectId, projectData);
    } else {
      props.addProject(projectData);
    }

    resetForm();
  };

  const handleEditProject = (project) => {
    setProjectName(project.name);
    setProjectDescription(project.description);
    setProjectRoles(project.roles);
    setIsEditing(true);
    setEditingProjectId(project.id);
    setShowProjectForm(true);
  };

  const handleDeleteProject = (projectId) => {
    props.deleteProject(projectId);
  };

  const resetForm = () => {
    setProjectName("");
    setProjectDescription("");
    setProjectRoles([{ name: "", role: "" }]);
    setShowProjectForm(false);
    setIsEditing(false);
    setEditingProjectId(null);
  };

  const toggleProjectForm = () => {
    if (showProjectForm) {
      resetForm();
    } else {
      setShowProjectForm(true);
    }
  };

  if (!props.user) {
    return <Navigate to="/" />;
  }

  const filteredProjects = props.projects.filter((project) =>
    project.name.toLowerCase().includes(props.searchQuery.toLowerCase())
  );

  return (
    <Container>
      <ProjectBox>
        <button onClick={toggleProjectForm}>
          Create Project
        </button>
        <Modal show={showProjectForm} onClose={resetForm}>
          <ProjectForm>
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <textarea
              placeholder="Project Description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
            {projectRoles.map((role, index) => (
              <RoleInput key={index}>
                <input
                  type="text"
                  placeholder="Name"
                  value={role.name}
                  onChange={(e) =>
                    handleRoleChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={role.role}
                  onChange={(e) =>
                    handleRoleChange(index, "role", e.target.value)
                  }
                />
                <button onClick={() => handleRemoveRole(index)}>Remove</button>
              </RoleInput>
            ))}
            <button onClick={handleAddRole}>Add Role</button>
            <button onClick={handleProjectSubmit}>Submit</button>
            <button onClick={resetForm}>Cancel</button>
          </ProjectForm>
        </Modal>
      </ProjectBox>
      {filteredProjects.length === 0 ? (
        <p>There are no projects</p>
      ) : (
        <Content>
          {props.loading && <img src="/images/spin-loader.svg" className=".loading" />}
          {filteredProjects
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((project, key) => (
              <Project key={key}>
                <ProjectDetails>
                  <span onClick={() => handleUserClick(project.email)}>
                    <p>{project.userName}</p>
                    <img src={project.profilePic} />
                  </span>

                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <p>{formatDistanceToNow(new Date(project.timestamp))} ago</p>
                  <RoleList>
                    {project.roles.map((role, index) => (
                      <li key={index}>
                        {role.name}: {role.role}
                      </li>
                    ))}
                  </RoleList>
                  {project.creator === props.user.email && (
                    <Buttons>
                      <button onClick={() => handleEditProject(project)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProject(project.id)}>
                        Delete
                      </button>
                    </Buttons>
                  )}
                </ProjectDetails>
              </Project>
            ))}
        </Content>
      )}
    </Container>
  );
};

const Container = styled.div`
  grid-area: main;
  padding-top: 100px;
`;

const ProjectBox = styled.div`
  text-align: center;
  margin-bottom: 8px;
  button {
    padding: 10px;
    background-color: #0073b1;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const ProjectForm = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  input,
  textarea {
    margin: 5px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  button {
    padding: 10px;
    margin-top: 10px;
    background-color: #0073b1;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const RoleInput = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  input {
    width: 40%;
  }
  button {
    padding: 5px 10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const Content = styled.div`
  text-align: center;
  .loading{
    height: 30px;
    width: 30px;
  }
`;

const Project = styled.div`
  margin: 10px 0;
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ProjectDetails = styled.div`
  text-align: left;
  h3 {
    margin: 0;
  }
  p {
    margin: 5px 0;
  }
`;

const RoleList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 5px 0;
  li {
    margin: 3px 0;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  button {
    margin-left: 5px;
    padding: 5px 10px;
    background-color: #0073b1;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const mapStateToProps = (state) => {
  return {
    loading: state.projectState.loading,
    user: state.userState.user,
    projects: state.projectState.projects,
    searchQuery: state.searchState.searchQuery,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getProjects: () => dispatch(getProjectsAPI()),
  addProject: (projectData) => dispatch(addProjectAPI(projectData)),
  deleteProject: (projectId) => dispatch(deleteProjectAPI(projectId)),
  updateProject: (projectId, projectData) =>
    dispatch(updateProjectAPI(projectId, projectData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollab);