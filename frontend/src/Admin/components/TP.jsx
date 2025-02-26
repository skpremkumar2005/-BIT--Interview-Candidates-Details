import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TP = () => {
  const [data, setData] = useState([]); // Store user data
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    age: '',
    domain: '',
    education: '',
  }); // Form state for adding a new user
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const navigate = useNavigate(); // Get the navigate function to redirect

  // Fetch users data from the backend when the component mounts
  useEffect(() => {
    setIsLoading(true);
    axios
      .get('http://localhost:3000/admin/t&p/', { timeout: 10000 })
      .then((res) => {
        setData(res.data); // Store fetched data
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setIsLoading(false);
        setErrorMessage('Error fetching data.');
      });
  }, []);

  // Handle input change in the form for new user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Handle adding a new user
  const handleAddUser = () => {
    setIsLoading(true);
    axios
      .post('http://localhost:3000/admin/t&p/', newUser)
      .then((res) => {
        if (res.data) {
          setData(res.data); // Add new user to the state
          setNewUser({ name: '', email: '', age: '', domain: '', education: '' }); // Clear the form
          setErrorMessage('');
        } else {
          setErrorMessage('Unexpected response format');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error adding user:', err);
        setErrorMessage('Error adding user.');
        setIsLoading(false);
      });
  };

  // Navigate to the user's detail page when a row is clicked
  const handleRowClick = (id) => {
    navigate(`/admin/tp/${id}`); // Redirect to the user detail page
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {data.length > 0 ? (
            <table>
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
                    style={{ cursor: 'pointer' }}
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
            <p>No data available</p>
          )}

          <div>
            <h3>Add New User</h3>
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
            <input
              type="text"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="age"
              value={newUser.age}
              onChange={handleInputChange}
              placeholder="Age"
            />
            <input
              type="text"
              name="domain"
              value={newUser.domain}
              onChange={handleInputChange}
              placeholder="Domain"
            />
            <input
              type="text"
              name="education"
              value={newUser.education}
              onChange={handleInputChange}
              placeholder="Education"
            />
            <button onClick={handleAddUser} disabled={isLoading || !newUser.name || !newUser.email || !newUser.age || !newUser.domain || !newUser.education}>
              Add User
            </button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default TP;
