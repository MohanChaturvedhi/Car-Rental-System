import { Box, Flex, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import ChangeProfileForm from "./ChangeProfileForm";
import RechargeBalance from "./RechargeBalance";

const ProfileCard = () => {
    const userData = useSelector(state => state.user);
    return (
        <Flex position = "relative" borderWidth = "1px" borderRadius = "5px" shadow = "md" flexDirection = {["column"]} width = {["100%", "100%", "758px"]} height = {["150px"]}>
            <Text width = "250px" overflow = "hidden" height = "35px" position = "relative" top = "15px" left = "15px" fontWeight = "700" fontSize = "21px">{userData.name}</Text>
            <Text width = "fit-content" position = "relative" top = "20px" left = "15px" fontSize = "15px">{userData.email}</Text>
            <Text width = "fit-content" position = "relative" top = "35px" left = "15px" fontWeight = "100" fontSize = "14px">Joined on {userData.dateJoined}</Text>
            <Text width = "fit-content" position = "relative" top = "40px" left = "15px" fontWeight = "100" fontSize = "14px">Balance: {userData.balance}</Text>
            <Box width = "fit-content" height = "fit-content" position = "absolute" right={["20px", "20px"]} top="105px">
                <RechargeBalance/>
            </Box>
            <Box width = "fit-content" height = "fit-content" position = "absolute" right={["20px", "20px"]} top="20px">
                <ChangeProfileForm/>
            </Box>
        </Flex>
    );
}

export default ProfileCard;