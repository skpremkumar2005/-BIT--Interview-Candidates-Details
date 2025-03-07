import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TP.css";

const TP = () => {
  const [data, setData] = useState([]);
  const [newIntern, setNewIntern] = useState({
    full_name: "",
    email: "",
    dob: "",
    gender: "Male",
    contact_number: "",
    permanent_address: "",
    current_address: "",
    institution_name: "",
    degree: "",
    branch: "",
    year_of_study: "",
    cgpa: "",
    expected_graduation_year: "",
    start_date: "",
    end_date: "",
    duration_months: "",
    mode: "Onsite",
    stipend_amount: "",
    work_timings: "",
    reporting_manager: "",
    preferred_domain: "",
    technical_skills: "",
    aadhaar_number: "",
    pan_card: "",
    college_id_card: "",
    resume_link: "",
    bank_account_number: "",
    ifsc_code: "",
    bank_name: "",
    emergency_name: "",
    relationship: "",
    emergency_contact_number: "",
    medical_conditions: "",
    laptop_availability: false,
    background_verification_consent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:3000/admin/t&p", { timeout: 10000 })
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setIsLoading(false);
        setErrorMessage("Error fetching data.");
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewIntern({ ...newIntern, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddIntern = () => {
    if (!newIntern.full_name || !newIntern.email || !newIntern.resume_link) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    axios
      .post("http://localhost:3000/admin/t&p", {
        personal_details: {
          full_name: newIntern.full_name,
          email: newIntern.email,
          dob: newIntern.dob,
          gender: newIntern.gender,
          contact_number: newIntern.contact_number,
          permanent_address: newIntern.permanent_address,
          current_address: newIntern.current_address,
        },
        educational_details: {
          institution_name: newIntern.institution_name,
          degree: newIntern.degree,
          branch: newIntern.branch,
          year_of_study: newIntern.year_of_study,
          cgpa: newIntern.cgpa,
          expected_graduation_year: newIntern.expected_graduation_year,
        },
        internship_details: {
          start_date: newIntern.start_date,
          end_date: newIntern.end_date,
          duration_months: newIntern.duration_months,
          mode: newIntern.mode,
          stipend_amount: newIntern.stipend_amount,
          work_timings: newIntern.work_timings,
          reporting_manager: newIntern.reporting_manager,
        },
        skills_preferences: {
          preferred_domain: newIntern.preferred_domain,
          technical_skills: newIntern.technical_skills.split(","),
        },
        identification_documents: {
          aadhaar_number: newIntern.aadhaar_number,
          pan_card: newIntern.pan_card,
          college_id_card: newIntern.college_id_card,
          resume: newIntern.resume_link,
        },
        banking_details: {
          bank_account_number: newIntern.bank_account_number,
          ifsc_code: newIntern.ifsc_code,
          bank_name: newIntern.bank_name,
        },
        emergency_contact: {
          name: newIntern.emergency_name,
          relationship: newIntern.relationship,
          contact_number: newIntern.emergency_contact_number,
        },
        additional_info: {
          medical_conditions: newIntern.medical_conditions,
          laptop_availability: newIntern.laptop_availability,
          background_verification_consent: newIntern.background_verification_consent,
        },
      })
      .then((res) => {
        setData(res.data);
        setNewIntern({
          full_name: "",
          email: "",
          dob: "",
          gender: "Male",
          contact_number: "",
          permanent_address: "",
          current_address: "",
          institution_name: "",
          degree: "",
          branch: "",
          year_of_study: "",
          cgpa: "",
          expected_graduation_year: "",
          start_date: "",
          end_date: "",
          duration_months: "",
          mode: "Onsite",
          stipend_amount: "",
          work_timings: "",
          reporting_manager: "",
          preferred_domain: "",
          technical_skills: "",
          aadhaar_number: "",
          pan_card: "",
          college_id_card: "",
          resume_link: "",
          bank_account_number: "",
          ifsc_code: "",
          bank_name: "",
          emergency_name: "",
          relationship: "",
          emergency_contact_number: "",
          medical_conditions: "",
          laptop_availability: false,
          background_verification_consent: false,
        });
        setErrorMessage("");
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.error("Error adding intern:", err);
        setErrorMessage("Error adding intern.");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><a href="/home">Dashboard</a></li>
          <li><a href="/interns">Interns</a></li>
          <li><button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>Add Intern</button></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>

      <div className="main-content">
        <h2 className="header">Interns List</h2>
        {isLoading ? (
          <p className="loading-text">Loading...</p>
        ) : errorMessage ? (
          <p className="error-text">{errorMessage}</p>
        ) : data.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Institution</th>
                <th>Degree</th>
                <th>Domain</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} onClick={() => navigate(`/admin/tp/${item._id}`)} className="clickable-row">
                  <td>{item.personal_details.full_name}</td>
                  <td>{item.personal_details.email}</td>
                  <td>{item.educational_details.institution_name}</td>
                  <td>{item.educational_details.degree}</td>
                  <td>{item.skills_preferences.preferred_domain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No data available</p>
        )}
      </div>
      {isModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <span className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</span>
      <h3>Add New Intern</h3>

      {/* Personal Details */}
      <input type="text" name="full_name" value={newIntern.full_name} onChange={handleInputChange} placeholder="Full Name" required />
      <input type="email" name="email" value={newIntern.email} onChange={handleInputChange} placeholder="Email" required />
      <input type="date" name="dob" value={newIntern.dob} onChange={handleInputChange} placeholder="Date of Birth" required />
      <select name="gender" value={newIntern.gender} onChange={handleInputChange}>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input type="text" name="contact_number" value={newIntern.contact_number} onChange={handleInputChange} placeholder="Contact Number" required />
      <input type="text" name="permanent_address" value={newIntern.permanent_address} onChange={handleInputChange} placeholder="Permanent Address" required />
      <input type="text" name="current_address" value={newIntern.current_address} onChange={handleInputChange} placeholder="Current Address" required />

      {/* Educational Details */}
      <input type="text" name="institution_name" value={newIntern.institution_name} onChange={handleInputChange} placeholder="Institution Name" required />
      <input type="text" name="degree" value={newIntern.degree} onChange={handleInputChange} placeholder="Degree" required />
      <input type="text" name="branch" value={newIntern.branch} onChange={handleInputChange} placeholder="Branch" required />
      <input type="number" name="year_of_study" value={newIntern.year_of_study} onChange={handleInputChange} placeholder="Year of Study" required />
      <input type="number" name="cgpa" value={newIntern.cgpa} onChange={handleInputChange} placeholder="CGPA" required />
      <input type="number" name="expected_graduation_year" value={newIntern.expected_graduation_year} onChange={handleInputChange} placeholder="Expected Graduation Year" required />

      {/* Internship Details */}
      <input type="date" name="start_date" value={newIntern.start_date} onChange={handleInputChange} placeholder="Start Date" required />
      <input type="date" name="end_date" value={newIntern.end_date} onChange={handleInputChange} placeholder="End Date" required />
      <input type="number" name="duration_months" value={newIntern.duration_months} onChange={handleInputChange} placeholder="Duration (months)" required />
      <select name="mode" value={newIntern.mode} onChange={handleInputChange}>
        <option value="Onsite">Onsite</option>
        <option value="Remote">Remote</option>
        <option value="Hybrid">Hybrid</option>
      </select>
      <input type="number" name="stipend_amount" value={newIntern.stipend_amount} onChange={handleInputChange} placeholder="Stipend Amount (if any)" />
      <input type="text" name="work_timings" value={newIntern.work_timings} onChange={handleInputChange} placeholder="Work Timings (Full-time/Part-time)" required />
      <input type="text" name="reporting_manager" value={newIntern.reporting_manager} onChange={handleInputChange} placeholder="Reporting Manager" required />

      {/* Skills & Preferences */}
      <input type="text" name="preferred_domain" value={newIntern.preferred_domain} onChange={handleInputChange} placeholder="Preferred Domain" required />
      <input type="text" name="technical_skills" value={newIntern.technical_skills} onChange={handleInputChange} placeholder="Technical Skills (comma-separated)" required />

      {/* Identification Documents */}
      <input type="text" name="aadhaar_number" value={newIntern.aadhaar_number} onChange={handleInputChange} placeholder="Aadhaar Number" required />
      <input type="text" name="pan_card" value={newIntern.pan_card} onChange={handleInputChange} placeholder="PAN Card (optional)" />
      <input type="text" name="college_id_card" value={newIntern.college_id_card} onChange={handleInputChange} placeholder="College ID Card (URL)" />
      <input type="text" name="resume_link" value={newIntern.resume_link} onChange={handleInputChange} placeholder="Resume Link (URL)" required />

      {/* Banking Details */}
      <input type="text" name="bank_account_number" value={newIntern.bank_account_number} onChange={handleInputChange} placeholder="Bank Account Number" />
      <input type="text" name="ifsc_code" value={newIntern.ifsc_code} onChange={handleInputChange} placeholder="IFSC Code" />
      <input type="text" name="bank_name" value={newIntern.bank_name} onChange={handleInputChange} placeholder="Bank Name" />
      <input type="text" name="branch" value={newIntern.branch} onChange={handleInputChange} placeholder="Branch" />

      {/* Emergency Contact */}
      <input type="text" name="emergency_name" value={newIntern.emergency_name} onChange={handleInputChange} placeholder="Emergency Contact Name" required />
      <input type="text" name="relationship" value={newIntern.relationship} onChange={handleInputChange} placeholder="Relationship" required />
      <input type="text" name="emergency_contact_number" value={newIntern.emergency_contact_number} onChange={handleInputChange} placeholder="Emergency Contact Number" required />

      {/* Additional Info */}
      <input type="text" name="medical_conditions" value={newIntern.medical_conditions} onChange={handleInputChange} placeholder="Medical Conditions (if any)" />
      <label>
        <input type="checkbox" name="laptop_availability" checked={newIntern.laptop_availability} onChange={handleInputChange} />
        Laptop Available
      </label>
      <label>
        <input type="checkbox" name="background_verification_consent" checked={newIntern.background_verification_consent} onChange={handleInputChange} />
        Background Verification Consent
      </label>

      <button onClick={handleAddIntern} >
        {isLoading ? "Adding..." : "Add Intern"}
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default TP;
