import React, { useEffect, useState } from "react";
import { IUser } from "./types";

export const AppContext = React.createContext<{ 
    authLoading: boolean
    authState: IUser | null, 
    setAuthState: React.Dispatch<React.SetStateAction<IUser | null>> ,
    setAuthLoading: (value: React.SetStateAction<boolean>) => void
}>({
    authLoading : true,
    authState: null,
    setAuthState: ()=>{},
    setAuthLoading: ()=>{}
})

//@ts-ignore
export const AppContextProvider = ({ children }) => {
    const [authState, setAuthState] = useState<IUser | null>(null)
    const [authLoading, setAuthLoading] = useState<boolean>(true)
    
    useEffect(()=>{
        setAuthLoading(true)
        fetch(`${import.meta.env.VITE_API_URL}/`,{
            credentials : 'include',
        })
            .then((res)=>res.json())
            .then((data)=>{
                if(data && data.user && data.user._id){
                    setAuthState(data.user)
                }else{
                    setAuthState(null)
                }
            })
            .finally(()=>{
                setAuthLoading(false)
            })
    },[])

    return (
        <AppContext.Provider value={{ authState, setAuthState, authLoading, setAuthLoading }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext