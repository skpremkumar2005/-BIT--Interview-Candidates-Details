import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Adminpage.css";
import  List  from "./List";

const Adminpage = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);

  // Fetch domains from backend
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/domain"); // Adjust API endpoint as needed
        setDomains(response.data);
      } catch (error) {
        console.error("Error fetching domains:", error);
      }
    };
    fetchDomains();
  }, []);

  // Add new domain
  const addDomain = async () => {
    const domainName = prompt("Enter the new domain name:");
    if (!domainName) return;

    try {
      const response = await axios.post("http://localhost:3000/admin/domain", { Domain: domainName });
      setDomains([...domains, response.data]); // Update UI with new domain
    } catch (error) {
      console.error("Error adding domain:", error);
      alert("Failed to add domain!");
    }
  };
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-container">
          <img src="download.jpeg" alt="Logo" className="logo" />
          <h1 className="title">Interns Portal</h1>
        </div>
        <ul>
          <li><a onClick={() => setSelectedDomain(null)}>Dashboard</a></li>
          {domains.map((domain) => (
            <li key={domain._id} onClick={() => setSelectedDomain(domain.Domain)}>
              <a>{domain.Domain}</a>
            </li>
          ))}
          <li><a onClick={addDomain}>+ Add Domain</a></li>
          <li><Link to="/internDashBoard">New DashBoard</Link></li>
        </ul>
      </aside>


      <main className="main-content">
        {selectedDomain ? (
          <List selectedDomain={selectedDomain} />
        ) : (
          <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="card-container">
              {domains.map((domain) => (
                <div key={domain._id} className="card" onClick={() => setSelectedDomain(domain.Domain)}>
                  <h3>{domain.Domain}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Adminpage;