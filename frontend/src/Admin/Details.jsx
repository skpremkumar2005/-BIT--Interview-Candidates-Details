import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import './InternDetails.css';

const InternDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intern, setIntern] = useState();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchInternDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/admin/interns/${id}`);
        setIntern(response.data);
        setFormData(response.data);
        
      } catch (error) {
        console.error("Error fetching intern details:", error);
        setIntern(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInternDetails();
  }, [id]);

  const calculateProgress = () => {
    if (!intern) return 0;
    
    const startDate = new Date(intern.internship_details.start_date);
    const endDate = new Date(intern.internship_details.end_date);
    const currentDate = new Date();
    
    if (currentDate < startDate) return 0;
    if (currentDate > endDate) return 100;
    
    const totalDuration = endDate - startDate;
    const elapsedDuration = currentDate - startDate;
    return Math.round((elapsedDuration / totalDuration) * 100);
  };

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  const handleNestedChange = (e, section, subsection, index = null) => {
    const { name, value } = e.target;
    
    if (index !== null) {
      setFormData((prevData) => {
        const newSection = { ...prevData[section] };
        newSection[subsection][index] = {
          ...newSection[subsection][index],
          [name]: value
        };
        return { ...prevData, [section]: newSection };
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [subsection]: {
            ...prevData[section][subsection],
            [name]: value
          }
        }
      }));
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/admin/interns/${id}`, formData);
      setIntern(response.data);
      setEditMode(false);
      console.log(response.data);
      alert("Intern information updated successfully!");
      navigate('/admin');

    } catch (error) {
      console.error("Error updating intern:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        alert(`Failed to update intern information: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request data:", error.request);
        alert("Failed to update intern information: No response from server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        alert("Failed to update intern information: " + error.message);
      }
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this intern? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/admin/interns/${id}`);
      alert("Intern deleted successfully.");
      navigate("/list");
    } catch (error) {
      console.error("Error deleting intern:", error);
      alert("Failed to delete intern.");
    }
  };

  const prepareDataForTimeline = () => {
    if (!intern) return [];
    
    const startDate = new Date(intern.internship_details.start_date);
    const endDate = new Date(intern.internship_details.end_date);
    const today = new Date();
    
    return [
      { name: 'Start', date: startDate.toLocaleDateString() },
      { name: 'Current', date: today.toLocaleDateString() },
      { name: 'End', date: endDate.toLocaleDateString() },
    ];
  };

  const prepareSkillsData = () => {
    if (!intern) return [];
    
    return intern.skills_preferences.technical_skills.map(skill => ({
      name: skill,
      value: Math.floor(Math.random() * 50) + 50
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading intern details...</p>
    </div>
  );
  
  if (!intern) return (
    <div className="error-container">
      <h2>Intern not found</h2>
      <p>The requested intern data could not be found.</p>
      <button onClick={() => navigate("/admin")}>Back to List</button>
    </div>
  );

  return (
    <div className="intern-details-container">
      {/* Action Buttons */}
      <div className="action-buttons">
        {!editMode ? (
          <button className="edit-btn" onClick={handleEditClick}>Edit</button>
        ) : (
          <button className="save-btn" onClick={handleUpdate}>Save</button>
        )}
        <button className="delete-btn" onClick={handleDelete}>Delete</button>
      </div>

      <div className="content-container">
        <div className="sidebar">
          <ul className="nav-tabs">
            <li 
              className={activeTab === "personal" ? "active" : ""} 
              onClick={() => setActiveTab("personal")}
            >
              Personal Details
            </li>
            <li 
              className={activeTab === "education" ? "active" : ""} 
              onClick={() => setActiveTab("education")}
            >
              Education
            </li>
            <li 
              className={activeTab === "internship" ? "active" : ""} 
              onClick={() => setActiveTab("internship")}
            >
              Internship
            </li>
            <li 
              className={activeTab === "skills" ? "active" : ""} 
              onClick={() => setActiveTab("skills")}
            >
              Skills & Experience
            </li>
            <li 
              className={activeTab === "documents" ? "active" : ""} 
              onClick={() => setActiveTab("documents")}
            >
              Documents
            </li>
            <li 
              className={activeTab === "banking" ? "active" : ""} 
              onClick={() => setActiveTab("banking")}
            >
              Banking
            </li>
            <li 
              className={activeTab === "emergency" ? "active" : ""} 
              onClick={() => setActiveTab("emergency")}
            >
              Emergency Contact
            </li>
            <li 
              className={activeTab === "additional" ? "active" : ""} 
              onClick={() => setActiveTab("additional")}
            >
              Additional Info
            </li>
          </ul>
        </div>

        <div className="main-content">
          {/* Personal Details Section */}
          {activeTab === "personal" && (
            <div className="detail-section">
              <h2>Personal Details</h2>
              <div className="details-grid">
                {editMode ? (
                  <>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        name="full_name" 
                        value={formData.personal_details.full_name} 
                        onChange={(e) => handleChange(e, "personal_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input 
                        type="date" 
                        name="dob" 
                        value={formData.personal_details.dob ? new Date(formData.personal_details.dob).toISOString().split('T')[0] : ''} 
                        onChange={(e) => handleChange(e, "personal_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select 
                        name="gender" 
                        value={formData.personal_details.gender} 
                        onChange={(e) => handleChange(e, "personal_details")}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Contact Number</label>
                      <input 
                        type="text" 
                        name="contact_number" 
                        value={formData.personal_details.contact_number} 
                        onChange={(e) => handleChange(e, "personal_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.personal_details.email} 
                        onChange={(e) => handleChange(e, "personal_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Permanent Address</label>
                      <textarea 
                        name="permanent_address" 
                        value={formData.personal_details.permanent_address} 
                        onChange={(e) => handleChange(e, "personal_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Current Address</label>
                      <textarea 
                        name="current_address" 
                        value={formData.personal_details.current_address} 
                        onChange={(e) => handleChange(e, "personal_details")} 
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-item">
                      <div className="detail-label">Full Name</div>
                      <div className="detail-value">{intern.personal_details.full_name}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Date of Birth</div>
                      <div className="detail-value">{new Date(intern.personal_details.dob).toLocaleDateString()}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Gender</div>
                      <div className="detail-value">{intern.personal_details.gender}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Contact Number</div>
                      <div className="detail-value">{intern.personal_details.contact_number}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Email</div>
                      <div className="detail-value">{intern.personal_details.email}</div>
                    </div>
                    <div className="detail-item full-width">
                      <div className="detail-label">Permanent Address</div>
                      <div className="detail-value">{intern.personal_details.permanent_address}</div>
                    </div>
                    <div className="detail-item full-width">
                      <div className="detail-label">Current Address</div>
                      <div className="detail-value">{intern.personal_details.current_address}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Education Section */}
          {activeTab === "education" && (
            <div className="detail-section">
              <h2>Educational Details</h2>
              <div className="details-grid">
                {editMode ? (
                  <>
                    <div className="form-group">
                      <label>Institution Name</label>
                      <input 
                        type="text" 
                        name="institution_name" 
                        value={formData.educational_details.institution_name} 
                        onChange={(e) => handleChange(e, "educational_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Degree</label>
                      <input 
                        type="text" 
                        name="degree" 
                        value={formData.educational_details.degree} 
                        onChange={(e) => handleChange(e, "educational_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Branch</label>
                      <input 
                        type="text" 
                        name="branch" 
                        value={formData.educational_details.branch} 
                        onChange={(e) => handleChange(e, "educational_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Year of Study</label>
                      <input 
                        type="number" 
                        name="year_of_study" 
                        value={formData.educational_details.year_of_study} 
                        onChange={(e) => handleChange(e, "educational_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>CGPA</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="cgpa" 
                        value={formData.educational_details.cgpa} 
                        onChange={(e) => handleChange(e, "educational_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Expected Graduation Year</label>
                      <input 
                        type="number" 
                        name="expected_graduation_year" 
                        value={formData.educational_details.expected_graduation_year} 
                        onChange={(e) => handleChange(e, "educational_details")} 
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-item">
                      <div className="detail-label">Institution Name</div>
                      <div className="detail-value">{intern.educational_details.institution_name}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Degree</div>
                      <div className="detail-value">{intern.educational_details.degree}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Branch</div>
                      <div className="detail-value">{intern.educational_details.branch}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Year of Study</div>
                      <div className="detail-value">{intern.educational_details.year_of_study}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">CGPA</div>
                      <div className="detail-value">{intern.educational_details.cgpa}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Expected Graduation</div>
                      <div className="detail-value">{intern.educational_details.expected_graduation_year}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Internship Section */}
          {activeTab === "internship" && (
            <div className="detail-section">
              <h2>Internship Details</h2>
              {!editMode && (
                <div className="chart-container">
                  <h3>Internship Timeline</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={prepareDataForTimeline()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis hide />
                      <Tooltip />
                      <Line type="monotone" dataKey="date" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="details-grid">
                {editMode ? (
                  <>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input 
                        type="date" 
                        name="start_date" 
                        value={formData.internship_details.start_date ? new Date(formData.internship_details.start_date).toISOString().split('T')[0] : ''} 
                        onChange={(e) => handleChange(e, "internship_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input 
                        type="date" 
                        name="end_date" 
                        value={formData.internship_details.end_date ? new Date(formData.internship_details.end_date).toISOString().split('T')[0] : ''} 
                        onChange={(e) => handleChange(e, "internship_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration (months)</label>
                      <input 
                        type="number" 
                        name="duration_months" 
                        value={formData.internship_details.duration_months} 
                        onChange={(e) => handleChange(e, "internship_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Mode</label>
                      <select 
                        name="mode" 
                        value={formData.internship_details.mode} 
                        onChange={(e) => handleChange(e, "internship_details")}
                      >
                        <option value="Onsite">Onsite</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Stipend Amount</label>
                      <input 
                        type="number" 
                        name="amount" 
                        value={formData.internship_details.stipend.amount} 
                        onChange={(e) => handleNestedChange(e, "internship_details", "stipend")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Currency</label>
                      <input 
                        type="text" 
                        name="currency" 
                        value={formData.internship_details.stipend.currency} 
                        onChange={(e) => handleNestedChange(e, "internship_details", "stipend")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Work Timings</label>
                      <select 
                        name="work_timings" 
                        value={formData.internship_details.work_timings} 
                        onChange={(e) => handleChange(e, "internship_details")}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Reporting Manager</label>
                      <input 
                        type="text" 
                        name="reporting_manager" 
                        value={formData.internship_details.reporting_manager} 
                        onChange={(e) => handleChange(e, "internship_details")} 
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-item">
                      <div className="detail-label">Start Date</div>
                      <div className="detail-value">{new Date(intern.internship_details.start_date).toLocaleDateString()}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">End Date</div>
                      <div className="detail-value">{new Date(intern.internship_details.end_date).toLocaleDateString()}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Duration</div>
                      <div className="detail-value">{intern.internship_details.duration_months} months</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Mode</div>
                      <div className="detail-value">{intern.internship_details.mode}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Stipend</div>
                      <div className="detail-value">
                        {intern.internship_details.stipend.amount} {intern.internship_details.stipend.currency}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Work Timings</div>
                      <div className="detail-value">{intern.internship_details.work_timings}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Reporting Manager</div>
                      <div className="detail-value">{intern.internship_details.reporting_manager}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {activeTab === "skills" && (
            <div className="detail-section">
              <h2>Skills & Experience</h2>
              {!editMode && (
                <div className="chart-container">
                  <h3>Technical Skills</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={prepareSkillsData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name }) => name}
                      >
                        {prepareSkillsData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="details-grid">
                {editMode ? (
                  <>
                    <div className="form-group full-width">
                      <label>Technical Skills (comma separated)</label>
                      <input 
                        type="text" 
                        name="technical_skills" 
                        value={formData.skills_preferences.technical_skills.join(', ')} 
                        onChange={(e) => {
                          const skills = e.target.value.split(',').map(skill => skill.trim());
                          setFormData(prev => ({
                            ...prev,
                            skills_preferences: {
                              ...prev.skills_preferences,
                              technical_skills: skills
                            }
                          }));
                        }} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Preferred Domain</label>
                      <input 
                        type="text" 
                        name="preferred_domain" 
                        value={formData.skills_preferences.preferred_domain} 
                        onChange={(e) => handleChange(e, "skills_preferences")} 
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Previous Experience</label>
                      {formData.skills_preferences.previous_experience.map((exp, index) => (
                        <div key={index} className="experience-form">
                          <input 
                            type="text" 
                            name="company" 
                            placeholder="Company" 
                            value={exp.company} 
                            onChange={(e) => handleNestedChange(e, "skills_preferences", "previous_experience", index)} 
                          />
                          <input 
                            type="text" 
                            name="role" 
                            placeholder="Role" 
                            value={exp.role} 
                            onChange={(e) => handleNestedChange(e, "skills_preferences", "previous_experience", index)} 
                          />
                          <input 
                            type="number" 
                            name="duration_months" 
                            placeholder="Duration (months)" 
                            value={exp.duration_months} 
                            onChange={(e) => handleNestedChange(e, "skills_preferences", "previous_experience", index)} 
                          />
                        </div>
                      ))}
                      <button className="add-btn" onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          skills_preferences: {
                            ...prev.skills_preferences,
                            previous_experience: [...prev.skills_preferences.previous_experience, {
                              company: "",
                              role: "",
                              duration_months: 0
                            }]
                          }
                        }));
                      }}>Add Experience</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-item full-width">
                      <div className="detail-label">Technical Skills</div>
                      <div className="detail-value skills-tags">
                        {intern.skills_preferences.technical_skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Preferred Domain</div>
                      <div className="detail-value">{intern.skills_preferences.preferred_domain}</div>
                    </div>
                    <div className="detail-item full-width">
                      <div className="detail-label">Previous Experience</div>
                      {intern.skills_preferences.previous_experience.length > 0 ? (
                        <div className="experience-cards">
                          {intern.skills_preferences.previous_experience.map((exp, index) => (
                            <div key={index} className="experience-card">
                              <div className="exp-company">{exp.company}</div>
                              <div className="exp-role">{exp.role}</div>
                              <div className="exp-duration">{exp.duration_months} months</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="detail-value">No previous experience</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Documents Section */}
          {activeTab === "documents" && (
            <div className="detail-section">
              <h2>Identification Documents</h2>
              <div className="details-grid">
  {editMode ? (
    <>
      <div className="form-group">
        <label>Aadhaar Number</label>
        <input 
          type="text" 
          name="aadhaar_number" 
          value={formData.identification_documents.aadhaar_number} 
          onChange={(e) => handleChange(e, "identification_documents")} 
        />
      </div>
      <div className="form-group">
        <label>PAN Number</label>
        <input 
          type="text" 
          name="pan_card" 
          value={formData.identification_documents.pan_card} 
          onChange={(e) => handleChange(e, "identification_documents")} 
        />
      </div>
      <div className="form-group">
        <label>College ID Card</label>
        <input 
          type="text" 
          name="college_id_card" 
          value={formData.identification_documents.college_id_card} 
          onChange={(e) => handleChange(e, "identification_documents")} 
        />
      </div>
      <div className="form-group">
        <label>Resume</label>
        <input 
          type="text" 
          name="resume"  // Corrected name attribute
          value={formData.identification_documents.resume} 
          onChange={(e) => handleChange(e, "identification_documents")} 
        />
      </div>
      <div className="form-group">
        <label>Offer Letter</label>
        <input 
          type="text" 
          name="offer_letter" 
          value={formData.identification_documents.offer_letter} 
          onChange={(e) => handleChange(e, "identification_documents")} 
        />
      </div>
      <div className="form-group">
        <label>Internship Agreement</label>
        <input 
          type="text" 
          name="internship_agreement" 
          value={formData.identification_documents.internship_agreement} 
          onChange={(e) => handleChange(e, "identification_documents")} 
        />
      </div>
    </>
  ) : (
    <>
      <div className="detail-item">
        <div className="detail-label">Aadhaar Number</div>
        <div className="detail-value">{intern.identification_documents.aadhaar_number}</div>
      </div>
      <div className="detail-item">
        <div className="detail-label">PAN Number</div>
        <div className="detail-value">{intern.identification_documents.pan_card}</div>
      </div>
      <div className="detail-item">
        <div className="detail-label">College ID Card</div>
        <div className="detail-value">{intern.identification_documents.college_id_card}</div>
      </div>
      <div className="detail-item">
        <div className="detail-label">Resume</div>
        <div className="detail-value">{intern.identification_documents.resume}</div>
      </div>
      <div className="detail-item">
        <div className="detail-label">Offer Letter</div>
        <div className="detail-value">{intern.identification_documents.offer_letter}</div>
      </div>
      <div className="detail-item">
        <div className="detail-label">Internship Agreement</div>
        <div className="detail-value">{intern.identification_documents.internship_agreement}</div>
      </div>
    </>
  )}
</div>

            </div>
          )}

          {/* Banking Section */}
          {activeTab === "banking" && (
            <div className="detail-section">
              <h2>Banking Details</h2>
              <div className="details-grid">
                {editMode ? (
                  <>
                    <div className="form-group">
                      <label>Bank Account Number</label>
                      <input 
                        type="text" 
                        name="bank_account_number" 
                        value={formData.banking_details.bank_account_number} 
                        onChange={(e) => handleChange(e, "banking_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>IFSC Code</label>
                      <input 
                        type="text" 
                        name="ifsc_code" 
                        value={formData.banking_details.ifsc_code} 
                        onChange={(e) => handleChange(e, "banking_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Bank Name</label>
                      <input 
                        type="text" 
                        name="bank_name" 
                        value={formData.banking_details.bank_name} 
                        onChange={(e) => handleChange(e, "banking_details")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Branch</label>
                      <input 
                        type="text" 
                        name="branch" 
                        value={formData.banking_details.branch} 
                        onChange={(e) => handleChange(e, "banking_details")} 
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-item">
                      <div className="detail-label">Bank Account Number</div>
                      <div className="detail-value">{intern.banking_details.bank_account_number}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">IFSC Code</div>
                      <div className="detail-value">{intern.banking_details.ifsc_code}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Bank Name</div>
                      <div className="detail-value">{intern.banking_details.bank_name}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Branch</div>
                      <div className="detail-value">{intern.banking_details.branch}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Emergency Contact Section */}
          {activeTab === "emergency" && (
            <div className="detail-section">
              <h2>Emergency Contact</h2>
              <div className="details-grid">
                {editMode ? (
                  <>
                    <div className="form-group">
                      <label>Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.emergency_contact.name} 
                        onChange={(e) => handleChange(e, "emergency_contact")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Relationship</label>
                      <input 
                        type="text" 
                        name="relationship" 
                        value={formData.emergency_contact.relationship} 
                        onChange={(e) => handleChange(e, "emergency_contact")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact Number</label>
                      <input 
                        type="text" 
                        name="contact_number" 
                        value={formData.emergency_contact.contact_number} 
                        onChange={(e) => handleChange(e, "emergency_contact")} 
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-item">
                      <div className="detail-label">Name</div>
                      <div className="detail-value">{intern.emergency_contact.name}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Relationship</div>
                      <div className="detail-value">{intern.emergency_contact.relationship}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Contact Number</div>
                      <div className="detail-value">{intern.emergency_contact.contact_number}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Additional Info Section */}
          {activeTab === "additional" && (
            <div className="detail-section">
              <h2>Additional Info</h2>
              <div className="details-grid">
                {editMode ? (
                  <>
                    <div className="form-group">
                      <label>Medical Conditions</label>
                      <input 
                        type="text" 
                        name="medical_conditions" 
                        value={formData.additional_info.medical_conditions} 
                        onChange={(e) => handleChange(e, "additional_info")} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Laptop Availability</label>
                      <select 
                        name="laptop_availability" 
                        value={formData.additional_info.laptop_availability} 
                        onChange={(e) => handleChange(e, "additional_info")}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Background Verification Consent</label>
                      <select 
                        name="background_verification_consent" 
                        value={formData.additional_info.background_verification_consent} 
                        onChange={(e) => handleChange(e, "additional_info")}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-item">
                      <div className="detail-label">Medical Conditions</div>
                      <div className="detail-value">{intern.additional_info.medical_conditions}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Laptop Availability</div>
                      <div className="detail-value">{intern.additional_info.laptop_availability ? "Yes" : "No"}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Background Verification Consent</div>
                      <div className="detail-value">{intern.additional_info.background_verification_consent ? "Yes" : "No"}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternDetails;