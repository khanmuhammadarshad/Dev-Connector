import {
  GET_PROFILE,
  GET_REPOS,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  PROFILE_CEAR,
  ACCOUNT_DELETED,
} from "../action/types";
import { setAlert } from "./alert";
import axios from "axios";

export const getCurrentProfile = () => async (dispatch) => {
  await axios
    .get("/api/profile/me")
    .then((res) => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};
export const getProfiles = () => async (dispatch) => {
  dispatch({
    type: PROFILE_CEAR,
  });
  await axios
    .get("/api/profile")
    .then((res) => {
      dispatch({
        type: GET_PROFILES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};
export const getProfileById = (userId) => async (dispatch) => {
  await axios
    .get(`/api/profile/user/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};
export const getGithubRepo = (username) => async (dispatch) => {
  await axios
    .get(`/api/profile/github/${username}`)
    .then((res) => {
      dispatch({
        type: GET_REPOS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  await axios
    .post("/api/profile", formData, config)
    .then((res) => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
      dispatch(
        setAlert(edit ? "Profile Updated" : "Profile Created", "success")
      );

      history.push("/dashboard");
    })
    .catch((err) => {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};
export const addExperience = (formData, history) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  await axios
    .put("/api/profile/experience", formData, config)
    .then((res) => {
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert("Experience Added", "success"));
      history.push("/dashboard");
    })
    .catch((err) => {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};
export const addEducation = (formData, history) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  await axios
    .put("/api/profile/education", formData, config)
    .then((res) => {
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert("Experience Added", "success"));
      history.push("/dashboard");
    })
    .catch((err) => {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};
export const deleteExperience = (id) => async (dispatch) => {
  await axios
    .delete(`/api/profile/experience/${id}`)
    .then((res) => {
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert("Experience removed", "success"));
    })
    .catch((err) => {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};
export const deleteEducation = (id) => async (dispatch) => {
  await axios
    .delete(`/api/profile/education/${id}`)
    .then((res) => {
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert("Education removed", "success"));
    })
    .catch((err) => {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    });
};
export const accountDeleted = () => async (dispatch) => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    await axios
      .delete(`/api/profile`)
      .then((res) => {
        dispatch({
          type: PROFILE_CEAR,
        });
        dispatch({
          type: ACCOUNT_DELETED,
        });
        dispatch(
          setAlert("Your account has been permantly deleted", "success")
        );
      })
      .catch((err) => {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status,
          },
        });
      });
  }
};
