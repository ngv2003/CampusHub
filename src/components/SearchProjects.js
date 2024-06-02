// src/components/SearchProjects.js
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SearchProjects = ({ projects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      setFilteredProjects(
        projects.filter(project =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProjects([]);
    }
  }, [searchTerm, projects]);

  const handleProjectClick = (projectId) => {
    navigate(`/procollab/${projectId}`);
  };

  return (
    <SearchContainer>
      <input
        type="text"
        placeholder="Search projects"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredProjects.length > 0 && (
        <Dropdown>
          {filteredProjects.map((project) => (
            <DropdownItem
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
            >
              {project.name}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </SearchContainer>
  );
};

const mapStateToProps = (state) => ({
  projects: state.projectState.projects,
});

export default connect(mapStateToProps)(SearchProjects);

const SearchContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Dropdown = styled.div`
  position: absolute;
  background-color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
`;

const DropdownItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
`;
