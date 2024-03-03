import axios from "axios";

const API_URL = 'https://api.developbetterapps.com/';

export const login = async (userId: string, password: string) => {
  
  try{
    return await axios.post(`${API_URL}/auth`, {userId, password});
  }catch (e){
    return {error: true, msg: (e as any).response.data.msg};
    
  }
};
