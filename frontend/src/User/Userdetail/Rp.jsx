import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserDetail = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the user details from the backend
    axios
      .get(`http://localhost:3000/admin/t&p/${id}`)
      .then((res) => {
        setUser(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user details:', err);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <h2>User Detail</h2>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Domain:</strong> {user.domain}</p>
          <p><strong>Education:</strong> {user.education}</p>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserDetail;
