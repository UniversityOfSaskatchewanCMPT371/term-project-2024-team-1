
// const BASE_URL = ''; insert back end express server url

export const signUp = async (email, password, clinic, agreeToEthics) => {
  try {
    const response = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        clinic,
        agreeToEthics,
      }),
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // use this to return success,jwt,or failure 
  } catch (error) {
    throw new Error(`Network error: ${error.message}`);
  }
};
