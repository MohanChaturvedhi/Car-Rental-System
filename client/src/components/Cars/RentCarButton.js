import { Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, useDisclosure, Input, useToast } from "@chakra-ui/react"
import { useState, useRef } from "react";
import { carActions } from "../../Store";
import { useDispatch } from "react-redux";

const RentCarButton = props => {
    const toast = useToast();
    const dateRef = useRef("");
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const submitHandler = async event => {
        try {
            event.preventDefault();
            setIsLoading(true);
            const data = {
                expectedReturn : dateRef.current.value,
                carId: props.details.carid,
                carType: props.details.cartype
            }
            console.log(data);
            const result = await fetch(`http://localhost:3000/cars/rent`, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("token")
                }
            });
            const res = await result.json();
            if(res.status === "success") {
                dispatch(carActions.clearCar(props.details.carid));
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
    return (
        <>
            <Button variant = "outline" colorScheme = "teal" size = "sm" borderRadius = "4px" onClick = {onOpen}>Rent Car</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <form onSubmit = {submitHandler}>
                    <ModalContent my = "50px" width = "95%">
                        <ModalHeader>Rent Car</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody px = "0">
                            <TableContainer width = "100%">
                                <Table variant='simple'>
                                    <Thead>
                                        <Tr>
                                            <Th textAlign = "center">Car Name</Th>
                                            <Th textAlign = "center">{props.details.carname}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td textAlign = "center">Base Amount</Td>
                                            <Td textAlign = "center">{props.details.cartype === "AC" ? props.details.baseamount * 1.5 : props.details.baseamount}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td textAlign = "center">$/km</Td>
                                            <Td textAlign = "center">{props.details.cartype === "AC" ? props.details.rupeeperkm * 1.5 : props.details.rupeeperkm}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td textAlign = "center">$/hr</Td>
                                            <Td textAlign = "center">{props.details.cartype === "AC" ? props.details.rupeeperhour * 1.5 : props.details.rupeeperhour}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td textAlign = "center">$/(Night Hault)</Td>
                                            <Td textAlign = "center">$150</Td>
                                        </Tr>
                                        <Tr>
                                            <Td textAlign = "center">Type</Td>
                                            <Td textAlign = "center">{props.details.cartype}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td textAlign = "center">Expected Return</Td>
                                            <Td p = "10px" textAlign = "center">
                                                <Input isRequired = {true} ref = {dateRef} size = "sm" focusBorderColor = "teal.400" type = "date"/>
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </ModalBody>
                        <ModalFooter>
                            <Button width = "100%" type = "submit" colorScheme = "teal">{isLoading ? <Spinner/> : `Pay ₹${props.details.cartype === "AC" ? props.details.baseamount * 1.5 : props.details.baseamount}`}</Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    )
}

export default RentCarButton;