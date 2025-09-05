// src/api/api.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------------------- Auth APIs --------------------
const login = (data) => api.post("/auth/login", data);
const register = (data) => api.post("/auth/register", data);

// Backward-compatible names for older pages
const loginUser = login;
const registerUser = register;

// -------------------- Profile APIs --------------------
const fetchProfile = () => api.get("/profile").then(res => res.data);
const updateProfile = (data) => api.put("/profile", data).then(res => res.data);
const uploadProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append("photo", file);
  return api
    .post("/upload/profile-photo", formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then(res => res.data);
};

// -------------------- Marks APIs --------------------
const fetchMarks = () => api.get("/marks").then(res => res.data);
const addMark = (data) => api.post("/marks", data).then(res => res.data);
const deleteSemester = (semesterId) => api.delete(`/marks/${semesterId}`).then(res => res.data);
const deleteSubject = (semesterId, subjectId) => api.delete(`/marks/${semesterId}/subjects/${subjectId}`).then(res => res.data);

// -------------------- Certificates APIs --------------------
const fetchCertificates = () => api.get("/certificates").then(res => res.data);
const addCertificate = (data) => api.post("/certificates", data).then(res => res.data);
const deleteCertificate = (certificateId) => api.delete(`/certificates/${certificateId}`).then(res => res.data);
const uploadCertificateFile = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api
    .post(`/upload/certificate/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then(res => res.data);
};

// -------------------- Named Exports --------------------
export {
  login,
  register,
  loginUser,
  registerUser,
  fetchProfile,
  updateProfile,
  uploadProfilePhoto,
  fetchMarks,
  addMark,
  deleteSemester,
  deleteSubject,
  fetchCertificates,
  addCertificate,
  deleteCertificate,
  uploadCertificateFile,
};

// -------------------- Default Export --------------------
export default {
  login,
  register,
  loginUser,
  registerUser,
  fetchProfile,
  updateProfile,
  uploadProfilePhoto,
  fetchMarks,
  addMark,
  deleteSemester,
  deleteSubject,
  fetchCertificates,
  addCertificate,
  deleteCertificate,
  uploadCertificateFile,
};
