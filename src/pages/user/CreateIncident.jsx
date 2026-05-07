import React, { useState, useEffect ,Navigate} from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateIncident.css";
import { getRole } from "../../utils/auth";

function CreateIncident() {
  const navigate = useNavigate();

  
  const [form, setForm] = useState({
    title: "",
    description: "",
    incidentType: "",
    officerId: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const incidentTypes = [
    "Lost property",
    "Petit larceny",
    "Criminal mischief",
    "Graffiti"
  ];

  // Cleanup preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB Limit
        toast.error("File size too large (Max 5MB)");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title || !form.description || !form.incidentType) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (form.incidentType === "Graffiti" && !image) {
      toast.error("Evidence image is mandatory for Graffiti reports");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Title", form.title);
      formData.append("Description", form.description);
      formData.append("IncidentType", form.incidentType);
      
      if (form.officerId) formData.append("OfficerId", form.officerId);
      if (image) formData.append("image", image);

      await API.post("/Incident/CreateIncident", formData);

      toast.success("Incident filed successfully");
      setTimeout(() => navigate("/user-dashboard"), 8000);

    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((msg) => toast.error(msg[0]));
      } else {
        toast.error(err.response?.data?.message || "Failed to submit incident");
      }
    } finally {
      setLoading(false);
    }
  };

  const role=getRole()
  if(role!=="User"){
    alert("Access denied")
    return <Navigate to="/login" />;
  }


  return (
    <div className="create-incident-page">
        
        <button className="screen-back-btn" onClick={() => navigate(-1)}>
            <span className="arrow">←</span> Back
        </button>
      <div className="create-card">
        <div className="form-header">
          <h2>File New Incident</h2>
        </div>

        <form onSubmit={handleSubmit} className="incident-form">
          <div className="input-group">
            <label>Incident Title</label>
            <input
              type="text"
              name="title"
              placeholder="Brief summary (e.g. Vandalism at Sector 4)"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Incident Category</label>
            <select
              name="incidentType"
              value={form.incidentType}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {incidentTypes.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Detailed Description</label>
            <textarea
              name="description"
              placeholder="Provide as much detail as possible..."
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="evidence-section">
            <label>Evidence Upload {form.incidentType === "Graffiti" && <span className="required">*</span>}</label>
            <div className={`file-drop-zone ${image ? 'has-file' : ''}`}>
              <input type="file" accept="image/*" onChange={handleFileChange} id="file-upload" />
              <label htmlFor="file-upload" className="file-label">
                {preview ? (
                  <img src={preview} alt="Evidence preview" className="image-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <span>📷</span>
                    <p>Click to upload incident photo</p>
                  </div>
                )}
              </label>
            </div>
            {image && <p className="file-name">Selected: {image.name}</p>}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting Report..." : "Submit Incident"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateIncident;