import React from 'react';
import { createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


interface AuthProps {
    authState?: {userId: string | null, token: string | null};
    onLogin?: (userId: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'casi-jwt';
const IPV4_ADDRESS = "172.16.1.127";
export const API_URL = `http://${IPV4_ADDRESS}:3000/api/login`;
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}: any) =>{
    const [authState, setAuthState] = useState<{
        userId: string | null,
        token: string | null; 

    }>({
        userId: null,
        token: null
    })

    useEffect(()=>{
        const loadToken = async () =>{
            let data = await SecureStore.getItemAsync(TOKEN_KEY);
            const userData = JSON.parse(data);

            if(data){
                setAuthState({
                userId: userData.userId,
                token: userData.accessToken
            })
        }
        }
        loadToken();
    }, [])

    const login = async (userId: string, password: string) => {
        try{
            axios.post(API_URL, {userId, password})
            .then(async (response) => {
                const result = response.data;
                if(result.accessToken){
                    setAuthState({
                        userId: result.userId,
                        token: result.accessToken,
                    });
                    axios.defaults.headers.common['Authorization'] = `Bearer ${result.accessToken}`;
                    await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify({ accessToken: result.accessToken, userId: result.userId }));
                    return result;
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
            token: null
        });
    };


    const value = {
        onLogin: login,
        onLogout: logout, 
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}