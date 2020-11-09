import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  PROFILE_CEAR,
} from "../action/types";
import { setAlert } from "./alert";
import setAuthToken from "../../utils/setAuthToken";
import axios from "axios";

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) setAuthToken(localStorage.token);
  try {
    const res = await axios.get("/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ name, email, password });
  await axios
    .post("/api/user", body, config)
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    })
    .catch((error) => {
      if (error.response) {
        dispatch(setAlert(error.response.data.error.msg, "danger"));
        dispatch({
          type: REGISTER_FAIL,
        });
      }
    });
};
export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  await axios
    .post("/api/auth", body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    })
    .catch((error) => {
      if (error.response) {
        dispatch(setAlert(error.response.data.error[0].msg, "danger"));
        dispatch({
          type: LOGIN_FAIL,
        });
      }
    });
};

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
  dispatch({
    type: PROFILE_CEAR,
  });
};
