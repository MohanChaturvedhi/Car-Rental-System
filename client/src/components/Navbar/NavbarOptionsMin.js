import { Show, Flex, Center, Menu, MenuButton, MenuList, MenuItem, useToast } from "@chakra-ui/react";
import SigninFormMin from "./SigninFormMin";
import { useDispatch, useSelector } from "react-redux";
import { UIActions } from "../../Store";
import SignupFormMin from "./SignupFormMin";
import { Route, useLocation, Link, useHistory } from "react-router-dom";
import { userActions } from "../../Store";

const NavbarOptionsMin = () => {
    const toast = useToast();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const logoutHandler = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        localStorage.removeItem("datejoined");
        history.push("/");
        dispatch(userActions.handleAuthState());
        toast({
            position: "top",
            title: "Success",
            description: "Logout Successful",
            status: "success",
            duration: 10000,
            isClosable: true,
        });
    }
    return (
        <Show below = "lg">
            <Flex width = {[location.pathname === "/" ? "120px" : "60px", "60px", "60px", "60px"]}>
                <Show below = "sm">
                    <Route path = "/" exact>
                        <Center onClick = {() => { dispatch(UIActions.toggleSearchBar()) }} cursor = "pointer" width = "60px" height = "60px">
                            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </Center>
                    </Route>
                </Show>
                <Center width = "60px" height = "60px">
                    <Menu>
                        <MenuButton>
                            <svg width="17" height="17" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        </MenuButton>
                        <MenuList>
                            <Link to = "/"><MenuItem>Home</MenuItem></Link>
                            <Link to = "/about"><MenuItem>About</MenuItem></Link>
                            {isLoggedIn && <Link to = "/profile"><MenuItem>Profile</MenuItem></Link>}
                            {!isLoggedIn && <MenuItem><SigninFormMin/></MenuItem>}
                            {!isLoggedIn && <MenuItem><SignupFormMin/></MenuItem>}
                            {isLoggedIn && <MenuItem onClick = {logoutHandler}>Logout</MenuItem>}
                        </MenuList>
                    </Menu>
                </Center>
            </Flex>
        </Show>
    )
}

export default NavbarOptionsMin;