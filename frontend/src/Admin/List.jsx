import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddInternForm from "./AddInternform";
import "./List.css";

const List = ({ selectedDomain }) => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [genderFilter, setGenderFilter] = useState("All");
  const [selectedInterns, setSelectedInterns] = useState([]);
  const navigate = useNavigate();

  // Stats for the dashboard
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    other: 0,
  });

  useEffect(() => {
    if (!selectedDomain) return;

    const fetchInterns = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/admin/interns?domain=${selectedDomain}`);
        setInterns(response.data);
        
        // Calculate stats
        const male = response.data.filter(intern => intern.personal_details.gender === "Male").length;
        const female = response.data.filter(intern => intern.personal_details.gender === "Female").length;
        const other = response.data.filter(intern => intern.personal_details.gender === "Other").length;
        
        setStats({
          total: response.data.length,
          male,
          female,
          other
        });
      } catch (error) {
        console.error("Error fetching interns:", error);
        setInterns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, [selectedDomain]);

  const handleInternAdded = (newIntern) => {
    // Prevent duplicate entries
    if (!interns.find((i) => i.personal_details.email === newIntern.personal_details.email)) {
      const updatedInterns = [...interns, newIntern];
      setInterns(updatedInterns);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        male: newIntern.personal_details.gender === "Male" ? prev.male + 1 : prev.male,
        female: newIntern.personal_details.gender === "Female" ? prev.female + 1 : prev.female,
        other: newIntern.personal_details.gender === "Other" ? prev.other + 1 : prev.other
      }));
    }
    setShowForm(false); // Close form after adding
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, set to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectIntern = (id, e) => {
    e.stopPropagation(); // Prevent row click
    if (selectedInterns.includes(id)) {
      setSelectedInterns(selectedInterns.filter(internId => internId !== id));
    } else {
      setSelectedInterns([...selectedInterns, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedInterns.length === filteredInterns.length) {
      setSelectedInterns([]);
    } else {
      setSelectedInterns(filteredInterns.map(intern => intern._id));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedInterns.length === 0) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedInterns.length} interns?`);
    if (!confirmDelete) return;
    
    try {
      await Promise.all(selectedInterns.map(id => 
        axios.delete(`http://localhost:3000/admin/interns/${id}`)
      ));
      
      // Update the list
      const remainingInterns = interns.filter(intern => !selectedInterns.includes(intern._id));
      setInterns(remainingInterns);
      setSelectedInterns([]);
      
      // Update stats
      const deletedMale = interns.filter(intern => 
        selectedInterns.includes(intern._id) && intern.personal_details.gender === "Male"
      ).length;
      
      const deletedFemale = interns.filter(intern => 
        selectedInterns.includes(intern._id) && intern.personal_details.gender === "Female"
      ).length;
      
      const deletedOther = interns.filter(intern => 
        selectedInterns.includes(intern._id) && intern.personal_details.gender === "Other"
      ).length;
      
      setStats(prev => ({
        total: prev.total - selectedInterns.length,
        male: prev.male - deletedMale,
        female: prev.female - deletedFemale,
        other: prev.other - deletedOther
      }));
      
      alert(`Successfully deleted ${selectedInterns.length} interns.`);
    } catch (error) {
      console.error("Error during batch delete:", error);
      alert("Error occurred during deletion. Please try again.");
    }
  };

  const exportToCsv = () => {
    // Create CSV content
    const headers = ["Full Name", "Email", "Contact", "Gender", "Institution", "Degree"];
    const csvRows = [headers.join(",")];
    
    filteredInterns.forEach(intern => {
      const row = [
        intern.personal_details.full_name,
        intern.personal_details.email,
        intern.personal_details.contact_number,
        intern.personal_details.gender,
        intern.educational_details?.institution_name || "",
        intern.educational_details?.degree || ""
      ].map(value => `"${value}"`); // Wrap in quotes to handle commas in values
      
      csvRows.push(row.join(","));
    });
    
    // Create and download CSV file
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedDomain}_interns.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Apply filters
  const filteredInterns = interns.filter((intern) => (
    (genderFilter === "All" || intern.personal_details.gender === genderFilter) &&
    (intern.personal_details.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     intern.personal_details.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ));

  // Apply sorting
  const sortedInterns = [...filteredInterns].sort((a, b) => {
    let valueA, valueB;
    
    if (sortField === "name") {
      valueA = a.personal_details.full_name.toLowerCase();
      valueB = b.personal_details.full_name.toLowerCase();
    } else if (sortField === "email") {
      valueA = a.personal_details.email.toLowerCase();
      valueB = b.personal_details.email.toLowerCase();
    } else if (sortField === "gender") {
      valueA = a.personal_details.gender.toLowerCase();
      valueB = b.personal_details.gender.toLowerCase();
    } else if (sortField === "contact") {
      valueA = a.personal_details.contact_number;
      valueB = b.personal_details.contact_number;
    }
    
    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Apply pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInterns = sortedInterns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedInterns.length / itemsPerPage);

  return (
    <div className="list-container">
      {/* Breadcrumb */}
      {/* <div className="breadcrumb">
        <span onClick={() => navigate("/")}>Dashboard</span> &gt; 
        <span>{selectedDomain}</span>
      </div> */}

      <div className="list-header">
        <h2>{selectedDomain} Interns</h2>
        <div className="list-actions">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search interns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <select 
            className="filter-dropdown"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          
          <button className="add-button" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Intern"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-data">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Interns</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨</div>
          <div className="stat-data">
            <span className="stat-value">{stats.male}</span>
            <span className="stat-label">Male</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👩</div>
          <div className="stat-data">
            <span className="stat-value">{stats.female}</span>
            <span className="stat-label">Female</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🧑</div>
          <div className="stat-data">
            <span className="stat-value">{stats.other}</span>
            <span className="stat-label">Other</span>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <AddInternForm
              selectedDomain={selectedDomain}
              onInternAdded={handleInternAdded}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-skeleton">
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
            <div className="skeleton-row"></div>
          </div>
          <p>Loading interns...</p>
        </div>
      ) : interns.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👩‍💻</div>
          <p>No interns found for {selectedDomain}.</p>
          <p className="empty-suggestion">Add your first intern to get started!</p>
        </div>
      ) : (
        <div className="intern-list-wrapper">
          <div className="list-stats">
            <span>{filteredInterns.length} intern{filteredInterns.length !== 1 ? 's' : ''} found</span>
            <div className="list-actions-right">
              {selectedInterns.length > 0 && (
                <button className="batch-delete-button" onClick={handleBatchDelete}>
                  Delete Selected ({selectedInterns.length})
                </button>
              )}
              <button className="export-button" onClick={exportToCsv}>
                Export to CSV
              </button>
            </div>
          </div>
          
          <div className="table-container">
            <table className="intern-table">
              <thead>
                <tr>
                  <th className="checkbox-column">
                    <input 
                      type="checkbox" 
                      checked={selectedInterns.length === filteredInterns.length && filteredInterns.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th onClick={() => handleSort("name")}>
                    Full Name
                    {sortField === "name" && (
                      <span className="sort-indicator">
                        {sortDirection === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort("email")}>
                    Email
                    {sortField === "email" && (
                      <span className="sort-indicator">
                        {sortDirection === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort("contact")}>
                    Contact
                    {sortField === "contact" && (
                      <span className="sort-indicator">
                        {sortDirection === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort("gender")}>
                    Gender
                    {sortField === "gender" && (
                      <span className="sort-indicator">
                        {sortDirection === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentInterns.map((intern) => (
                  <tr 
                    key={intern._id}
                    onClick={() => navigate(`/details/${intern._id}`)}
                    className={`intern-row ${selectedInterns.includes(intern._id) ? 'selected-row' : ''}`}
                  >
                    <td className="checkbox-column" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedInterns.includes(intern._id)}
                        onChange={(e) => handleSelectIntern(intern._id, e)}
                      />
                    </td>
                    <td>
                      <div className="intern-name-cell">
                        {intern.personal_details.full_name}
                        <div className="intern-tooltip">
                          <p><strong>Institution:</strong> {intern.educational_details?.institution_name || 'N/A'}</p>
                          <p><strong>Degree:</strong> {intern.educational_details?.degree || 'N/A'}</p>
                          <p><strong>Internship Period:</strong> {intern.internship_details?.start_date ? 
                            `${new Date(intern.internship_details.start_date).toLocaleDateString()} - 
                             ${new Date(intern.internship_details.end_date).toLocaleDateString()}` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{intern.personal_details.email}</td>
                    <td>{intern.personal_details.contact_number}</td>
                    <td>{intern.personal_details.gender}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="view-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/details/${intern._id}`);
                          }}
                        >
                          View
                        </button>
                        <button 
                          className="edit-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit/${intern._id}`);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
              
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default List;