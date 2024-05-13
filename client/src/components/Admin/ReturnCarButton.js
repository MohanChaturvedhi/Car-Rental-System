import { Input, Button, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, useToast, Spinner } from '@chakra-ui/react'
import { useState, useRef } from 'react';

const ReturnCarButton = props => {
    const toast = useToast();
    const gasConsumedRef = useRef("");
    const mileMeterEndRef = useRef("");
    const refundAmountRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const submitHandler = async event => {
        try {
            setIsLoading(true);
            event.preventDefault();
            const data = {
                rentId: props.details.rentid,
                mileMeterEnd: mileMeterEndRef.current.value,
                gasConsumed: gasConsumedRef.current.value,
                refundAmount: refundAmountRef.current.value,
                mileMeterStart: props.details.milemeterstart,
                baseAmount: (props.details.cartype === "AC" ? props.details.baseamount * 1.5 : props.details.baseamount)
            }
            const result = await fetch("http://localhost:3000/admin/return", {
                method: "PATCH",
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
            props.onClose();
            toast({
                position: "top",
                title: res.title,
                description: res.info,
                status: res.status,
                duration: 10000,
                isClosable: true,
            });
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
            <Button onClick = {onOpen} colorScheme = "teal">Return Car</Button>
            <Modal isOpen = {isOpen} onClose = {onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <form onSubmit = {submitHandler}>
                        <ModalHeader>Return Car</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <FormControl isRequired = {true} mb = "25px">
                                <FormLabel>Milemeter reading at end <Text fontSize = "13px" position = "relative" top = "-1px" display = "inline">(Should be more than milemeter Start)</Text></FormLabel>
                                <Input ref = {mileMeterEndRef} type = "number" focusBorderColor = "teal.400"/>
                            </FormControl>
                            <FormControl isRequired = {true} mb = "25px">
                                <FormLabel>Gas consumed <Text fontSize = "13px" position = "relative" top = "-1px" display = "inline">(In Liters)</Text></FormLabel>
                                <Input ref = {gasConsumedRef} type = "number" focusBorderColor = "teal.400"/>
                            </FormControl>
                            <FormControl isRequired = {true} mb = "25px">
                                <FormLabel>Refund Amount <Text fontSize = "13px" position = "relative" top = "-1px" display = "inline">(Should be less than base amount)</Text></FormLabel>
                                <Input ref = {refundAmountRef} type = "number" focusBorderColor = "teal.400"/>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button width = "110px" type = "submit" colorScheme = "teal">{isLoading ? <Spinner/> : "Return Car"}</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ReturnCarButton;