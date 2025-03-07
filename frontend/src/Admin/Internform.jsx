import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const InternForm = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    personal_details: {
      full_name: "",
      email: "",
      phone: "",
      gender: "Male",
      date_of_birth: "",
      address: {
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: ""
      }
    },
    educational_details: {
      institution_name: "",
      degree: "",
      field_of_study: "",
      year_of_study: 1,
      start_date: "",
      end_date: "",
      gpa: ""
    },
    skills_preferences: {
      technical_skills: [],
      soft_skills: [],
      interests: [],
      career_goals: ""
    },
    internship_details: {
      mode: "Remote",
      work_timings: "Full-time",
      start_date: "",
      end_date: "",
      duration_months: 3,
      stipend: {
        amount: 0,
        currency: "USD"
      },
      expectations: ""
    },
    Domain: ""
  });

  // Fetch domains on component mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/domain");
        setDomains(response.data);
      } catch (error) {
        console.error("Error fetching domains:", error);
      }
    };

    fetchDomains();
  }, []);

  const handleInputChange = (section, field, value) => {
    if (section === "root") {
      setFormData({
        ...formData,
        [field]: value
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      });
    }
  };

  const handleNestedInputChange = (section, parent, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [parent]: {
          ...formData[section][parent],
          [field]: value
        }
      }
    });
  };

  const handleArrayInputChange = (section, field, value) => {
    // Split comma-separated values into an array
    const valuesArray = value.split(',').map(item => item.trim());
    
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: valuesArray
      }
    });
  };

  const calculateDuration = () => {
    const startDate = new Date(formData.internship_details.start_date);
    const endDate = new Date(formData.internship_details.end_date);
    
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                         (endDate.getMonth() - startDate.getMonth());
      
      handleInputChange("internship_details", "duration_months", Math.max(1, diffMonths));
    }
  };

  useEffect(() => {
    if (formData.internship_details.start_date && formData.internship_details.end_date) {
      calculateDuration();
    }
  }, [formData.internship_details.start_date, formData.internship_details.end_date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");
    
    try {
      await axios.post("http://localhost:3000/admin/interns", formData);
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(error.response?.data?.message || "Failed to add intern. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="form-success">
        <div className="success-icon">✓</div>
        <h2>Intern Added Successfully!</h2>
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Add New Intern</h1>
        <p>Fill in the details below to add a new intern to the system</p>
      </div>

      {submitError && (
        <div className="error-message">
          <span>Error:</span> {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Domain Selection */}
        <div className="form-section">
          <h2>Domain</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="domain">Domain*</label>
              <select
                id="domain"
                required
                value={formData.Domain}
                onChange={(e) => handleInputChange("root", "Domain", e.target.value)}
              >
                <option value="">Select Domain</option>
                {domains.map((domain) => (
                  <option key={domain._id} value={domain.name}>
                    {domain.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="form-section">
          <h2>Personal Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="full_name">Full Name*</label>
              <input
                type="text"
                id="full_name"
                required
                value={formData.personal_details.full_name}
                onChange={(e) => handleInputChange("personal_details", "full_name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                required
                value={formData.personal_details.email}
                onChange={(e) => handleInputChange("personal_details", "email", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={formData.personal_details.phone}
                onChange={(e) => handleInputChange("personal_details", "phone", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={formData.personal_details.gender}
                onChange={(e) => handleInputChange("personal_details", "gender", e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date_of_birth">Date of Birth</label>
              <input
                type="date"
                id="date_of_birth"
                value={formData.personal_details.date_of_birth}
                onChange={(e) => handleInputChange("personal_details", "date_of_birth", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                value={formData.personal_details.address.street}
                onChange={(e) => handleNestedInputChange("personal_details", "address", "street", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={formData.personal_details.address.city}
                onChange={(e) => handleNestedInputChange("personal_details", "address", "city", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State/Province</label>
              <input
                type="text"
                id="state"
                value={formData.personal_details.address.state}
                onChange={(e) => handleNestedInputChange("personal_details", "address", "state", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postal_code">Postal Code</label>
              <input
                type="text"
                id="postal_code"
                value={formData.personal_details.address.postal_code}
                onChange={(e) => handleNestedInputChange("personal_details", "address", "postal_code", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                value={formData.personal_details.address.country}
                onChange={(e) => handleNestedInputChange("personal_details", "address", "country", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Educational Details */}
        <div className="form-section">
          <h2>Educational Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="institution_name">Institution Name*</label>
              <input
                type="text"
                id="institution_name"
                required
                value={formData.educational_details.institution_name}
                onChange={(e) => handleInputChange("educational_details", "institution_name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="degree">Degree*</label>
              <input
                type="text"
                id="degree"
                required
                value={formData.educational_details.degree}
                onChange={(e) => handleInputChange("educational_details", "degree", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="field_of_study">Field of Study*</label>
              <input
                type="text"
                id="field_of_study"
                required
                value={formData.educational_details.field_of_study}
                onChange={(e) => handleInputChange("educational_details", "field_of_study", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="year_of_study">Year of Study*</label>
              <select
                id="year_of_study"
                required
                value={formData.educational_details.year_of_study}
                onChange={(e) => handleInputChange("educational_details", "year_of_study", parseInt(e.target.value))}
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
                <option value={5}>5th Year</option>
                <option value={6}>Graduated</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date_edu">Start Date</label>
              <input
                type="date"
                id="start_date_edu"
                value={formData.educational_details.start_date}
                onChange={(e) => handleInputChange("educational_details", "start_date", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="end_date_edu">End Date</label>
              <input
                type="date"
                id="end_date_edu"
                value={formData.educational_details.end_date}
                onChange={(e) => handleInputChange("educational_details", "end_date", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gpa">GPA / Grade</label>
              <input
                type="text"
                id="gpa"
                value={formData.educational_details.gpa}
                onChange={(e) => handleInputChange("educational_details", "gpa", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Skills & Preferences */}
        <div className="form-section">
          <h2>Skills & Preferences</h2>
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="technical_skills">Technical Skills* (comma-separated)</label>
              <input
                type="text"
                id="technical_skills"
                required
                placeholder="e.g. JavaScript, React, Node.js"
                value={formData.skills_preferences.technical_skills.join(', ')}
                onChange={(e) => handleArrayInputChange("skills_preferences", "technical_skills", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="soft_skills">Soft Skills (comma-separated)</label>
              <input
                type="text"
                id="soft_skills"
                placeholder="e.g. Communication, Teamwork, Leadership"
                value={formData.skills_preferences.soft_skills.join(', ')}
                onChange={(e) => handleArrayInputChange("skills_preferences", "soft_skills", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="interests">Interests (comma-separated)</label>
              <input
                type="text"
                id="interests"
                placeholder="e.g. Web Development, Machine Learning, UI/UX"
                value={formData.skills_preferences.interests.join(', ')}
                onChange={(e) => handleArrayInputChange("skills_preferences", "interests", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="career_goals">Career Goals</label>
              <textarea
                id="career_goals"
                rows="3"
                value={formData.skills_preferences.career_goals}
                onChange={(e) => handleInputChange("skills_preferences", "career_goals", e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Internship Details */}
        <div className="form-section">
          <h2>Internship Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mode">Work Mode*</label>
              <select
                id="mode"
                required
                value={formData.internship_details.mode}
                onChange={(e) => handleInputChange("internship_details", "mode", e.target.value)}
              >
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="work_timings">Work Timings*</label>
              <select
                id="work_timings"
                required
                value={formData.internship_details.work_timings}
                onChange={(e) => handleInputChange("internship_details", "work_timings", e.target.value)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date_int">Start Date*</label>
              <input
                type="date"
                id="start_date_int"
                required
                value={formData.internship_details.start_date}
                onChange={(e) => handleInputChange("internship_details", "start_date", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="end_date_int">End Date*</label>
              <input
                type="date"
                id="end_date_int"
                required
                value={formData.internship_details.end_date}
                onChange={(e) => handleInputChange("internship_details", "end_date", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration_months">Duration (months)</label>
              <input
                type="number"
                id="duration_months"
                min="1"
                value={formData.internship_details.duration_months}
                onChange={(e) => handleInputChange("internship_details", "duration_months", parseInt(e.target.value))}
                readOnly
              />
              <small>Automatically calculated based on start and end dates</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stipend_amount">Stipend Amount</label>
              <input
                type="number"
                id="stipend_amount"
                min="0"
                value={formData.internship_details.stipend.amount}
                onChange={(e) => handleNestedInputChange("internship_details", "stipend", "amount", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="stipend_currency">Currency</label>
              <select
                id="stipend_currency"
                value={formData.internship_details.stipend.currency}
                onChange={(e) => handleNestedInputChange("internship_details", "stipend", "currency", e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="expectations">Expectations</label>
              <textarea
                id="expectations"
                rows="3"
                placeholder="Expectations from the internship..."
                value={formData.internship_details.expectations}
                onChange={(e) => handleInputChange("internship_details", "expectations", e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={() => navigate("/internDashBoard")}>
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Saving..." : "Add Intern"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InternForm;