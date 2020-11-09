import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layouts/Spinner";
import { getGithubRepo } from "../../redux/action/profile";
const ProfileGithub = ({ username, getGithubRepo, repos }) => {
  useEffect(() => {
    getGithubRepo(username);
  }, []);
  const repo = (e) => {
    return repos.map(() => (
      <div class='repo bg-white p-1 my-1'>
        <div>
          <h4>
            <a href={repo.clone_url} target='_blank' rel='noopener noreferrer'>
              {repo.name}
            </a>
          </h4>
          <p>{repo.description}</p>
        </div>
        <div>
          <ul>
            <li class='badge badge-primary'>Stars: {repo.stargazers_count}</li>
            <li class='badge badge-dark'>Watchers: {repo.watchers}</li>
            <li class='badge badge-light'>Forks: {repo.forks}</li>
          </ul>
        </div>
      </div>
    ));
  };
  return (
    <>
      {repos && repos.length > 0 ? (
        <div class='profile-github'>
          <h2 class='text-primary my-1'>
            <i class='fab fa-github'></i> Github Repos
          </h2>
          {repo()}
        </div>
      ) : null}
    </>
  );
};

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired,
  getGithubRepo: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
};
const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepo })(ProfileGithub);
//       <div class='repo bg-white p-1 my-1'>
//         <div>
//           <h4>
//             <a
//               href={repo.clone_url}
//               target='_blank'
//               rel='noopener noreferrer'
//             >
//               {repo.name}
//             </a>
//           </h4>
//           <p>{repo.description}</p>
//         </div>
//         <div>
//           <ul>
//             <li class='badge badge-primary'>
//               Stars: {repo.stargazers_count}
//             </li>
//             <li class='badge badge-dark'>Watchers: {repo.watchers}</li>
//             <li class='badge badge-light'>Forks: {repo.forks}</li>
//           </ul>
//         </div>
//       </div>
//     )
//   )}
// </div>
