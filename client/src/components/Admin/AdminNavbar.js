import { Button, Flex, useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { adminActions } from "../../Store/index.js";
import AdminLogo from "./AdminLogo.js";

const AdminNavbar = () => {
    const toast = useToast();
    const history = useHistory();
    const dispatch = useDispatch();
    const logoutHandler = () => {
        localStorage.removeItem("adminToken");
        dispatch(adminActions.handleAuthState());
        history.push("/admin");
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
        <Flex zIndex = "2" shadow = "md" borderBottom = "1px solid #ced4da" width = "100%" height = "60px" justifyContent = "space-between" alignItems = "center" position = "sticky" top = "0px" backgroundColor = "white" px = "10px">
            <AdminLogo/>
            <Button onClick = {logoutHandler} colorScheme = "teal">Logout</Button>
        </Flex>
    )
}

export default AdminNavbar;