import { useToast, useDisclosure, Button, FormControl, ModalBody, Input, FormLabel, Text, ModalCloseButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, Spinner } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../../Store";

const RechargeBalance = () => {
    const toast = useToast();
    const balanceRef = useRef("");
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const submitHandler = async event => {
        try {
            setIsLoading(true);
            event.preventDefault();
            const data = {
                balance: balanceRef.current.value
            }
            const result = await fetch("http://localhost:3000/auth/recharge", {
                method: "PATCH",
                mode: "cors",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("token")
                }
            });
            const res = await result.json();
            console.log(res);
            onClose();
            if(res.status === "success") {
                dispatch(userActions.updateBalance(data.balance));
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
            <Button position = "relative" left = "7px" width = "100px" height = "30px" px = "2px" py = "0px" fontSize = "14px" variant = "link" onClick={onOpen} colorScheme = "teal">Add Balance</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent width="95%">
                <ModalHeader>Recharge Balance</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Text fontSize = "14px">Entered amount will be transfered from your bank account (not really)</Text>
                    <form onSubmit = {submitHandler}>
                        <FormControl mt={4}>
                            <FormLabel mb = {4}>Enter Amount</FormLabel>
                            <Input ref = {balanceRef} min = "1" variant="outline" focusBorderColor="teal.400" placeholder="enter username..." type="number"/>
                        </FormControl>
                        <FormControl mt={6}>
                            <Button variant="solid" width="100%" type="submit" colorScheme="teal">{isLoading ? <Spinner/> : "Recharge Amount"}</Button>
                        </FormControl>
                    </form>
                </ModalBody>
                <ModalFooter>

                </ModalFooter>
            </ModalContent>
            </Modal>
        </>
    )
}

export default RechargeBalance;