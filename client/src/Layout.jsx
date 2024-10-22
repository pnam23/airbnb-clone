import Header  from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout(){
    return(
        <div className="flex flex-col min-h-screen p-4">
            <Header />
            <Outlet />
        </div>
    );
}