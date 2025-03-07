import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intern, setIntern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchInternDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/admin/interns/${id}`);
        setIntern(response.data);
        setFormData(response.data); // Initialize form data for editing
      } catch (error) {
        console.error("Error fetching intern details:", error);
        setIntern(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInternDetails();
  }, [id]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      personal_details: {
        ...prevData.personal_details,
        [name]: value,
      },
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/admin/interns/${id}`, formData);
      setIntern(response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating intern:", error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this intern?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/admin/interns/${id}`);
      alert("Intern deleted successfully.");
      navigate("/list"); // Redirect to list after deletion
    } catch (error) {
      console.error("Error deleting intern:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!intern) return <p>Intern not found.</p>;

  return (
    <div className="details-container">
      <h2>Intern Details</h2>

      {editMode ? (
        <>
          <label>Full Name:</label>
          <input type="text" name="full_name" value={formData.personal_details.full_name} onChange={handleChange} />

          <label>Email:</label>
          <input type="email" name="email" value={formData.personal_details.email} onChange={handleChange} />

          <label>Contact:</label>
          <input type="text" name="contact_number" value={formData.personal_details.contact_number} onChange={handleChange} />

          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Full Name:</strong> {intern.personal_details.full_name}</p>
          <p><strong>Email:</strong> {intern.personal_details.email}</p>
          <p><strong>Contact:</strong> {intern.personal_details.contact_number}</p>
          <p><strong>Domain:</strong> {intern.skills_preferences.preferred_domain}</p>
          <p><strong>Institution:</strong> {intern.educational_details.institution_name}</p>
          <p><strong>Degree:</strong> {intern.educational_details.degree} ({intern.educational_details.branch})</p>
          <p><strong>Internship Start:</strong> {new Date(intern.internship_details.start_date).toDateString()}</p>
          <p><strong>Internship End:</strong> {new Date(intern.internship_details.end_date).toDateString()}</p>
          
          <button onClick={handleEditClick}>Edit</button>
          <button onClick={handleDelete} style={{ color: "red" }}>Delete</button>
        </>
      )}
    </div>
  );
};

export default Details;
