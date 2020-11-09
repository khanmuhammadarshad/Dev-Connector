import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import ProfileGithub from "./ProfileGithub";
import profile from "../../redux/reducer/profile";
const ProfileTops = ({
  profile: {
    status,
    company,
    location,
    website,
    social,
    bio,
    experience,
    education,
    skills,
    githubusername,
    user: { name, avatar },
  },
}) => {
  return (
    <>
      <div class='profile-top bg-primary p-2'>
        <img class='round-img my-1' src={avatar} alt='' />
        <h1 class='large'>{name}</h1>
        <p class='lead'>{company}</p>
        <p>{location}</p>
        <div class='icons my-1'>
          {website && (
            <a href={website} target='_blank' rel='noopener noreferrer'>
              <i class='fas fa-globe fa-2x'></i>
            </a>
          )}
          {social && social.twitter && (
            <a href={social.twitter} target='_blank' rel='noopener noreferrer'>
              <i class='fab fa-twitter fa-2x'></i>
            </a>
          )}
          {social && social.facebook && (
            <a href={social.facebook} target='_blank' rel='noopener noreferrer'>
              <i class='fab fa-facebook fa-2x'></i>
            </a>
          )}
          {social && social.linkedin && (
            <a href={social.linkedin} target='_blank' rel='noopener noreferrer'>
              <i class='fab fa-linkedin fa-2x'></i>
            </a>
          )}
          {social && social.youtube && (
            <a href={social.youtube} target='_blank' rel='noopener noreferrer'>
              <i class='fab fa-youtube fa-2x'></i>
            </a>
          )}
          {social && social.instagram && (
            <a
              href={social.instagram}
              target='_blank'
              rel='noopener noreferrer'
            >
              <i class='fab fa-instagram fa-2x'></i>
            </a>
          )}
        </div>
      </div>

      <div class='profile-about bg-light p-2'>
        <h2 class='text-primary'>{name}</h2>
        <p>{bio}</p>
        <div class='line'></div>
        <h2 class='text-primary'>Skill Set</h2>
        <div class='skills'>
          {skills &&
            skills.length > 0 &&
            skills.map((skil) => (
              <div class='p-1'>
                <i class='fa fa-check'></i> {skil}
              </div>
            ))}
        </div>
      </div>

      <div class='profile-exp bg-white p-2'>
        <h2 class='text-primary'>Experience</h2>
        {experience &&
          experience.length > 0 &&
          experience.map((exp) => (
            <div>
              <h3 class='text-dark'>{exp.company}</h3>
              <p>
                <Moment format='YYYY/MM/DD'>{exp.from}</Moment> -{" "}
                {exp.current === true ? (
                  "Current"
                ) : (
                  <Moment format='YYYY/MM/DD'>{exp.to}</Moment>
                )}
              </p>
              <p>
                <strong>Position: </strong> {exp.title}
              </p>
              <p>
                <strong>Description: </strong>
                {exp.description}
              </p>
            </div>
          ))}
      </div>

      <div class='profile-edu bg-white p-2'>
        <h2 class='text-primary'>Education</h2>
        {education &&
          education.length > 0 &&
          education.map((edu) => (
            <div>
              <h3>{edu.school}</h3>
              <p>
                <Moment format='YYYY/MM/DD'>{edu.from}</Moment> -{" "}
                {edu.current === true ? (
                  "Current"
                ) : (
                  <Moment format='YYYY/MM/DD'>{edu.to}</Moment>
                )}
              </p>{" "}
              <p>
                <strong>Degree: </strong>
                {edu.degree}
              </p>
              <p>
                <strong>Field Of Study: </strong>
                {edu.fieldofstudy}
              </p>
              <p>
                <strong>Description: </strong>
                {edu.description}
              </p>
            </div>
          ))}
      </div>

      {githubusername && <ProfileGithub username={githubusername} />}
    </>
  );
};

ProfileTops.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileTops;
