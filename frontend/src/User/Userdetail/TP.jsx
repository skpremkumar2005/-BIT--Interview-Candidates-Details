import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import "./TP.css"; // Import CSS file

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [intern, setIntern] = useState(null);
  const [updatedIntern, setUpdatedIntern] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/admin/t&p/${id}`)
      .then((res) => {
        setIntern(res.data);
        setUpdatedIntern(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching intern details:", err);
        setMessage("Error fetching intern details.");
        setIsLoading(false);
      });
  }, [id]);

  const handleInputChange = (e, section, field, index = null) => {
    const { value } = e.target;

    if (index !== null) {
      setUpdatedIntern((prev) => {
        const updatedArray = [...prev[section][field]];
        updatedArray[index] = value;
        return { ...prev, [section]: { ...prev[section], [field]: updatedArray } };
      });
    } else {
      setUpdatedIntern((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    }
  };

  const handleUpdateIntern = () => {
    axios
      .put(`http://localhost:3000/admin/t&p/${id}`, updatedIntern)
      .then((res) => {
        setIntern(res.data);
        setMessage("Intern details updated successfully!");
        setTimeout(() => setMessage(""), 2000);
      })
      .catch((err) => {
        console.error("Error updating intern:", err);
        setMessage("Failed to update intern.");
      });
  };

  const handleDeleteIntern = () => {
    if (window.confirm("Are you sure you want to delete this intern?")) {
      axios
        .delete(`http://localhost:3000/admin/t&p/${id}`)
        .then(() => {
          setMessage("Intern deleted successfully!");
          setTimeout(() => navigate("/admin/tp"), 1000);
        })
        .catch((err) => {
          console.error("Error deleting intern:", err);
          setMessage("Failed to delete intern.");
        });
    }
  };

  if (isLoading) {
    return <p className="loading-text">Loading intern details...</p>;
  }

  // Data for Pie Chart (Skill Distribution)
  const skillData = updatedIntern.skills_preferences.technical_skills.map((skill, index) => ({
    name: skill,
    value: Math.floor(Math.random() * 100) + 10, // Random value for demo
  }));

  // Data for Bar Chart (CGPA Comparison)
  const cgpaData = [
    { name: "Your CGPA", cgpa: updatedIntern.educational_details.cgpa },
    { name: "Class Avg", cgpa: 7.8 }, // Example class average
  ];

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Interns Portal</h2>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/domains">Domains</a></li>
          <li><a href="/">Logout</a></li>
        </ul>
      </div>

      <div className="main-content">
        <h2 className="header">Intern Details & Dashboard</h2>
        {intern ? (
          <div className="intern-detail-container">
            <h3>Personal Details</h3>
            <label>Full Name:</label>
            <input 
              type="text" 
              value={updatedIntern.personal_details.full_name} 
              onChange={(e) => handleInputChange(e, "personal_details", "full_name")} 
            />

            <label>Date of Birth:</label>
            <input 
              type="date" 
              value={updatedIntern.personal_details.dob ? updatedIntern.personal_details.dob.split("T")[0] : ""} 
              onChange={(e) => handleInputChange(e, "personal_details", "dob")} 
            />

            <label>Gender:</label>
            <select value={updatedIntern.personal_details.gender} onChange={(e) => handleInputChange(e, "personal_details", "gender")}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <label>Contact Number:</label>
            <input 
              type="text" 
              value={updatedIntern.personal_details.contact_number} 
              onChange={(e) => handleInputChange(e, "personal_details", "contact_number")} 
            />

            <h3>Internship Details</h3>
            <label>Start Date:</label>
            <input 
              type="date" 
              value={updatedIntern.internship_details.start_date ? updatedIntern.internship_details.start_date.split("T")[0] : ""} 
              onChange={(e) => handleInputChange(e, "internship_details", "start_date")} 
            />

            <label>Mode:</label>
            <select value={updatedIntern.internship_details.mode} onChange={(e) => handleInputChange(e, "internship_details", "mode")}>
              <option>Onsite</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>

            <label>Technical Skills:</label>
            {updatedIntern.skills_preferences.technical_skills.map((skill, index) => (
              <input 
                key={index} 
                type="text" 
                value={skill} 
                onChange={(e) => handleInputChange(e, "skills_preferences", "technical_skills", index)} 
              />
            ))}

            <h3>Dashboard</h3>

            {/* Skill Distribution Pie Chart */}
            <div className="chart-container">
              <h4>Technical Skills Distribution</h4>
              <PieChart width={300} height={300}>
                <Pie
                  data={skillData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            {/* CGPA Bar Chart */}
            <div className="chart-container">
              <h4>CGPA Comparison</h4>
              <BarChart width={400} height={250} data={cgpaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cgpa" fill="#82ca9d" />
              </BarChart>
            </div>

            <div className="button-group">
              {/* <button className="update-btn" onClick={handleUpdateIntern}>Update</button>
              <button className="delete-btn" onClick={handleDeleteIntern}>Delete</button> */}
            </div>

            {message && <p className="status-message">{message}</p>}
          </div>
        ) : (
          <p className="not-found">Intern not found</p>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
