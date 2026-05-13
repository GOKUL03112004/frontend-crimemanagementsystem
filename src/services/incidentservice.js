import API from "./api"

export const getAllIncidents = ()=>{
    API.get("/Incident/GetAllIncidents")
}


    