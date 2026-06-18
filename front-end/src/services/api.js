import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://127.0.0.1:3000/api/v1",
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
  logout: () => api.post('/auth/logout').then(res => res.data),
  getMe: () => api.get('/auth/me').then(res => res.data),
};

// User API endpoints
export const userAPI = {
  getUsers: (params) => api.get('/users', { params }).then(res => res.data),
  getUser: (id) => api.get(`/users/${id}`).then(res => res.data),
  createUser: (data) => api.post('/users', data).then(res => res.data),
  updateUser: (id, data) => api.put(`/users/${id}`, data).then(res => res.data),
  deleteUser: (id) => api.delete(`/users/${id}`).then(res => res.data),
};

// Course API endpoints
export const courseAPI = {
  getCourses: (params) => api.get('/courses', { params }).then(res => res.data),
  getCourse: (courseCode) => api.get(`/courses/${courseCode}`).then(res => res.data),
  createCourse: (courseCode, data) => api.post(`/courses/${courseCode}`, data).then(res => res.data),
  updateCourse: (courseCode, data) => api.put(`/courses/${courseCode}`, data).then(res => res.data),
  deleteCourse: (courseCode) => api.delete(`/courses/${courseCode}`).then(res => res.data),
  changeStatus: (courseCode, status) => api.patch(`/courses/${courseCode}/status`, { status }).then(res => res.data),
};

// Session API endpoints
export const sessionAPI = {
  createSession: (courseCode, data) => api.post(`/sessions/${courseCode}`, data).then(res => res.data),
  getSession: (id) => api.get(`/sessions/${id}`).then(res => res.data),
  updateSession: (id, data) => api.put(`/sessions/${id}`, data).then(res => res.data),
  deleteSession: (id) => api.delete(`/sessions/${id}`).then(res => res.data),
  changeStatus: (id, data) => api.patch(`/sessions/${id}/status`, data).then(res => res.data),
};

// Enrollment API endpoints
export const enrollmentAPI = {
  enroll: (data) => api.post('/courseEnrollment/enroll', data).then(res => res.data),
  getUserEnrollments: (userId, params) => api.get(`/courseEnrollment/user/${userId}`, { params }).then(res => res.data),
  getCourseEnrollments: (courseId, params) => api.get(`/courseEnrollment/course/${courseId}`, { params }).then(res => res.data),
  getEnrollment: (id) => api.get(`/courseEnrollment/${id}`).then(res => res.data),
  updateEnrollmentStatus: (id, status) => api.put(`/courseEnrollment/${id}`, { status }).then(res => res.data),
  dropEnrollment: (id) => api.delete(`/courseEnrollment/${id}`).then(res => res.data),
  checkEnrollment: (courseId, userId) => api.get('/courseEnrollment/check', { params: { courseId, userId } }).then(res => res.data),
  getStatistics: (courseId) => api.get(`/courseEnrollment/course/${courseId}/statistics`).then(res => res.data),
};

export default api;