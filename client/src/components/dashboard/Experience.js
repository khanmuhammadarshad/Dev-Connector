import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteExperience } from "../../redux/action/profile";
const Experience = ({ experience, deleteExperience }) => {
  const expriences = experience.map((exp) => (
    <tr key={exp._id}>
      <td>{exp.title}</td>
      <td class='hide-sm'>{exp.title}</td>
      <td class='hide-sm'>
        <Moment format='YYYY/MM/DD'>{exp.from}</Moment> -{" "}
        {exp.to === null ? (
          " Now"
        ) : (
          <Moment format='YYYY/MM/DD'>{exp.to}</Moment>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteExperience(exp._id)}
          class='btn btn-danger'
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <>
      {expriences && expriences.length > 0 ? (
        <>
          <h2 class='my-2'>Experience Credentials</h2>
          <table class='table'>
            <thead>
              <tr>
                <th>Company</th>
                <th class='hide-sm'>Title</th>
                <th class='hide-sm'>Years</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{expriences}</tbody>
          </table>
        </>
      ) : null}
    </>
  );
};
Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired,
};
export default connect(null, { deleteExperience })(Experience);
