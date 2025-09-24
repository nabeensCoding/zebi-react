import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_KKR_API_URL
});

// 요청 전에 엑세스토큰을 헤더에 붙이기
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답에서 401 나오면 로그인 페이지로 이동시키기
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(err.response.data.message);
  }
);

export default api;
