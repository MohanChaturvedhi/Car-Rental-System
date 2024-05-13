import { Spinner, Text, IconButton, Menu, MenuButton, MenuList, MenuItem, Image, AspectRatio, ModalFooter, Center, ModalCloseButton, ModalBody, useDisclosure, ModalContent, ModalHeader, Modal, ModalOverlay, Button, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, Hide, Badge, useToast } from '@chakra-ui/react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminActions } from '../../Store';
import AddToInventory from "./AddToInventory.js";

const OptionButton = props => {
    const toast = useToast();
    const dispatch = useDispatch();
    const badgeColors = new Map();
    badgeColors.set("rented", "red");
    badgeColors.set("available", "green");
    badgeColors.set("repaired", "yellow");
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const sellHandler = async () => {
        try {
            setIsLoading(true);
            const result = await fetch(`http://localhost:3000/admin/${props.details.numberplate}/sell`, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("adminToken")
                }
            });
            const res = await result.json();
            if(res.status === "success") {
                dispatch(adminActions.removeInventory(props.details.numberplate));
                onClose();
            }
            toast({
                position: "top",
                title: res.title,
                description: res.info,
                status: res.status,
                duration: 10000,
                isClosable: true,
            });
            setIsLoading(false);
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
    const repairHandler = async () => {
        try {
            setIsLoading(true);
            const result = await fetch(`http://localhost:3000/admin/${props.details.numberplate}/repair`, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("adminToken")
                }
            });
            const res = await result.json();
            if(res.status === "success") {
                dispatch(adminActions.repairInventory(props.details.numberplate));
                onClose();
            }
            toast({
                position: "top",
                title: res.title,
                description: res.info,
                status: res.status,
                duration: 10000,
                isClosable: true,
            });
            setIsLoading(false);
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
    const retrieveHandler = async () => {
        try {
            setIsLoading(true);
            const result = await fetch(`http://localhost:3000/admin/${props.details.numberplate}/retrieve`, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("adminToken")
                }
            });
            const res = await result.json();
            if(res.status === "success") {
                dispatch(adminActions.retrieveInventory({ 
                    numberplate: props.details.numberplate, 
                    cost: parseInt(res.data)
                }));
                onClose();
            }
            toast({
                position: "top",
                title: res.title,
                description: res.info,
                status: res.status,
                duration: 10000,
                isClosable: true,
            });
            setIsLoading(false);
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
                                        <Td pl = "30px" textAlign = "left">Car Name</Td>
                                        <Td pr = "30px" textAlign = "right">{props.details.carname}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">Car ID</Td>
                                        <Td pr = "30px" textAlign = "right">{props.details.carid}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">Number Plate</Td>
                                        <Td pr = "30px" textAlign = "right">{props.details.numberplate}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">Car Type</Td>
                                        <Td pr = "30px" textAlign = "right">{props.details.cartype}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">Car Status</Td>
                                        <Td pr = "30px" textAlign = "right"><Badge variant = "solid" colorScheme = {badgeColors.get(props.details.carstatus)}>{props.details.carstatus}</Badge></Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">Price</Td>
                                        <Td pr = "30px" textAlign = "right">₹{props.details.price}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">Base Amount</Td>
                                        <Td pr = "30px" textAlign = "right">₹{props.details.baseamount}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">₹/km</Td>
                                        <Td pr = "30px" textAlign = "right">₹{props.details.rupeeperkm}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">₹/hr</Td>
                                        <Td pr = "30px" textAlign = "right">₹{props.details.rupeeperhour}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">Maintainence</Td>
                                        <Td pr = "30px" textAlign = "right">₹{props.details.maintainenceexpense}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">Revenue Earned</Td>
                                        <Td pr = "30px" textAlign = "right">₹{props.details.revenueearned}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">Demand</Td>
                                        <Td pr = "30px" textAlign = "right">{props.details.demand}%</Td>
                                    </Tr>
                                    <Tr>
                                        <Td pl = "30px" textAlign = "left">Gas Consumed</Td>
                                        <Td pr = "30px" textAlign = "right">{props.details.totalgasconsumed}L</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </ModalBody>
                    <ModalFooter>
                        {
                            props.details.carstatus === "available" ?
                                <>
                                    <Button onClick = {sellHandler} colorScheme = "teal" mr = "10px">{isLoading ? <Spinner/> : "Sell Car"}</Button>
                                    <Button onClick = {repairHandler} colorScheme = "teal">{isLoading ? <Spinner/> : "Repair Car"}</Button>
                                </>
                                :
                                props.details.carstatus === "repaired" ? 
                                    <>
                                        <Button onClick = {retrieveHandler} colorScheme = "teal">{isLoading ? <Spinner/> : "Retrieve Car"}</Button>
                                    </>
                                    :
                                    ""
                        }
                        
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

const InventoryDetails = () => {
    const dispatch = useDispatch();
    const badgeColors = new Map();
    badgeColors.set("rented", "red");
    badgeColors.set("repaired", "yellow");
    badgeColors.set("available", "green");
    const inventory = useSelector(state => state.admin.inventory);
    return (
        <>
            <AddToInventory/>
            <Menu>
                <MenuButton size = "sm" position = "relative" left = "calc(100% - 120px)" as={IconButton} aria-label='Options' icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>} variant='outline'/>
                <MenuList>
                    <Text textAlign = "center" py = "5px">Sort by</Text>
                    <MenuItem onClick = {() => { dispatch(adminActions.sortInventoryOnCarId()) }}>Model</MenuItem>
                    <MenuItem onClick = {() => { dispatch(adminActions.sortInventoryOnAvailablity()) }}>Status</MenuItem>
                    <MenuItem onClick = {() => { dispatch(adminActions.sortInventoryOnRevenueEarned()) }}>Revenue Earned</MenuItem>
                    <MenuItem onClick = {() => { dispatch(adminActions.sortInventoryOnDemand()) }}>Demand</MenuItem>
                </MenuList>
            </Menu>
            <TableContainer mt = "30px">
                <Table variant = "simple">
                    <Thead>
                        <Tr>
                            <Th textAlign = "center">Number Plate</Th>
                            <Hide below = "600px"><Th textAlign = "center">Name</Th></Hide>
                            <Hide below = "750px"><Th textAlign = "center">Revenue Earned</Th></Hide>
                            <Hide below = "850px"><Th textAlign = "center">Demand</Th></Hide>
                            <Hide below = "420px"><Th textAlign = "center">Status</Th></Hide>
                            <Th textAlign = "center">Options</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            inventory.map((item, i) =>
                                <Tr key = {i}>
                                    <Td textAlign = "center">{item.numberplate}</Td>
                                    <Hide below = "600px"><Td textAlign = "center">{item.carname}</Td></Hide>
                                    <Hide below = "750px"><Td textAlign = "center">₹{item.revenueearned}</Td></Hide>
                                    <Hide below = "850px"><Td textAlign = "center">{item.demand}%</Td></Hide>
                                    <Hide below = "420px">
                                        <Td textAlign = "center">
                                            <Badge variant = "solid" colorScheme = {badgeColors.get(item.carstatus)}>{item.carstatus}</Badge>
                                        </Td>
                                    </Hide>
                                    <Td textAlign = "center"><OptionButton details = {item}/></Td>
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

export default InventoryDetails;