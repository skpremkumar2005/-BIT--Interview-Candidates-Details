import React, { useState } from "react";
import "./Adminpage.css"; // Ensure you create a separate CSS file for styling
import { Link } from "react-router-dom";

const Adminpage = () => {
  // const [domains, setDomains] = useState(["PS", "T & P", "ELCC", "SPECIAL LAB", "DAY-SKILL"]);
  const addDomain = () => {
    const domainName = prompt("Enter the new domain name:");
    if (domainName && !domains.includes(domainName)) {
      setDomains([...domains, domainName]);
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
          <li><a>Dashboard</a></li>
          <li><a>Domains</a></li>
          <li><Link to="/admin/tp">tp</Link></li>
         <li><Link to="/admin/ps">ps</Link></li>
          <li><Link to="/admin/rp">rp</Link></li>
          <li><Link to="/admin/iqac">iqac</Link></li>
          <li><Link to="/admin/sl">sl</Link></li>
          {/* <li><a href="#" onClick={addDomain}>+ Add Domain</a></li> */}
          <li><Link to="/">Logout</Link></li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="search-bar">
          <input type="text" placeholder="Search using intern id..." />
        </div>

        <div className="dashboard">
          <h1>Dashboard</h1>
          <div className="card-container">
          <Link to="/admin/tp">  <div className="card">T & P</div></Link>
          <Link to="/admin/ps">  <div className="card">PS</div></Link>
          <Link to="/admin/rp">  <div className="card">RP</div></Link>
      <Link to="/admin/iqac">  <div className="card">IQAC</div></Link>
      <Link to="/admin/sl">  <div className="card">SL</div></Link>          </div>
        </div>
      </main>
    </div>
  );
};

export default Adminpage;
