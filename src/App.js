import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword"
import UserDashBoard from "./pages/user/UserDashBoard";
import CreateIncident from "./pages/user/CreateIncident";
import GetAllIncidentUser from "./pages/user/GetAllIncident"
import OfficerDashBoard from "./pages/officer/OfficerDashBoard";
import OfficerIncidents from "./pages/officer/OfficerIncidents"
import StationHeadDashBoard from "./pages/stationhead/StationHeadDashBoard";
import UsersManagement from "./pages/stationhead/UsersPage"
import OfficerManagement from "./pages/stationhead/OfficersPage"
import IncidentsManagement from "./pages/stationhead/IncidentsPage"
import CreateOfficer from "./pages/stationhead/CreateOfficer"
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
        <Route path="/change-password" element={<ProtectedRoute><ChangePassword/></ProtectedRoute>}/>

        {/* Users */}
        <Route path="/user-dashboard" element={<ProtectedRoute><UserDashBoard /></ProtectedRoute>}/>
        <Route path="/create-incident" element={<ProtectedRoute><CreateIncident /></ProtectedRoute>}/>
        <Route path="/user-incidents" element={<ProtectedRoute><GetAllIncidentUser/></ProtectedRoute>}/>
        <Route path="/officer-dashboard" element={<ProtectedRoute><OfficerDashBoard /></ProtectedRoute>}/>

        {/* Stationhead */}
        <Route path="/station-head-dashboard" element={<ProtectedRoute><StationHeadDashBoard /></ProtectedRoute>}/>
        <Route path="/stationhead/users" element={<ProtectedRoute><UsersManagement/></ProtectedRoute>}/>
        <Route path="/stationhead/officers" element={<ProtectedRoute><OfficerManagement/></ProtectedRoute>}/>
        <Route path="/stationhead/create-officer" element={<ProtectedRoute><CreateOfficer/></ProtectedRoute>}/>
        <Route path="/stationhead/incidents" element={<ProtectedRoute><IncidentsManagement/></ProtectedRoute>}/>

        {/* Officer */}
        <Route path="/officer/officer-assignments" element={<ProtectedRoute><OfficerIncidents/></ProtectedRoute>}/>
        
        


      </Routes>
    </BrowserRouter>
  );
}

export default App;