import { v4 as uuid } from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "../action/types";
export const setAlert = (msg, alertType) => (dispatch) => {
  console.log("Call set alert");
  const id = uuid;
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });
  setTimeout(() => {
    dispatch({
      type: REMOVE_ALERT,
      payload: id,
    });
  }, 5000);
};
