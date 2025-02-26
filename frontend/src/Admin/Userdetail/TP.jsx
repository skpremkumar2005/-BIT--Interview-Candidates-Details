import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDetail = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedUser, setUpdatedUser] = useState(null); // To store updated user data
  const navigate = useNavigate(); // To navigate back to the main page after deletion
  const [errorMessage, setErrorMessage] = useState(''); // Error message state


  useEffect(() => {
    // Fetch the user details from the backend
    axios
      .get(`http://localhost:3000/admin/t&p/${id}`)
      .then((res) => {
        setUser(res.data);
        setUpdatedUser(res.data); // Initialize updatedUser with fetched data
        setIsLoading(false);
        setErrorMessage('');
      })
      .catch((err) => {
        console.error('Error fetching user details:', err);
        setIsLoading(false);
        setErrorMessage('Err');
      });
  }, [id]);

  // Handle input change for editing user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  // Handle updating the user
  const handleUpdateUser = () => {
    setIsLoading(true);
    axios
      .put(`http://localhost:3000/admin/t&p/${id}`, updatedUser)
      .then((res) => {
        setUser(res.data); // Update the user data
        setIsLoading(false);
        setErrorMessage('');
      })
      .catch((err) => {
        console.error('Error updating user:', err);
        setIsLoading(false);
        setErrorMessage('same email.');
      });
  };

  // Handle deleting the user
  const handleDeleteUser = () => {
    setIsLoading(true);
    axios
      .delete(`http://localhost:3000/admin/t&p/${id}`)
      .then(() => {
        setIsLoading(false);
        setErrorMessage('');
        navigate('/user/tp'); // Redirect to the main page after deletion
      })
      .catch((err) => {
        console.error('Error deleting user:', err);
        setErrorMessage('Error fetching data.');

        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <h2>User Detail</h2>
      {user ? (
        <div>
          <p><strong>Name:</strong> 
            <input
              type="text"
              name="name"
              value={updatedUser?.name || ''}
              onChange={handleInputChange}
            />
          </p>
          <p><strong>Email:</strong> 
            <input
              type="text"
              name="email"
              value={updatedUser?.email || ''}
              onChange={handleInputChange}
            />
          </p>
          <p><strong>Age:</strong> 
            <input
              type="text"
              name="age"
              value={updatedUser?.age || ''}
              onChange={handleInputChange}
            />
          </p>
          <p><strong>Domain:</strong> 
            <input
              type="text"
              name="domain"
              value={updatedUser?.domain || ''}
              onChange={handleInputChange}
            />
          </p>
          <p><strong>Education:</strong> 
            <input
              type="text"
              name="education"
              value={updatedUser?.education || ''}
              onChange={handleInputChange}
            />
          </p>

          <button onClick={handleUpdateUser} disabled={isLoading || !updatedUser?.name || !updatedUser?.email || !updatedUser?.age || !updatedUser?.domain || !updatedUser?.education}>
            Update User
          </button>

          <button onClick={handleDeleteUser} disabled={isLoading}>
            Delete User
          </button>
        </div>
      ) : (
        <p>User not found</p>
      )}
      <div>  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}</div>
    </div>
  );
};

export default UserDetail;
