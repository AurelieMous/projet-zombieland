import {Outlet} from "react-router";
import Header from "../../components/layout/Header";
import "../../index.css";
import LateralBar from "../../components/layout/LateralBar";
import Footer from "../component/footer.tsx";

export default function RootPage(){

    return (
        <>
            <Header/>
            <LateralBar/>
            <Outlet/>
            <Footer/>
        </>
    )
}