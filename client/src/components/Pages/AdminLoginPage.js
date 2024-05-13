import { Flex, Text } from "@chakra-ui/react";
import AdminLoginForm from "../Admin/AdminLoginForm";

const AdminLoginPage = () => {
    return (
        <Flex flexDirection = "column" alignItems = "center" width = "100%" height = "100vh">
            <Text fontSize = {["35px"]} fontWeight = "bold" color = "#39424e" position = "relative" top = {["50px"]}>Car Rental System</Text>
            <Text fontSize = {["20px"]} color = "#39424e" position = "relative" top = {["60px"]}>Enter the admin access key</Text>
            <Flex px = "10px" py = "15px" flexDir = "column" width = "90%" maxW = {["100%", "400px"]} height = "170px" shadow = "md" position = "relative" top = "100px" border = "1px solid #e2e8f0">
                <AdminLoginForm/>
            </Flex>
        </Flex>
    )
}

export default AdminLoginPage;