import React from 'react';
import { createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


interface AuthProps {
    authState?: {userId: string | null, role: string | null, token: string | null};
    onLogin?: (userIdEmail: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'casi-jwt';
const IPV4_ADDRESS = "10.237.243.118";
// export const API_URL = `http://${IPV4_ADDRESS}:3000/api/login`;
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}: any) =>{
    const [authState, setAuthState] = useState<{
        userId: string | null,
        role: string | null,
        token: string | null; 

    }>({
        userId: null,
        role: null,
        token: null
    })

    useEffect(()=>{
        const loadToken = async () =>{
            const data = await SecureStore.getItemAsync(TOKEN_KEY);
            const userData = JSON.parse(data);

            if(data){
                setAuthState({
                userId: userData.userId,
                role: userData.role,
                token: userData.accessToken
            })
        }
        }
        loadToken();
    }, [])

    const login = async (userIdEmail: string, password: string) => {
        try{
            axios.post(`http://${IPV4_ADDRESS}:3000/api/login`, {userIdEmail, password})
            .then(async (response) => {
                if(response){ 
                    const result = response.data;
                    if(result.accessToken){
                        setAuthState({
                            userId: result.userId,
                            role: result.role,
                            token: result.accessToken
                        });
                        axios.defaults.headers.common['Authorization'] = `Bearer ${result.accessToken}`;
                        await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify({ accessToken: result.accessToken, role: result.role, userId: result.userId }));
                        return result;
                    }
                }
            })
            .catch(error => {
                alert(error.response.data)
                console.error(error.response.status +": "+ error.response.data);
            });

        }catch(e){
            return {error: true, msg: (e as any).response.data.msg};
        }
    }

    const logout = async() =>{
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        axios.defaults.headers.common['Authorization'] = "";
        setAuthState({
            userId: null,
            role: null,
            token: null
        });
    };

    const signUp = async (email, password, clinic, agreeToEthics) => {
        try {
          const response = await fetch(`http://${IPV4_ADDRESS}:3000/request/signup`, {
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


    const value = {
        onLogin: login,
        onLogout: logout, 
        onSignup: signUp,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}