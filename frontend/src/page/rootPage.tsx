import {Outlet} from "react-router";
import Header from "../component/header.tsx";

export default function RootPage(){

    return (
        <>
            <Header/>
            <Outlet/>
        </>
    )
}