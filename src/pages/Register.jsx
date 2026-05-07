import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    dob: "",
    phoneNumber: "",
    aadhaarNumber: "",
    panNumber: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);
    try {
      await API.post("/Auth/Register", form);
      alert("Registration successful! You can now login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="register-page">
      <div className="register-card">
        <div className="reg-logo-section">
          <span className="reg-icon">🛡️</span>
          <h2 className="reg-title">MEIKAAPPU</h2>
        </div>
        <p className="reg-subtitle">Create a secure law enforcement account</p>

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" placeholder="John Doe" onChange={handleChange} value={form.name} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email" placeholder="email@agency.gov" onChange={handleChange} value={form.email} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" onChange={handleChange} value={form.password} required />
            </div>
          </div>

          <div className="form-group">
            <label>Residential Address</label>
            <textarea name="address" placeholder="Enter full address" onChange={handleChange} value={form.address} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input name="dob" type="date" onChange={handleChange} value={form.dob} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input name="phoneNumber" placeholder="+91 XXXXX XXXXX" onChange={handleChange} value={form.phoneNumber} required />
            </div>
          </div>

          <div className="verification-section">
            <h4>Verification Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Aadhaar Number</label>
                <input name="aadhaarNumber" placeholder="1234 5678 9012" onChange={handleChange} value={form.aadhaarNumber} required />
              </div>
              <div className="form-group">
                <label>PAN Number</label>
                <input name="panNumber" placeholder="ABCDE1234F" onChange={handleChange} value={form.panNumber} required />
              </div>
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Processing..." : "Create Account"}
          </button>
        </form>

        <p className="login-redirect">
          Already have an account? <Link to="/login" className="link">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;