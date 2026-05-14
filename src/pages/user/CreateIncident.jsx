import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
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

  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const incidentTypes = [
    "Lost property",
    "Petit larceny",
    "Criminal mischief",
    "Graffiti"
  ];

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "title":
        if (!value.trim()) {
          error = "Incident title is required";
        } else if (value.trim().length < 5) {
          error = "Title must be at least 5 characters";
        } else if (value.trim().length > 100) {
          error = "Title cannot exceed 100 characters";
        }
        break;

      case "description":
        if (!value.trim()) {
          error = "Description is required";
        } else if (value.trim().length < 20) {
          error = "Description must contain at least 20 characters";
        } else if (value.trim().length > 1000) {
          error = "Description cannot exceed 1000 characters";
        }
        break;

      case "incidentType":
        if (!value) {
          error = "Please select an incident category";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    let newErrors = {};

    Object.keys(form).forEach((field) => {
      if (field !== "officerId") {
        const error = validateField(field, form[field]);

        if (error) {
          newErrors[field] = error;
        }
      }
    });

    if (form.incidentType === "Graffiti" && !image) {
      newErrors.image = "Evidence image is mandatory for Graffiti reports";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: validateField(name, value)
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large (Max 5MB)");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));

    setErrors({
      ...errors,
      image: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("Title", form.title.trim());
      formData.append("Description", form.description.trim());
      formData.append("IncidentType", form.incidentType);

      if (form.officerId) {
        formData.append("OfficerId", form.officerId);
      }

      if (image) {
        formData.append("image", image);
      }

      await API.post("/Incident/CreateIncident", formData);

      toast.success("Incident filed successfully");

      setTimeout(() => {
        navigate("/user-dashboard");
      }, 2000);

    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((msg) =>
          toast.error(msg[0])
        );
      } else {
        toast.error(
          err.response?.data?.message ||
          "Failed to submit incident"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const role = getRole();

  if (role !== "User") {
    alert("Access denied");
    return <Navigate to="/login" />;
  }

  return (
    <div className="create-incident-page">

      <button
        className="screen-back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
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
              placeholder="Brief summary"
              value={form.title}
              onChange={handleChange}
            />

            {errors.title && (
              <span className="error-text">
                {errors.title}
              </span>
            )}
          </div>

          <div className="input-group">
            <label>Incident Category</label>

            <select
              name="incidentType"
              value={form.incidentType}
              onChange={handleChange}
            >
              <option value="">-- Select Category --</option>

              {incidentTypes.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {errors.incidentType && (
              <span className="error-text">
                {errors.incidentType}
              </span>
            )}
          </div>

          <div className="input-group">
            <label>Detailed Description</label>

            <textarea
              name="description"
              placeholder="Provide detailed incident information..."
              value={form.description}
              onChange={handleChange}
            />

            <div className="character-count">
              {form.description.length}/1000
            </div>

            {errors.description && (
              <span className="error-text">
                {errors.description}
              </span>
            )}
          </div>

          <div className="evidence-section">

            <label>
              Evidence Upload
              {form.incidentType === "Graffiti" && (
                <span className="required">*</span>
              )}
            </label>

            <div className={`file-drop-zone ${image ? "has-file" : ""}`}>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="file-upload"
              />

              <label htmlFor="file-upload" className="file-label">

                {preview ? (
                  <img
                    src={preview}
                    alt="Evidence preview"
                    className="image-preview"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <span>📷</span>
                    <p>Click to upload evidence image</p>
                  </div>
                )}

              </label>
            </div>

            {image && (
              <p className="file-name">
                Selected: {image.name}
              </p>
            )}

            {errors.image && (
              <span className="error-text">
                {errors.image}
              </span>
            )}

          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading
              ? "Submitting Report..."
              : "Submit Incident"}
          </button>

        </form>
      </div>

      <ToastContainer position="bottom-right" />

    </div>
  );
}

export default CreateIncident;