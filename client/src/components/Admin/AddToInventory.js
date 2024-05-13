import { Text, Select, Input, Button, Modal, ModalBody, ModalOverlay, ModalContent, ModalCloseButton, ModalFooter, ModalHeader, useDisclosure, FormLabel, FormControl, useToast, Spinner } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";

const AddToInventory = () => {
    const toast = useToast();
    const idRef = useRef("");
    const typeRef = useRef("");
    const mileMeterRef = useRef("");
    const numberPlateRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const carModels = useSelector(state => state.admin.cars);
    const addCarHandler = async event => {
        try {
            event.preventDefault();
            setIsLoading(true);
            const data = {
                carId: idRef.current.value,
                carType: typeRef.current.value,
                numberPlate: numberPlateRef.current.value,
                mileMeterReading: mileMeterRef.current.value
            };
            const result = await fetch("http://localhost:3000/cars/", {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("adminToken")
                }
            });
            const res = await result.json();
            setIsLoading(false);
            onClose();
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
            <Button colorScheme = "teal" size = "sm" borderRadius = "4px" onClick = {onOpen}>Add Car</Button>
            <Modal isOpen = {isOpen} onClose = {onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Add Car</ModalHeader>
                    <ModalCloseButton/>
                    <Text mb = "15px" px = "22px" fontSize = "16px">Enter the details of the car</Text>
                    <ModalBody>
                        <form>
                            <FormControl mb = "25px" isRequired = {true}>
                                <FormLabel>CarName</FormLabel>
                                <Select ref = {idRef} focusBorderColor = "teal.400" mb = "25px" placeholder = "Select Name" border = "1px solid" borderColor = "gray.200">
                                    {carModels.map(model => <option key = {model.carid} value = {model.carid}>{model.carname}</option>)}
                                </Select>
                            </FormControl>
                            <FormControl mb = "25px" isRequired = {true}>
                                <FormLabel>Number Plate</FormLabel>
                                <Input ref = {numberPlateRef} type = "text" focusBorderColor = "teal.400"/>
                            </FormControl>
                            <FormControl mb = "25px" isRequired = {true}>
                                <FormLabel>Current Milemeter</FormLabel>
                                <Input ref = {mileMeterRef} type = "number" focusBorderColor = "teal.400"/>
                            </FormControl>
                            <FormControl mb = "30px" isRequired = {true}>
                                <FormLabel>Car Type</FormLabel>
                                <Select ref = {typeRef} focusBorderColor = "teal.400" mb = "25px" placeholder = "Select Type" border = "1px solid" borderColor = "gray.200">
                                    <option value = "AC">AC</option>
                                    <option value = "NONAC">NON-AC</option>
                                </Select>
                            </FormControl>
                            <Button onClick = {addCarHandler} type = "submit" width = "100%" colorScheme = "teal">{isLoading ? <Spinner/> : "Submit"}</Button>
                        </form>
                    </ModalBody>
                    <ModalFooter>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddToInventory;