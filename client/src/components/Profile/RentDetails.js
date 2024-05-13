import { Badge, Button, Table, Thead, Tbody, Tr, TableContainer, Modal, Th, Td, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Text, useToast, Spinner } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { userActions } from "../../Store";
import { useEffect, useState } from "react";

const RentDetails = props => {
    const badgeColors = new Map();
    const dispatch = useDispatch();
    badgeColors.set("active", "green");
    badgeColors.set("requestedToReturn", "blue");
    badgeColors.set("returned", "yellow");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const returnCarHandler = async () => {
        try {
            setIsLoading(true);
            const result = await fetch(`http://localhost:3000/cars/return?rentId=${props.details.rentid}`, {
                method: "PATCH",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("token")
                }
            });
            const res = await result.json();
            if(res.status === "info") {
                dispatch(userActions.requestedToReturn(props.details.rentid));
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
    useEffect(() => {
        console.log(props.details.rentstatus);
    }, [props.details.rentstatus]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button onClick = {onOpen} variant = "outline" colorScheme = "teal">Details</Button>
            <Modal isOpen = {isOpen} onClose = {onClose} height = "fit-content">
            <ModalOverlay/>
                <ModalContent width = "90%">
                    <ModalHeader>
                        <Text fontWeight = "400">Rent Details</Text>
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody px = {["0px", "16px"]}>
                        <TableContainer>
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Car Name</Th>
                                        <Th>{props.details.carname}</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>Base Amount</Td>
                                        <Td>{props.details.baseamount}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Date Rented</Td>
                                        <Td>{props.details.rentedon}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Rent status</Td>
                                        <Td><Badge variant = "solid" colorScheme = {badgeColors.get(props.details.rentstatus)}>{props.details.rentstatus}</Badge></Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Expected Return</Td>
                                        <Td>{props.details.expectedreturn}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Per Kilometer Charge</Td>
                                        <Td>₹{props.details.rupeeperkm}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Per Hour Charge</Td>
                                        <Td>₹{props.details.rupeeperhour}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Type</Td>
                                        <Td>{props.details.cartype}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </ModalBody>
                    <ModalFooter>
                        {props.details.rentstatus === "active" && <Button width = "100%" colorScheme = "teal" onClick = {returnCarHandler}>{isLoading ? <Spinner/> : "Return Car"}</Button>}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default RentDetails;