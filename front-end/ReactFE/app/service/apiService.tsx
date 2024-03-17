import axios from "axios";

const API_URL = 'https://api.developbetterapps.com/';

export const login = async (userId: string, password: string) => {
  
  try{
    return await axios.post(`${API_URL}/auth`, {userId, password});
  }catch (e){
    return {error: true, msg: (e as any).response.data.msg};
    
  }
};

export const signUp = async (email, password, clinic, agreeToEthics) => {
  try {
    const response = await fetch(`${API_URL}/api/register`, {
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
