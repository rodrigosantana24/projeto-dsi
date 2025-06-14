import { useEffect,useState } from 'react';
import getUser from '../services/getUser';


export default function useUser(uid){
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        async function fetchUser(){
            setLoading(true)
            const userData = await getUser(uid)
            if(userData){
                setUsuario(userData)   
            }
            setLoading(false)
        }
    fetchUser()
    },[])
    return {usuario,loading}

}