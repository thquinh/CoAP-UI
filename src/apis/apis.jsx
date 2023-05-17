import axiosInstance from "./axiosInstance"

// [
//     {
//       "id": 0,
//       "name": "string",
//       "delay": 0,
//       "state": "string"
//     }
// ]
export const getAllSensorInfo = async () => {
    const res = await axiosInstance.get(
      `/sensors`
    );
    return res.data;
};

//res
// {
//     "id": 0,
//     "name": "string",
//     "delay": 0,
//     "state": "string"
//  }
export const getSensorInfoByID = async (id) => {
    const res = await axiosInstance.get(
      `/sensors/${id}`
    );
    return res.data;
};

// [
//     {
//       "id": 0,
//       "name": "string",
//       "humidity": 0,
//       "timestamp": "string"
//     }
//   ]
export const getAllSensorData = async () => {
    const res = await axiosInstance.get(
      `/data`
    );
    return res.data;
};

export const changeSensorState = async (id, state) => {
    const res = await axiosInstance.put(`/sensors/${id}/state`, {
        "state": state
    });
    return res.data;
};

export const changeAllSensorState = async (state) => {
    const res = await axiosInstance.put(`/sensors/state`, {
        "state": state
    });
    return res.data;
};

export const changeSensorName = async (id, name) => {
    const res = await axiosInstance.put(`/sensors/${id}/name`, {
        "name": name
    });
    return res.data;
};

export const changeSpeed = async (speed) => {
    const res = await axiosInstance.put(`/sensors/speed`, {
        "delay": speed
    });
    return res.data;
};

export const addSensor = async (name) => {
    const res = await axiosInstance.post(`/sensors`, {
        "name": name
    });
    return res.data;
};

export const deleteSensor = async (id) => {
    const res = await axiosInstance.delete(`/sensors/${id}`);
    return res.data;
};