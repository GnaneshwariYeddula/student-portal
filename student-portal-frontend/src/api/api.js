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
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// -------------------- Auth APIs --------------------
const login = (data) => api.post("/auth/login", data).then((res) => res.data);
const register = (data) => api.post("/auth/register", data).then((res) => res.data);

// -------------------- Profile APIs --------------------
const fetchProfile = () => api.get("/profile").then((res) => res.data);
const updateProfile = (data) => api.put("/profile", data).then((res) => res.data);
const uploadProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append("photo", file);
  return api
    .post("/upload/profile-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

// -------------------- Certificates APIs --------------------
const fetchCertificates = () => api.get("/certificates").then((res) => res.data);
const addCertificate = (data) => api.post("/certificates", data).then((res) => res.data);
const deleteCertificate = (certificateId) =>
  api.delete(`/certificates/${certificateId}`).then((res) => res.data);
const uploadCertificateFile = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post(`/upload/certificate/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);
};

// -------------------- Marks APIs --------------------
const fetchMarks = () => api.get("/marks").then((res) => res.data);
const addSemester = (data) => api.post("/marks/semester", data).then((res) => res.data);
const editSemester = (semesterId, data) => api.put(`/marks/semester/${semesterId}`, data).then((res) => res.data);
const deleteSemester = (semesterId) => api.delete(`/marks/semester/${semesterId}`).then((res) => res.data);

const addSubject = (semesterId, data) => api.post(`/marks/semester/${semesterId}/subject`, data).then((res) => res.data);
const editSubject = (semesterId, subjectId, data) => api.put(`/marks/semester/${semesterId}/subject/${subjectId}`, data).then((res) => res.data);
const deleteSubject = (semesterId, subjectId) => api.delete(`/marks/semester/${semesterId}/subject/${subjectId}`).then((res) => res.data);

export {
  login, register,
  fetchProfile, updateProfile, uploadProfilePhoto,
  fetchCertificates, addCertificate, deleteCertificate, uploadCertificateFile,
  fetchMarks, addSemester, editSemester, deleteSemester,
  addSubject, editSubject, deleteSubject
};

export default {
  login, register,
  fetchProfile, updateProfile, uploadProfilePhoto,
  fetchCertificates, addCertificate, deleteCertificate, uploadCertificateFile,
  fetchMarks, addSemester, editSemester, deleteSemester,
  addSubject, editSubject, deleteSubject
};
