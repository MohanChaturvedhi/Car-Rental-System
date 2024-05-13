import { useToast, Spinner, ModalBody, Modal, ModalFooter, Button, ModalContent, ModalHeader, ModalCloseButton, useDisclosure, ModalOverlay, AspectRatio, Center, Image, Tfoot, Th, Table, TableContainer, Text, MenuButton, IconButton, MenuList, Menu, MenuItem, Thead, Td, Hide, Tr, Tbody } from "@chakra-ui/react"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { adminActions } from "../../Store";
import AddToCar from "./AddToCar"

const OptionButton = props => {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const removeCarModelHandler = async () => {
        try {
            setIsLoading(true);
            const data = {
                carId: props.details.carid
            };
            const result = await fetch("http://localhost:3000/admin/cars", {
                method: "DELETE",
                mode: "cors",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("adminToken")
                }
            });
            const res = await result.json();
            console.log(res);
            toast({
                position: "top",
                title: res.title,
                description: res.info,
                status: res.status,
                duration: 10000,
                isClosable: true,
            });
            setIsLoading(false);
            onClose();
        } catch(err) {
            toast({
                position: "top",
                title: "Error",
                description: "An error occured, please try again later",
                status: "error",
                duration: 10000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    }
    return (
        <>
            <Button variant = "outline" colorScheme = "teal" size = "sm" borderRadius = "4px" onClick = {onOpen}>Details</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent my = "30px" width = "95%">
                    <ModalHeader>Car Details</ModalHeader>
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
                                        <Td pl = "30px" textAlign = "left">Car ID</Td>
                                        <Td pr = "30px" textAlign = "right">{props.details.carid}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">Car Name</Td>
                                        <Td pr = "30px" textAlign = "right">{props.details.carname}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">Price</Td>
                                        <Td pr = "30px" textAlign = "right">₹{props.details.price}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">Base Amount <Text fontSize = "10px" position = "relative" top = "-1px" display = "inline">(NON-AC)</Text></Td>
                                        <Td pr = "30px" textAlign = "right">₹{props.details.cartype === "AC" ? props.details.baseamount * 1.5 : props.details.baseamount}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">₹/km <Text fontSize = "10px" position = "relative" top = "-1px" display = "inline">(NON-AC)</Text></Td>
                                        <Td pr = "30px" textAlign = "right">₹{props.details.cartype === "AC" ? props.details.rupeeperkm * 1.5 : props.details.rupeeperkm}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">₹/hr <Text fontSize = "10px" position = "relative" top = "-1px" display = "inline">(NON-AC)</Text></Td>
                                        <Td pr = "30px" textAlign = "right">₹{props.details.cartype === "AC" ? props.details.rupeeperhour * 1.5 : props.details.rupeeperhour}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </ModalBody>
                    <ModalFooter>
                        <Button width = "130px" colorScheme = "teal" onClick = {removeCarModelHandler}>{isLoading ? <Spinner/> : "Remove Model"}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

const CarDetails = () => {
    const dispatch = useDispatch();
    const cars = useSelector(state => state.admin.cars);
    return (
        <>
            <AddToCar/>
            <Menu>
                <MenuButton size = "sm" position = "relative" left = "calc(100% - 120px)" as={IconButton} aria-label='Options' icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>} variant='outline'/>
                <MenuList>
                    <Text textAlign = "center" py = "5px">Sort by</Text>
                    <MenuItem onClick = {() => { dispatch(adminActions.sortCarModelsOnId()) }}>Model</MenuItem>
                    <MenuItem onClick = {() => { dispatch(adminActions.sortCarModelsOnPrice()) }}>Price</MenuItem>
                    <MenuItem onClick = {() => { dispatch(adminActions.sortCarModelsOnDemand()) }}>Demand</MenuItem>
                    <MenuItem onClick = {() => { dispatch(adminActions.sortCarModelsOnRevenueEarned()) }}>Revenue Earned</MenuItem>
                </MenuList>
            </Menu>
            <TableContainer mt = "30px">
                <Table variant = "simple">
                    <Thead>
                        <Tr>
                            <Hide below = "1000px"><Th textAlign = "center">ID</Th></Hide>
                            <Hide below = "900px"><Th textAlign = "center">Image</Th></Hide>
                            <Th textAlign = "center">Name</Th>
                            <Hide below = "450px"><Th textAlign = "center">Total Revenue</Th></Hide>
                            <Hide below = "600px"><Th textAlign = "center">Demand</Th></Hide>
                            <Th textAlign = "center">Options</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            cars.map(car => 
                                <Tr key = {car.carid}>
                                    <Hide below = "1000px"><Td textAlign = "center">{car.carid}</Td></Hide>
                                    <Hide below = "900px">
                                        <Td textAlign = "center">
                                            <Center>
                                                <AspectRatio width = "100%" ratio = {16 / 9}>
                                                    <Image src = {car.imagelink} objectFit = "cover"></Image>
                                                </AspectRatio>
                                            </Center>
                                        </Td>
                                    </Hide>
                                    <Td textAlign = "center">{car.carname}</Td>
                                    <Hide below = "450px"><Td textAlign = "center">₹{car.revenueearned}</Td></Hide>
                                    <Hide below = "600px"><Td textAlign = "center">{car.demand}%</Td></Hide>
                                    <Td textAlign = "center"><OptionButton details = {car}/></Td>
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

export default CarDetails;