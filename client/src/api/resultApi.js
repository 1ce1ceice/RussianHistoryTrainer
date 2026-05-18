const API_URL = 'http://localhost:5001/api';

export const saveResult = async (token, resultData) => {
  const response = await fetch(`${API_URL}/results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(resultData),
  });

  return response.json();
};

export const getMyResults = async (token) => {
  const response = await fetch(`${API_URL}/results/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};