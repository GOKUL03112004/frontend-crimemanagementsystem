import API from "./api";

export const getAllUsers = () => API.get("/User/GetAllUsers");