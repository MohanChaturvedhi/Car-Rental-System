import { Show, Flex, Button, useToast } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import SigninFormMain from "./SigninFormMain";
import SignupFormMain from "./SignupFormMain";
import { userActions } from "../../Store";

const NavbarOptionsMain = () => {
    const toast = useToast();
    const history = useHistory();
    const dispatch = useDispatch();
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
        <Show above = "lg">
            <Flex justifyContent = "right" alignItems = "center" height = "100%" width = {isLoggedIn ? "370px" : "160px"} pr = {isLoggedIn ? "10px" : "0px"}>
                <Flex position = "relative" left = {isLoggedIn ? "0px" : "20px"} justifyContent = "space-around" alignItems = "center" height = "100%" width = {isLoggedIn ? "340px" : "160px"}>
                    <Link to = "/"><Button backgroundColor = "transparent" fontWeight={400}>Home</Button></Link>
                    <Link to = "/about"><Button backgroundColor = "transparent" fontWeight={400}>About</Button></Link>
                    {isLoggedIn && <Link to = "/profile"><Button backgroundColor = "transparent" fontWeight={400}>Profile</Button></Link>}
                    {isLoggedIn && <Button onClick = {logoutHandler} colorScheme = "teal" fontWeight={400}>Logout</Button>}
                </Flex>
            </Flex>
            {!isLoggedIn && <Flex justifyContent = "space-around" alignItems = "center" height = "100%" width = "170px">
                <SigninFormMain/>
                <SignupFormMain/>
            </Flex>}
        </Show>
    )
}

export default NavbarOptionsMain;