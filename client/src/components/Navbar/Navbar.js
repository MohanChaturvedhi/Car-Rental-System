import { Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import SearchBarMin from "./SearchBarMin";
import SearchBarMain from "./SearchBarMain";
import NavbarOptionsMain from "./NavbarOptionsMain";
import NavbarOptionsMin from "./NavbarOptionsMin";
import ForgotPasswordModal from "./ForgotpasswordModal";
import { Route } from "react-router-dom";

const Navbar = () => {
    const searchBarOpen = useSelector(state => state.UI.searchBarOpen);
    return (
        <Flex zIndex = "1000" backgroundColor = "white" position = "sticky" top = "0px" shadow = "md" justifyContent = "space-between" alignItems = "center" width = "100%" height = "62px" pb = "2px">
            {!searchBarOpen && <Logo/>}
            <Route path = "/" exact>
                {!searchBarOpen && <SearchBarMain/>}
                {searchBarOpen && <SearchBarMin/>}
            </Route>
            <Route path = "/about" exact>
                <Flex justifyContent = "space-around" alignItems = "center" width = {[0, "calc(100% - 140px - 40px)", "calc(100% - 200px - 60px)", "calc(100% - 600px)"]} height = "60px"></Flex>
            </Route>
            <Route path = "/profile" exact>
                <Flex justifyContent = "space-around" alignItems = "center" width = {[0, "calc(100% - 140px - 40px)", "calc(100% - 200px - 60px)", "calc(100% - 600px)"]} height = "60px"></Flex>
            </Route>
            {!searchBarOpen && <NavbarOptionsMain/>}
            {!searchBarOpen && <NavbarOptionsMin/>}
            <ForgotPasswordModal/>
        </Flex>
    )
}

export default Navbar;