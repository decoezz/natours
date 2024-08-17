import axios from 'axios';
import { showAlert } from './alerts';
export const UpdateSettings = async (data, type) => {
  try {
    // const token = req.headers.authorization.split(' ')[1];
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      // window.setTimeout(() => {
      //   location.reload(true);
      // }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};