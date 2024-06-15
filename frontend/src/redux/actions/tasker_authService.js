import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/task_workers/';

const tasker_register = async (taskerData) => {
  const user = JSON.parse(localStorage.getItem('token'));
  

  try {
    const response = await axios.post(API_URL +'become_tasker/', taskerData,{
      headers: {
        Authorization: `Bearer ${user}`
      }
    });
    if (response.data){
        localStorage.setItem('tasker', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


const getWorkCategories = async () => {
  try {
    const response = await axios.get(API_URL + 'workcategories/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

const tasker_authService = {
  tasker_register,
  getWorkCategories,
};

export default tasker_authService;
