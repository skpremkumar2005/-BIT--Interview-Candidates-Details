import React from 'react'
import "./TP.css"; // Import CSS
const Ps = () => {
  const [data, setData] = useState([]); // Store user data
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const navigate = useNavigate(); // Get the navigate function to redirect

  // Fetch users data from the backend when the component mounts
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:3000/admin/t&p/", { timeout: 10000 })
      .then((res) => {
        setData(res.data); // Store fetched data
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setIsLoading(false);
        setErrorMessage("Error fetching data.");
      });
  }, []);

  // Navigate to the user's detail page when a row is clicked
  const handleRowClick = (id) => {
    navigate(`/user/tp/${id}`); // Redirect to the user detail page
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Interns Portal</h2>
        <ul>
          <li><a href="/home">Dashboard</a></li>
          <li><a href="/domains">Domains</a></li>
          <li><a href="/add-intern">Add Intern</a></li>
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
                <th>Age</th>
                <th>Domain</th>
                <th>Education</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(item._id)}
                  className="clickable-row"
                >
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.age}</td>
                  <td>{item.domain}</td>
                  <td>{item.education}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No data available</p>
        )}
      </div>
    </div>
  );
}

export default Ps