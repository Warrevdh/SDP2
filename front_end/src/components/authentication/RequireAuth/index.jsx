import { UserContext } from "../../../context/UserProvider";

import { Navigate } from "react-router";
import { useContext } from "react";

export default function RequireAuth({ children }) {
    const { user } = useContext(UserContext);
    
    if (user) {
        return children;
    }

    return <Navigate to="/profile" />; 
}