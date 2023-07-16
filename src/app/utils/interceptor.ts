import axios, { AxiosResponse } from "axios";
import { notification } from "antd";

const service = axios.create({
  timeout: 10000,
})
service.interceptors.request.use(request => {
  if (localStorage.getItem('token')) {
    request.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return request;
});

service.interceptors.response.use(response => {
  return response;
}, error => {
  notification.error({
    message: error?.response?.data?.message || '网络错误',
  });
  throw error;
});

export default service;