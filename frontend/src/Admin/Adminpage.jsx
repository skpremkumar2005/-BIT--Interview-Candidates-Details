import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Adminpage.css";
import List from "./List";
import { FiHome, FiPlus, FiEdit2, FiTrash2, FiSearch, FiRefreshCw } from "react-icons/fi";

const Adminpage = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [newDomainName, setNewDomainName] = useState("");
  const [editingDomain, setEditingDomain] = useState(null);

  // Fetch domains from backend
  const fetchDomains = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/admin/domain");
      setDomains(response.data);
    } catch (error) {
      console.error("Error fetching domains:", error);
      setError("Failed to load domains. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  // Add new domain
  const addDomain = async (e) => {
    e.preventDefault();
    if (!newDomainName.trim()) return;

    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:3000/admin/domain", { Domain: newDomainName });
      setDomains([...domains, response.data]);
      setNewDomainName("");
      setIsDomainModalOpen(false);
    } catch (error) {
      console.error("Error adding domain:", error);
      setError("Failed to add domain. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update domain
  const updateDomain = async (e) => {
    e.preventDefault();
    if (!newDomainName.trim() || !editingDomain) return;

    try {
      setIsLoading(true);
      const response = await axios.put(`http://localhost:3000/admin/domain/${editingDomain._id}`, {
        Domain: newDomainName,
      });

      setDomains(
        domains.map((domain) => (domain._id === editingDomain._id ? { ...domain, Domain: newDomainName } : domain))
      );

      setNewDomainName("");
      setEditingDomain(null);
      setIsDomainModalOpen(false);
    } catch (error) {
      console.error("Error updating domain:", error);
      setError("Failed to update domain. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete domain
  const deleteDomain = async (domainId) => {
    if (!window.confirm("Are you sure you want to delete this domain?")) return;

    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:3000/admin/domain/${domainId}`);
      setDomains(domains.filter((domain) => domain._id !== domainId));
      if (selectedDomain === domains.find(d => d._id === domainId)?.Domain) {
        setSelectedDomain(null);
      }
    } catch (error) {
      console.error("Error deleting domain:", error);
      setError("Failed to delete domain. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter domains based on search term
  const filteredDomains = domains.filter(
    (domain) => domain?.Domain?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );
  

  // Open modal for adding or editing domain
  const openDomainModal = (domain = null) => {
    if (domain) {
      setEditingDomain(domain);
      setNewDomainName(domain.Domain);
    } else {
      setEditingDomain(null);
      setNewDomainName("");
    }
    setIsDomainModalOpen(true);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          {/* <img src="/images/logo.png" alt="Interns Portal Logo" className="logo" /> */}
          <h1 className="title">Interns Portal</h1>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${selectedDomain === null ? 'active' : ''}`} 
              onClick={() => setSelectedDomain(null)}
            >
              <FiHome className="menu-icon" />
              <span className="menu-text">Dashboard</span>
            </button>
            
            <div className="domain-section">
              <div className="section-header">
                <h3>Domains</h3>
                <button 
                  className="add-btn" 
                  onClick={() => openDomainModal()}
                  title="Add new domain"
                >
                  <FiPlus />
                </button>
              </div>
              
              <div className="domain-search">
                <input
                  type="text"
                  placeholder="Search domains..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="domain-list">
                {filteredDomains.map((domain) => (
                  <div 
                    key={domain._id} 
                    className={`domain-item ${selectedDomain === domain.Domain ? 'active' : ''}`}
                  >
                    <button
                      className="domain-name"
                      onClick={() => setSelectedDomain(domain.Domain)}
                    >
                      {domain.Domain}
                    </button>
                    <div className="domain-actions">
                      <button 
                        className="edit-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          openDomainModal(domain);
                        }}
                        title="Edit domain"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDomain(domain._id);
                        }}
                        title="Delete domain"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {filteredDomains.length === 0 && !isLoading && (
                  <div className="no-results">No domains found</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="sidebar-footer">
            <button className="refresh-btn" onClick={fetchDomains} disabled={isLoading}>
              <FiRefreshCw className={isLoading ? "spinning" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {error && <div className="error-message">{error}</div>}
        
        {selectedDomain ? (
          <List selectedDomain={selectedDomain} />
        ) : (
          <div className="dashboard">
            <header className="dashboard-header">
              <h1>Domain Dashboard</h1>
              <div className="action-buttons">
                <button className="primary-btn" onClick={() => openDomainModal()}>
                  <FiPlus /> Add New Domain
                </button>
              </div>
            </header>
            
            {isLoading ? (
              <div className="loading-container">
                <div className="loader"></div>
                <p>Loading domains...</p>
              </div>
            ) : (
              <>
                <div className="stats-row">
                  <div className="stat-card">
                    <h3>Total Domains</h3>
                    <p className="stat-value">{domains.length}</p>
                  </div>
                  {/* Add more statistics as needed */}
                </div>
                
                <div className="card-container">
                  {filteredDomains.map((domain) => (
                    <div key={domain._id} className="domain-card" onClick={() => setSelectedDomain(domain.Domain)}>
                      <div className="card-content">
                        <h3>{domain.Domain}</h3>
                        <p>Click to view details</p>
                      </div>
                      <div className="card-actions">
                        <button 
                          className="card-action-btn edit" 
                          onClick={(e) => {
                            e.stopPropagation();
                            openDomainModal(domain);
                          }}
                          title="Edit domain"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          className="card-action-btn delete" 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDomain(domain._id);
                          }}
                          title="Delete domain"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredDomains.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3>No domains found</h3>
                    <p>Try adjusting your search or add a new domain.</p>
                    <button className="primary-btn" onClick={() => openDomainModal()}>
                      <FiPlus /> Add New Domain
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Domain Modal */}
      {isDomainModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingDomain ? "Edit Domain" : "Add New Domain"}</h2>
              <button className="close-btn" onClick={() => setIsDomainModalOpen(false)}>×</button>
            </div>
            <form onSubmit={editingDomain ? updateDomain : addDomain}>
              <div className="form-group">
                <label htmlFor="domainName">Domain Name:</label>
                <input
                  type="text"
                  id="domainName"
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                  placeholder="Enter domain name"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsDomainModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? "Processing..." : editingDomain ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adminpage;