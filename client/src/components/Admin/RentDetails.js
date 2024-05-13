import { Image, AspectRatio, ModalFooter, Center, ModalCloseButton, ModalBody, useDisclosure, ModalContent, ModalHeader, Modal, ModalOverlay, Button, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, Hide, Badge } from '@chakra-ui/react'
import { useSelector } from 'react-redux';
import ReturnCarButton from './ReturnCarButton';

const badgeColors = new Map();
badgeColors.set("active", "green");
badgeColors.set("returned", "yellow");
badgeColors.set("requestedToReturn", "blue");

const OptionButton = props => {
    const badgeColors = new Map();
    badgeColors.set("active", "green");
    badgeColors.set("returned", "yellow");
    badgeColors.set("requestedToReturn", "blue");
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button variant = "outline" colorScheme = "teal" size = "sm" borderRadius = "4px" onClick = {onOpen}>Details</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent width = "95%">
                    <ModalHeader>Rent Details</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody px = "0">
                        <Center>
                            <AspectRatio width = "70%" ratio = {16 / 9}>
                                <Image src = {props.details.imagelink} objectFit = "cover"></Image>
                            </AspectRatio>
                        </Center>
                        <TableContainer width = "100%">
                            <Table variant='simple'>
                                <Tbody>
                                    <Tr>
                                        <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">User Name</Td>
                                        <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">{props.details.username}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Email</Td>
                                        <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">{props.details.email}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Car Name</Td>
                                        <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">{props.details.carname}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Car ID</Td>
                                        <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">{props.details.carid}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Number Plate</Td>
                                        <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">{props.details.numberplate}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Rent Status</Td>
                                        <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right"><Badge variant = "solid" colorScheme = {badgeColors.get(props.details.rentstatus)}>{props.details.rentstatus}</Badge></Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Car Type</Td>
                                        <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">{props.details.cartype}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Base Amount</Td>
                                        <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">₹{props.details.cartype === "AC" ? props.details.baseamount * 1.5 : props.details.baseamount}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">₹/km</Td>
                                        <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">₹{props.details.cartype === "AC" ? props.details.rupeeperkm * 1.5 : props.details.rupeeperkm}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">₹/hr</Td>
                                        <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">₹{props.details.cartype === "AC" ? props.details.rupeeperhour * 1.5 : props.details.rupeeperhour}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Rented On</Td>
                                        <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">{props.details.rentedon}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Expected Return</Td>
                                        <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">{props.details.expectedreturn}</Td>
                                    </Tr>
                                    {   
                                        props.details.rentstatus === "returned" && 
                                        <Tr>
                                            <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Returned On</Td>
                                            <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">{props.details.returnedon}</Td>
                                        </Tr>
                                    } 
                                    <Tr>
                                        <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Milemeter Start</Td>
                                        <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">{props.details.milemeterstart}Km</Td>
                                    </Tr>
                                    {   
                                        props.details.rentstatus === "returned" && 
                                        <Tr>
                                            <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Milemeter End</Td>
                                            <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">{props.details.milemeterend}Km</Td>
                                        </Tr>
                                    } 
                                    {   
                                        props.details.rentstatus === "returned" && 
                                        <Tr>
                                            <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Amount Paid</Td>
                                            <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">₹{props.details.amountpaid}</Td>
                                        </Tr>
                                    }
                                    {   
                                        props.details.rentstatus === "returned" && 
                                        <Tr>
                                            <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Amount Refunded</Td>
                                            <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">₹{props.details.amountrefunded}</Td>
                                        </Tr>
                                    }
                                    {   
                                        props.details.rentstatus === "returned" && 
                                        <Tr>
                                            <Td pl = {["10px", "30px"]} pr = "0px" textAlign = "left">Gas Consumed</Td>
                                            <Td pr = {["10px", "30px"]} pl = "0px" textAlign = "right">{props.details.gasconsumed}L</Td>
                                        </Tr>
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </ModalBody>
                    <ModalFooter>
                        {props.details.rentstatus === "requestedToReturn" && <ReturnCarButton details = {props.details} onClose = {onClose}/>}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

const RentDetails = () => {
    const rents = useSelector(state => state.admin.rents);
    return (
        <>
            <TableContainer>
                <Table variant = "simple">
                    <Thead>
                        <Tr>
                            <Th textAlign = "center">User Name</Th>
                            <Hide below = "570px"><Th textAlign = "center">Car Name</Th></Hide>
                            <Hide below = "650px"><Th textAlign = "center">Number Plate</Th></Hide>
                            <Hide below = "750px"><Th textAlign = "center">Rented On</Th></Hide>
                            <Hide below = "900px"><Th textAlign = "center">Expected Return</Th></Hide>
                            <Hide below = "1050px"><Th textAlign = "center">Rent Status</Th></Hide>
                            <Th textAlign = "center">Options</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            rents.map(rent => 
                                <Tr key = {rent.rentid}>
                                    <Td textAlign = "center">{rent.username}</Td>
                                    <Hide below = "570px"><Td textAlign = "center">{rent.carname}</Td></Hide>
                                    <Hide below = "650px"><Td textAlign = "center">{rent.numberplate}</Td></Hide>
                                    <Hide below = "750px"><Td textAlign = "center">{rent.rentedon}</Td></Hide>
                                    <Hide below = "900px"><Td textAlign = "center">{rent.expectedreturn}</Td></Hide>
                                    <Hide below = "1050px"><Td textAlign = "center"><Badge variant = "solid" colorScheme = {badgeColors.get(rent.rentstatus)}>{rent.rentstatus}</Badge></Td></Hide>
                                    <Td textAlign = "center">
                                        <OptionButton details = {rent}/>
                                    </Td>
                                </Tr>
                            )
                        }
                    </Tbody>
                    <Tfoot>

                    </Tfoot>
                </Table>
            </TableContainer>
        </>
    )
}

export default RentDetails;