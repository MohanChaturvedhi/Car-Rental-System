import { Flex, Box, Text } from "@chakra-ui/react";

const VerificationSuccess = props => {
    return (
        <Flex justifyContent="center" alignItems="center" width="100%" height="calc(30vh - 55px)" position={["relative"]} top = {["50px", "50px", "50px"]}>    
            <Box width = "90%" maxW = "500px">
                <Text textAlign="center" fontWeight={["bold","bold","bold"]} fontSize={["40px","40px","40px"]} color="#39424e" position="relative" top="-20px">{props.title}</Text>
                <Text textAlign="center">{props.info}</Text>
            </Box>
        </Flex>
    )
}

export default VerificationSuccess;