import LoginPage from "@/app/login/page";
import UserLayout from "@/layout/UserLayout";
import { createBrowserRouter } from "react-router-dom";

const route  = createBrowserRouter([
    {
        path : "/",
        element : <UserLayout/>,
        children : [
            {
                path : "/login",
                element : <LoginPage/>
            }
        ]
    }
])

export default route