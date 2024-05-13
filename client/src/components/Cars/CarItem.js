import { AspectRatio, Td, Box, Image, TableContainer, Table, Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import RentCarButton from "./RentCarButton";

const CarItem = props => {
    return (
        <Box 
            p = "10px"
            border = "1px solid"
            borderColor = "#ccc"
            height = "fit-content"
            shadow = {["md", "none"]} 
            my = {["0px", "4px", "10px"]} 
            mb = {["10px", "2px", "10px"]} 
            mx = {["10px", "4px", "10px"]} 
            maxW = {["350px", "450px", "350px", "350px", "400px"]}
            width = {["100%", "calc(50% - 8px)", "calc(50% - 20px)", "calc(50% - 20px)", "calc(25% - 20px)"]}  
        >
            <AspectRatio width = "100%" ratio = {16 / 9}>
                <Image src = {`${props.details.imagelink}`} objectFit = "cover"></Image>
            </AspectRatio>
            <TableContainer>
                <Table variant = 'simple'>
                    <Thead>
                        <Tr>
                            <Th maxWidth = "50px" whiteSpace = "nowrap" overflow= "hidden" textOverflow= "ellipsis" px = "0px" textAlign = "center">Car Name</Th>
                            <Th maxWidth = "50px" whiteSpace = "nowrap" overflow= "hidden" textOverflow= "ellipsis" px = "0px" textAlign = "center">{props.details.carname}</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td px = "0px" textAlign = "center">Base Amount</Td>
                            <Td px = "0px" textAlign = "center">{props.details.cartype === "AC" ? props.details.baseamount * 1.5 : props.details.baseamount}</Td>
                        </Tr>
                        <Tr>
                            <Td px = "0px" textAlign = "center">Type</Td>
                            <Td px = "0px" textAlign = "center">{props.details.cartype}</Td>
                        </Tr>
                        <Tr>
                            <Td px = "0px" textAlign = "center"></Td>
                            <Td px = "0px" textAlign = "center"><RentCarButton details = {props.details}/></Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default CarItem;