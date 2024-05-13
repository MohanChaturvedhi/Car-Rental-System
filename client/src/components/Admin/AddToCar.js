import { Text, Input, Button, Modal, ModalBody, ModalOverlay, ModalContent, ModalCloseButton, ModalFooter, ModalHeader, useDisclosure, FormLabel, FormControl, useToast, Spinner } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux"; 
import { adminActions } from "../../Store";

const AddToCar = () => {
    const toast = useToast();
    const nameRef = useRef("");
    const priceRef = useRef("");
    const dispatch = useDispatch();
    const imageLinkRef = useRef("");
    const baseAmountRef = useRef("");
    const rupeePerKmRef = useRef("");
    const rupeePerHourRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const submitHandler = async event => {
        try {
            setIsLoading(true);
            event.preventDefault();
            const data = {
                carname: nameRef.current.value,
                price: priceRef.current.value,
                baseamount: baseAmountRef.current.value,
                rupeeperkm: rupeePerKmRef.current.value,
                rupeeperhour: rupeePerHourRef.current.value,
                imagelink: imageLinkRef.current.value
            }
            const result = await fetch("http://localhost:3000/admin/cars", {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("adminToken")
                }
            });
            const res = await result.json();
            dispatch(adminActions.addCarModel(data));
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
            <Button colorScheme = "teal" size = "sm" borderRadius = "4px" onClick = {onOpen}>Add Car</Button>
            <Modal isOpen = {isOpen} onClose = {onClose}>
                <ModalOverlay/>
                <ModalContent mt = "20px">
                    <ModalHeader>Add Car</ModalHeader>
                    <ModalCloseButton/>
                    <Text mb = "15px" px = "22px" fontSize = "16px">Enter the details of the car</Text>
                    <ModalBody>
                        <form onSubmit = {submitHandler}>
                            <FormControl mb = "25px" isRequired = {true}>
                                <FormLabel>Car Name</FormLabel>
                                <Input ref = {nameRef} type = "text" focusBorderColor = "teal.400"/>
                            </FormControl>
                            <FormControl mb = "25px" isRequired = {true}>
                                <FormLabel>Price</FormLabel>
                                <Input ref = {priceRef} type = "number" focusBorderColor = "teal.400"/>
                            </FormControl>
                            <FormControl mb = "25px" isRequired = {true}>
                                <FormLabel>Base Amount</FormLabel>
                                <Input ref = {baseAmountRef} type = "number" focusBorderColor = "teal.400"/>
                            </FormControl>
                            <FormControl mb = "25px" isRequired = {true}>
                                <FormLabel>₹/km</FormLabel>
                                <Input ref = {rupeePerKmRef} type = "number" focusBorderColor = "teal.400"/>
                            </FormControl>
                            <FormControl mb = "25px" isRequired = {true}>
                                <FormLabel>₹/hour</FormLabel>
                                <Input ref = {rupeePerHourRef} type = "number" focusBorderColor = "teal.400"/>
                            </FormControl>
                            <FormControl mb = "25px" isRequired = {true}>
                                <FormLabel position = "relative" top = "4px">Image Link</FormLabel>
                                <Input ref = {imageLinkRef} type = "text" focusBorderColor = "teal.400"/>
                            </FormControl>
                            <Button type = "submit" width = "100%" colorScheme = "teal">{isLoading ? <Spinner/> : "Submit"}</Button>
                        </form>
                    </ModalBody>
                    <ModalFooter>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddToCar;