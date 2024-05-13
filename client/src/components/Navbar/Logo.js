import { Center, Text } from "@chakra-ui/react"

const Logo = () => {
    return (
        <Center pl = "5px" width = {["200px", "150px", "200px", "200px"]} height = "100%">
            <Text fontSize = {["20px", "17px", "20px", "20px"]} fontWeight = "300">Car Rental System</Text>
        </Center>
    )
}

export default Logo;