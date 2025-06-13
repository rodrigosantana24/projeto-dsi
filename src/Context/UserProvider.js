import React , {createContext,useState}from "react";

export const UserContext = createContext({
    userCredentials : null,
    setUserCredentials: () => {}
})

export const UserProvider = ({children}) => {
    const [userCredentials, setUserCredentials] = useState(null);

    return  (
        <UserContext.Provider value={{userCredentials,setUserCredentials}}>
            {children}
        </UserContext.Provider>
    )

}