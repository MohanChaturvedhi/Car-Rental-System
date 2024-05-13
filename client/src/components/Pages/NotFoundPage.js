import { Flex, Box, Text } from "@chakra-ui/react";

const NotFoundPage = () => {
    return (
        <Flex justifyContent = "center" alignItems = "center" width = "100%" height = "calc(30vh - 55px)" position = "relative" top = "50px">    
            <Box width = "90%" maxW = "500px">
                <Text textAlign = "center" fontWeight = "bold" fontSize = "40px" color = "#39424e" position = "relative" top = "-20px">Error 404 not found</Text>
                <Text textAlign = "center" fontSize = "20px">page not found</Text>
                <Text textAlign = "center" position = "relative" top = "30px">The page you are looking doesn't exist or an error occured</Text>
            </Box>
        </Flex>
    )
}

export default NotFoundPage;