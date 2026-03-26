import { useState } from "react";
import DDLogoFull from "../../assets/DDLogoFull.png";
import Button from "./button";
import {
    Menu,
    X
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {

    let [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();


    const handleClick = () => {
        navigate("/register")
    }

    return (
        <header className="my-container sticky top-0 border-b border-gray-200 py-3 bg-white z-10">
            <div className="flex justify-between items-center">
                <div>
                    <Link to="/"><img src={DDLogoFull} className="w-30 sm:w-32 md:w-34 lg:w-36" alt="" /></Link>
                </div>
                <nav className="hidden md:flex">
                    <ul className="text-sm font-semibold text-gray-500 flex gap-10">
                        <li><NavLink className="hover:text-primary duration-300" >Features</NavLink></li>
                        <li><NavLink className="hover:text-primary duration-300" >Solutions</NavLink></li>
                        <li><NavLink className="hover:text-primary duration-300" >Pricing</NavLink></li>
                        <li><NavLink className="hover:text-primary duration-300" >AboutUs</NavLink></li>
                    </ul>
                </nav>
                <div className="">
                    <div className="hidden md:flex flex-row items-center gap-5">
                        <Link to="/login" className="text-sm font-semibold text-gray-500 hover:text-primary duration-300" >Login</Link>
                        <Button onClick={handleClick} className="px-4 py-2 bg-primary hover:bg-hover-primary text-white text-sm cursor-pointer duration-300">Get Started</Button>
                    </div>
                    {/* Mobile toggle */}
                    <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(v => !v)}>
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="md:hidden absolute left-0 w-full bg-white/70 backdrop-blur-md shadow-lg p-5 z-50 transform transition-all duration-300 ease-out">
                    <nav>
                        <ul className="flex flex-col items-center text-sm font-semibold text-gray-500 gap-10">
                            <li><NavLink>Features</NavLink></li>
                            <li><NavLink>Solutions</NavLink></li>
                            <li><NavLink>Pricing</NavLink></li>
                            <li><NavLink>AboutUs</NavLink></li>
                        </ul>
                    </nav>
                    <div className="">
                        <div className="flex flex-col gap-2 items-center mt-10">
                            <Link to="/login" className="px-4 py-2 w-full text-sm border text-gray-500">Login</Link>
                            <Button className="px-4 py-2 bg-primary hover:bg-hover-primary text-white text-sm w-full">Get Started</Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar