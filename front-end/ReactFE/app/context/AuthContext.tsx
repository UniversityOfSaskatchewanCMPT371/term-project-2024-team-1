import React from 'react';
import { createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
    authState?: {token: string | null; authenticated: boolean | null};
    onLogin?: (userId: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'casi-jwt';
export const API_URL = 'https://api.developbetterapps.com/';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}: any) =>{
    const [authState, setAuthState] = useState<{
        token: string | null; 
        authenticated: boolean | null;
        // add user info here whose type is a User Interface with all the fields 
    }>({
        token: null,
        authenticated: null
    })


    useEffect(()=>{
        const loadToken = async () =>{
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            
            if(token){
                setAuthState({
                token: token, 
                authenticated: true
            })
        
        }
        }
        loadToken();
    }, [])

    const login = async (userId: string, password: string) => {
        try{
           const result =  await axios.post(`${API_URL}/auth`, {userId, password});

           setAuthState({
            token: result.data.token,
            authenticated: true
           });

           // ensuring that subsequent requests made with Axios include the token in the header
           axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

           await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
           // prolly need to add SecureStore.setItemAsync(UserInfo, result.data.userInfo)? 
           return result;

        }catch(e){
            return {error: true, msg: (e as any).response.data.msg};
        }
    }

    const logout = async() =>{
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        axios.defaults.headers.common['Authorization'] = "";

        setAuthState({
            token: null, 
            authenticated: false
        });
    };


    const value = {
        onLogin: login,
        onLogout: logout, 
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}