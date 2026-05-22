import API from "./api";

export const getAllOfficers = () => API.get("/Officer/GetAllOfficers");

export const createOfficer = (data) => API.post("/Officer/CreateOfficer", data);

export const updateOfficer = (data) => API.put("/Officer/UpdateOfficer", data);

export const deleteOfficer = (id) => API.delete(`/Officer/DeleteOfficer/${id}`);