import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5109", // your backend URL
});

// Attach JWT token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
}); 

API.interceptors.response.use((res)=>{
  return(res)
},
(error)=>{
  if(error.response.status===401){
    alert("Session Expired")
    localStorage.removeItem("token");
    window.location.href="/login"
  }
  return Promise.reject(error)
})

export default API;