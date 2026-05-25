import React, { useState } from 'react';
import axios from 'axios';

function UploadDocument() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('copyleaks/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Document submitted successfully: ' + response.data);
    } catch (error) {
      if (error.response) {
        setMessage(`Error submitting document: ${error.response.status} ${error.response.statusText}: ${error.response.data || '[no body]'}`);
      } else if (error.request) {
        setMessage('Error submitting document: No response from server');
      } else {
        setMessage(`Error submitting document: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadDocument;
