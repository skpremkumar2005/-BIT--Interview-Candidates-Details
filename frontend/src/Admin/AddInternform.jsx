import React, { useState, useRef } from "react";
import axios from "axios";
// Import the CSS file you'll create with the styles above
import "./internform.css";

const AddInternForm = ({ selectedDomain, onInternAdded, onClose }) => {
  // References for each section for scrolling
  const personalRef = useRef(null);
  const educationalRef = useRef(null);
  const identificationRef = useRef(null);
  const internshipRef = useRef(null);
  const skillsRef = useRef(null);
  const bankingRef = useRef(null);
  const emergencyRef = useRef(null);
  const additionalRef = useRef(null);

  // Scroll to section function
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [intern, setIntern] = useState({
    Domain: selectedDomain || "",
    personal_details: {
      full_name: "",
      dob: "",
      gender: "",
      contact_number: "",
      email: "",
      permanent_address: "",
      current_address: "",
    },
    educational_details: {
      institution_name: "",
      degree: "",
      branch: "",
      year_of_study: "",
      cgpa: "",
      expected_graduation_year: "",
    },
    identification_documents: {
      aadhaar_number: "",
      pan_card: "",
      college_id_card: "",
      resume: "",
      offer_letter: "",
      internship_agreement: "",
    },
    internship_details: {
      start_date: "",
      end_date: "",
      duration_months: "",
      mode: "",
      stipend: {
        amount: "",
        currency: "INR",
      },
      work_timings: "",
      reporting_manager: "",
    },
    skills_preferences: {
      technical_skills: "",
      preferred_domain: "",
      previous_experience: [{ company: "", role: "", duration_months: "" }],
    },
    banking_details: {
      bank_account_number: "",
      ifsc_code: "",
      bank_name: "",
      branch: "",
    },
    emergency_contact: {
      name: "",
      relationship: "",
      contact_number: "",
    },
    additional_info: {
      medical_conditions: "None",
      laptop_availability: true,
      background_verification_consent: true,
    },
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const keys = name.split(".");
    setIntern((prev) => {
      let updated = { ...prev };
      let ref = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = type === "number" ? Number(value) : value;
      return updated;
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const keys = name.split(".");
    setIntern((prev) => {
      let updated = { ...prev };
      let ref = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = checked;
      return updated;
    });
  };

  // Handle change for nested arrays like previous_experience
  const handleExperienceChange = (index, field, value) => {
    setIntern((prev) => {
      const updated = { ...prev };
      updated.skills_preferences.previous_experience[index][field] = value;
      return updated;
    });
  };

  // Add new experience entry
  const addExperience = () => {
    setIntern((prev) => {
      const updated = { ...prev };
      updated.skills_preferences.previous_experience.push({
        company: "",
        role: "",
        duration_months: "",
      });
      return updated;
    });
  };

  // Remove experience entry
  const removeExperience = (index) => {
    setIntern((prev) => {
      const updated = { ...prev };
      updated.skills_preferences.previous_experience.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/admin/interns", intern);
      onInternAdded(response.data);
      onClose();
    } catch (error) {
      console.error("Error adding intern:", error);
    }
    
  };

  return (
    <form onSubmit={handleSubmit} className="intern-form">
      <h2>Add Intern</h2>

      {/* Section Navigation */}
      <div className="form-nav">
        <button type="button" onClick={() => scrollToSection(personalRef)}>Personal</button>
        <button type="button" onClick={() => scrollToSection(educationalRef)}>Education</button>
        <button type="button" onClick={() => scrollToSection(identificationRef)}>Documents</button>
        <button type="button" onClick={() => scrollToSection(internshipRef)}>Internship</button>
        <button type="button" onClick={() => scrollToSection(skillsRef)}>Skills</button>
        <button type="button" onClick={() => scrollToSection(bankingRef)}>Banking</button>
        <button type="button" onClick={() => scrollToSection(emergencyRef)}>Emergency</button>
        <button type="button" onClick={() => scrollToSection(additionalRef)}>Additional</button>
      </div>

      <div className="form-section">
        <h3>Domain Information</h3>
        <div className="form-group">
          <label>Domain:</label>
          <input type="text" name="Domain" value={intern.Domain} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-section" ref={personalRef}>
        <h3>Personal Details</h3>
        <div className="form-group">
          <label className="required">Full Name:</label>
          <input type="text" name="personal_details.full_name" value={intern.personal_details.full_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Date of Birth:</label>
          <input type="date" name="personal_details.dob" value={intern.personal_details.dob} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Gender:</label>
          <select name="personal_details.gender" value={intern.personal_details.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="required">Contact Number:</label>
          <input type="tel" name="personal_details.contact_number" value={intern.personal_details.contact_number} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Email:</label>
          <input type="email" name="personal_details.email" value={intern.personal_details.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Permanent Address:</label>
          <textarea name="personal_details.permanent_address" value={intern.personal_details.permanent_address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Current Address:</label>
          <textarea name="personal_details.current_address" value={intern.personal_details.current_address} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-section" ref={educationalRef}>
        <h3>Educational Details</h3>
        <div className="form-group">
          <label className="required">Institution Name:</label>
          <input type="text" name="educational_details.institution_name" value={intern.educational_details.institution_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Degree:</label>
          <input type="text" name="educational_details.degree" value={intern.educational_details.degree} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Branch:</label>
          <input type="text" name="educational_details.branch" value={intern.educational_details.branch} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Year of Study:</label>
          <input type="text" name="educational_details.year_of_study" value={intern.educational_details.year_of_study} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">CGPA:</label>
          <input type="number" step="0.01" name="educational_details.cgpa" value={intern.educational_details.cgpa} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Expected Graduation Year:</label>
          <input type="text" name="educational_details.expected_graduation_year" value={intern.educational_details.expected_graduation_year} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-section" ref={identificationRef}>
        <h3>Identification Documents</h3>
        <div className="form-group">
          <label className="required">Aadhaar Number:</label>
          <input type="text" name="identification_documents.aadhaar_number" value={intern.identification_documents.aadhaar_number} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>PAN Card:</label>
          <input type="text" name="identification_documents.pan_card" value={intern.identification_documents.pan_card} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="required">College ID Card:</label>
          <input type="text" name="identification_documents.college_id_card" value={intern.identification_documents.college_id_card} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Resume:</label>
          <input type="text" name="identification_documents.resume" value={intern.identification_documents.resume} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Offer Letter:</label>
          <input type="text" name="identification_documents.offer_letter" value={intern.identification_documents.offer_letter} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Internship Agreement:</label>
          <input type="text" name="identification_documents.internship_agreement" value={intern.identification_documents.internship_agreement} onChange={handleChange} />
        </div>
      </div>

      <div className="form-section" ref={internshipRef}>
        <h3>Internship Details</h3>
        <div className="form-group">
          <label className="required">Start Date:</label>
          <input type="date" name="internship_details.start_date" value={intern.internship_details.start_date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">End Date:</label>
          <input type="date" name="internship_details.end_date" value={intern.internship_details.end_date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Duration (months):</label>
          <input type="number" name="internship_details.duration_months" value={intern.internship_details.duration_months} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Mode:</label>
          <select name="internship_details.mode" value={intern.internship_details.mode} onChange={handleChange} required>
            <option value="">Select Mode</option>
            <option value="Remote">Remote</option>
            <option value="In-office">In-office</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div className="form-group">
          <label className="required">Stipend Amount:</label>
          <input type="number" name="internship_details.stipend.amount" value={intern.internship_details.stipend.amount} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Currency:</label>
          <select name="internship_details.stipend.currency" value={intern.internship_details.stipend.currency} onChange={handleChange} required>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div className="form-group">
          <label className="required">Work Timings:</label>
          <input type="text" name="internship_details.work_timings" value={intern.internship_details.work_timings} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Reporting Manager:</label>
          <input type="text" name="internship_details.reporting_manager" value={intern.internship_details.reporting_manager} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-section" ref={skillsRef}>
        <h3>Skills & Preferences</h3>
        <div className="form-group">
          <label className="required">Technical Skills:</label>
          <textarea name="skills_preferences.technical_skills" value={intern.skills_preferences.technical_skills} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Preferred Domain:</label>
          <input type="text" name="skills_preferences.preferred_domain" value={intern.skills_preferences.preferred_domain} onChange={handleChange} required />
        </div>
        
        <h4>Previous Experience</h4>
        {intern.skills_preferences.previous_experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="form-group">
              <label>Company:</label>
              <input 
                type="text" 
                value={exp.company} 
                onChange={(e) => handleExperienceChange(index, "company", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <input 
                type="text" 
                value={exp.role} 
                onChange={(e) => handleExperienceChange(index, "role", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Duration (months):</label>
              <input 
                type="number" 
                value={exp.duration_months} 
                onChange={(e) => handleExperienceChange(index, "duration_months", e.target.value)} 
              />
            </div>
            {index > 0 && (
              <button type="button" onClick={() => removeExperience(index)}>Remove</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addExperience}>Add Experience</button>
      </div>

      <div className="form-section" ref={bankingRef}>
        <h3>Banking Details</h3>
        <div className="form-group">
          <label className="required">Bank Account Number:</label>
          <input type="text" name="banking_details.bank_account_number" value={intern.banking_details.bank_account_number} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">IFSC Code:</label>
          <input type="text" name="banking_details.ifsc_code" value={intern.banking_details.ifsc_code} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Bank Name:</label>
          <input type="text" name="banking_details.bank_name" value={intern.banking_details.bank_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Branch:</label>
          <input type="text" name="banking_details.branch" value={intern.banking_details.branch} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-section" ref={emergencyRef}>
        <h3>Emergency Contact</h3>
        <div className="form-group">
          <label className="required">Name:</label>
          <input type="text" name="emergency_contact.name" value={intern.emergency_contact.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Relationship:</label>
          <input type="text" name="emergency_contact.relationship" value={intern.emergency_contact.relationship} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="required">Contact Number:</label>
          <input type="tel" name="emergency_contact.contact_number" value={intern.emergency_contact.contact_number} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-section" ref={additionalRef}>
        <h3>Additional Information</h3>
        <div className="form-group">
          <label>Medical Conditions:</label>
          <textarea name="additional_info.medical_conditions" value={intern.additional_info.medical_conditions} onChange={handleChange} />
        </div>
        <div className="form-group checkbox">
          <label>
            <input 
              type="checkbox" 
              name="additional_info.laptop_availability" 
              checked={intern.additional_info.laptop_availability} 
              onChange={handleCheckboxChange} 
            />
            Laptop Availability
          </label>
        </div>
        <div className="form-group checkbox">
          <label>
            <input 
              type="checkbox" 
              name="additional_info.background_verification_consent" 
              checked={intern.additional_info.background_verification_consent} 
              onChange={handleCheckboxChange} 
              required
            />
            I consent to background verification
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onClose}>Cancel</button>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default AddInternForm;