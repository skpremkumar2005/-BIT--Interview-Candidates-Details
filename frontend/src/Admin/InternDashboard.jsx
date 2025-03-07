import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "./Dashboard.css";

const InternDashboard = () => {
  const [interns, setInterns] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or table
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    mode: "",
    workTimings: "",
    yearOfStudy: "",
    sortBy: "name",
    sortOrder: "asc",
    startDateFrom: "",
    startDateTo: "",
  });
  const [stats, setStats] = useState({
    totalInterns: 0,
    maleCount: 0,
    femaleCount: 0,
    remoteCount: 0,
    onsiteCount: 0,
    hybridCount: 0,
    domainDistribution: {},
  });
  const [expandedFilters, setExpandedFilters] = useState(false);
  const navigate = useNavigate();

  // Fetch interns and domains on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [internsResponse, domainsResponse] = await Promise.all([
          axios.get("http://localhost:3000/admin/"),
          axios.get("http://localhost:3000/admin/domain"),
        ]);
        setInterns(internsResponse.data);
        setFilteredInterns(internsResponse.data);
        setDomains(domainsResponse.data);
        calculateStats(internsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate dashboard statistics
  const calculateStats = (internData) => {
    const stats = {
      totalInterns: internData.length,
      maleCount: internData.filter(
        (intern) => intern.personal_details.gender === "Male"
      ).length,
      femaleCount: internData.filter(
        (intern) => intern.personal_details.gender === "Female"
      ).length,
      remoteCount: internData.filter(
        (intern) => intern.internship_details.mode === "Remote"
      ).length,
      onsiteCount: internData.filter(
        (intern) => intern.internship_details.mode === "Onsite"
      ).length,
      hybridCount: internData.filter(
        (intern) => intern.internship_details.mode === "Hybrid"
      ).length,
      domainDistribution: {},
    };

    // Calculate domain distribution
    internData.forEach((intern) => {
      const domain = intern.Domain;
      if (!stats.domainDistribution[domain]) {
        stats.domainDistribution[domain] = 0;
      }
      stats.domainDistribution[domain]++;
    });

    setStats(stats);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [selectedDomain, searchTerm, filters, interns]);

  const applyFilters = () => {
    let filtered = [...interns];

    // Filter by domain
    if (selectedDomain) {
      filtered = filtered.filter((intern) => intern.Domain === selectedDomain);
    }

    // Search term filter (across multiple fields)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (intern) =>
          intern.personal_details.full_name.toLowerCase().includes(term) ||
          intern.personal_details.email.toLowerCase().includes(term) ||
          intern.educational_details.institution_name
            .toLowerCase()
            .includes(term) ||
          intern.skills_preferences.technical_skills.some((skill) =>
            skill.toLowerCase().includes(term)
          )
      );
    }

    // Apply additional filters
    if (filters.gender) {
      filtered = filtered.filter(
        (intern) => intern.personal_details.gender === filters.gender
      );
    }

    if (filters.mode) {
      filtered = filtered.filter(
        (intern) => intern.internship_details.mode === filters.mode
      );
    }

    if (filters.workTimings) {
      filtered = filtered.filter(
        (intern) => intern.internship_details.work_timings === filters.workTimings
      );
    }

    if (filters.yearOfStudy) {
      filtered = filtered.filter(
        (intern) =>
          intern.educational_details.year_of_study === parseInt(filters.yearOfStudy)
      );
    }

    // Date range filters
    if (filters.startDateFrom) {
      const fromDate = new Date(filters.startDateFrom);
      filtered = filtered.filter(
        (intern) => new Date(intern.internship_details.start_date) >= fromDate
      );
    }

    if (filters.startDateTo) {
      const toDate = new Date(filters.startDateTo);
      filtered = filtered.filter(
        (intern) => new Date(intern.internship_details.start_date) <= toDate
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let valueA, valueB;

      switch (filters.sortBy) {
        case "name":
          valueA = a.personal_details.full_name;
          valueB = b.personal_details.full_name;
          break;
        case "email":
          valueA = a.personal_details.email;
          valueB = b.personal_details.email;
          break;
        case "startDate":
          valueA = new Date(a.internship_details.start_date);
          valueB = new Date(b.internship_details.start_date);
          break;
        case "endDate":
          valueA = new Date(a.internship_details.end_date);
          valueB = new Date(b.internship_details.end_date);
          break;
        case "stipend":
          valueA = a.internship_details.stipend.amount;
          valueB = b.internship_details.stipend.amount;
          break;
        default:
          valueA = a.personal_details.full_name;
          valueB = b.personal_details.full_name;
      }

      if (filters.sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredInterns(filtered);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      gender: "",
      mode: "",
      workTimings: "",
      yearOfStudy: "",
      sortBy: "name",
      sortOrder: "asc",
      startDateFrom: "",
      startDateTo: "",
    });
    setSearchTerm("");
    setSelectedDomain("");
  };

  const handleInternSelected = (internId) => {
    navigate(`/intern/${internId}`);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const renderSkillBadges = (skills) => {
    return skills.map((skill, index) => (
      <span key={index} className="skill-badge">
        {skill}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Interns Management Dashboard</h1>
          <p>
            Manage all your interns across different domains and track their progress
          </p>
        </div>
        <div className="dashboard-actions">
          <button
            className="primary-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : "Add New Intern"}
          </button>
          <div className="view-toggle">
            <button
              className={`toggle-button ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid View"
            >
              <i className="fas fa-th"></i>
            </button>
            <button
              className={`toggle-button ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              aria-label="Table View"
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">👩‍💻</div>
          <div className="stat-content">
            <h3>{stats.totalInterns}</h3>
            <p>Total Interns</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨</div>
          <div className="stat-content">
            <h3>{stats.maleCount}</h3>
            <p>Male</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👩</div>
          <div className="stat-content">
            <h3>{stats.femaleCount}</h3>
            <p>Female</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>{stats.onsiteCount}</h3>
            <p>Onsite</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <h3>{stats.remoteCount}</h3>
            <p>Remote</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>{stats.hybridCount}</h3>
            <p>Hybrid</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-container">
        <div className="search-bar">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search by name, email, institution or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm("")}
            >
              ×
            </button>
          )}
        </div>

        <div className="quick-filters">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="filter-select"
          >
            <option value="">All Domains</option>
            {domains.map((domain) => (
              <option key={domain._id} value={domain.name}>
                {domain.name}
              </option>
            ))}
          </select>

          <button
            className={`filter-toggle ${expandedFilters ? "active" : ""}`}
            onClick={() => setExpandedFilters(!expandedFilters)}
          >
            <i className="fas fa-filter"></i> Advanced Filters
          </button>

          <button className="reset-filters" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {expandedFilters && (
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Work Mode</label>
              <select
                value={filters.mode}
                onChange={(e) => handleFilterChange("mode", e.target.value)}
              >
                <option value="">All</option>
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Work Timing</label>
              <select
                value={filters.workTimings}
                onChange={(e) => handleFilterChange("workTimings", e.target.value)}
              >
                <option value="">All</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Year of Study</label>
              <select
                value={filters.yearOfStudy}
                onChange={(e) => handleFilterChange("yearOfStudy", e.target.value)}
              >
                <option value="">All</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Start Date (From)</label>
              <input
                type="date"
                value={filters.startDateFrom}
                onChange={(e) => handleFilterChange("startDateFrom", e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Start Date (To)</label>
              <input
                type="date"
                value={filters.startDateTo}
                onChange={(e) => handleFilterChange("startDateTo", e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="startDate">Start Date</option>
                <option value="endDate">End Date</option>
                <option value="stipend">Stipend</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing {filteredInterns.length} of {interns.length} interns
          {selectedDomain && ` in ${selectedDomain}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="interns-grid">
          {filteredInterns.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No interns found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button className="reset-button" onClick={resetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredInterns.map((intern) => (
              <div
                key={intern._id}
                className="intern-card"
                onClick={() => handleInternSelected(intern._id)}
              >
                <div className="intern-card-header">
                  <div className="intern-initial">
                    {intern.personal_details.full_name.charAt(0)}
                  </div>
                  <div className="intern-meta">
                    <h3>{intern.personal_details.full_name}</h3>
                    <p>{intern.personal_details.email}</p>
                  </div>
                </div>
                <div className="intern-card-body">
                  <div className="intern-detail">
                    <span className="detail-label">Domain:</span>
                    <span className="detail-value">{intern.Domain}</span>
                  </div>
                  <div className="intern-detail">
                    <span className="detail-label">Institution:</span>
                    <span className="detail-value">
                      {intern.educational_details.institution_name}
                    </span>
                  </div>
                  <div className="intern-detail">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">
                      {intern.internship_details.duration_months} months
                    </span>
                  </div>
                  <div className="intern-detail">
                    <span className="detail-label">Mode:</span>
                    <span className="detail-value">
                      {intern.internship_details.mode}
                    </span>
                  </div>
                  <div className="intern-detail">
                    <span className="detail-label">Period:</span>
                    <span className="detail-value">
                      {formatDate(intern.internship_details.start_date)} - 
                      {formatDate(intern.internship_details.end_date)}
                    </span>
                  </div>
                </div>
                <div className="intern-card-footer">
                  <div className="skills-container">
                    {renderSkillBadges(
                      intern.skills_preferences.technical_skills.slice(0, 3)
                    )}
                    {intern.skills_preferences.technical_skills.length > 3 && (
                      <span className="more-skills">
                        +{intern.skills_preferences.technical_skills.length - 3} more
                      </span>
                    )}
                  </div>
                  <button className="view-details-button">
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="table-responsive">
          {filteredInterns.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No interns found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button className="reset-button" onClick={resetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <table className="interns-table">
              <thead>
                <tr>
                  <th onClick={() => {
                    handleFilterChange("sortBy", "name");
                    handleFilterChange("sortOrder", filters.sortOrder === "asc" && filters.sortBy === "name" ? "desc" : "asc");
                  }}>
                    Name
                    {filters.sortBy === "name" && (
                      <span className="sort-indicator">
                        {filters.sortOrder === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </th>
                  <th>Domain</th>
                  <th>Education</th>
                  <th onClick={() => {
                    handleFilterChange("sortBy", "startDate");
                    handleFilterChange("sortOrder", filters.sortOrder === "asc" && filters.sortBy === "startDate" ? "desc" : "asc");
                  }}>
                    Start Date
                    {filters.sortBy === "startDate" && (
                      <span className="sort-indicator">
                        {filters.sortOrder === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </th>
                  <th>Duration</th>
                  <th>Mode</th>
                  <th>Work Timing</th>
                  <th onClick={() => {
                    handleFilterChange("sortBy", "stipend");
                    handleFilterChange("sortOrder", filters.sortOrder === "asc" && filters.sortBy === "stipend" ? "desc" : "asc");
                  }}>
                    Stipend
                    {filters.sortBy === "stipend" && (
                      <span className="sort-indicator">
                        {filters.sortOrder === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInterns.map((intern) => (
                  <tr key={intern._id}>
                    <td>
                      <div className="intern-name-cell">
                        <div className="table-initial">
                          {intern.personal_details.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="intern-name">
                            {intern.personal_details.full_name}
                          </div>
                          <div className="intern-email">
                            {intern.personal_details.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{intern.Domain}</td>
                    <td>
                      <div>{intern.educational_details.degree}</div>
                      <div className="secondary-text">
                        {intern.educational_details.institution_name}
                      </div>
                    </td>
                    <td>{formatDate(intern.internship_details.start_date)}</td>
                    <td>{intern.internship_details.duration_months} months</td>
                    <td>
                      <span className={`mode-badge ${intern.internship_details.mode.toLowerCase()}`}>
                        {intern.internship_details.mode}
                      </span>
                    </td>
                    <td>{intern.internship_details.work_timings}</td>
                    <td>
                      {intern.internship_details.stipend.amount > 0
                        ? `${intern.internship_details.stipend.amount} ${intern.internship_details.stipend.currency}`
                        : "Unpaid"}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="view-button"
                          onClick={() => handleInternSelected(intern._id)}
                        >
                          View
                        </button>
                        <button className="edit-button">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default InternDashboard;