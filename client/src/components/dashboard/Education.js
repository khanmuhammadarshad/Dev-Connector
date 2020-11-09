import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteEducation } from "../../redux/action/profile";
const Education = ({ education, deleteEducation }) => {
  const educations = education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td class='hide-sm'>{edu.degree}</td>
      <td class='hide-sm'>
        <Moment format='YYYY/MM/DD'>{edu.from}</Moment> -{" "}
        {edu.to === null ? (
          " Now"
        ) : (
          <Moment format='YYYY/MM/DD'>{edu.to}</Moment>
        )}
      </td>{" "}
      <td>
        <button onClick={() => deleteEducation(edu._id)} class='btn btn-danger'>
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <>
      {" "}
      {educations && educations.length > 0 ? (
        <>
          <h2 class='my-2'>Education Credentials</h2>
          <table class='table'>
            <thead>
              <tr>
                <th>School</th>
                <th class='hide-sm'>Degree</th>
                <th class='hide-sm'>Years</th>
                <th />
              </tr>
            </thead>
            <tbody>{educations}</tbody>{" "}
          </table>
        </>
      ) : null}
    </>
  );
};
Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,
};
export default connect(null, { deleteEducation })(Education);
