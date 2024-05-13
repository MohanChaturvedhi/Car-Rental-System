import { Input, FormControl, FormLabel, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Text, useToast, Spinner } from "@chakra-ui/react";
import { useState, useRef } from "react";

const SignupFormMain = () => {
    const toast = useToast();
    const nameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const submitHandler = async event => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const data = {
                name: nameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value
            }
            const result = await fetch("http://localhost:3000/auth/", {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const res = await result.json();
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
        }
        setIsLoading(false);
    }
    return (
        <>
            <Button onClick = {onOpen} colorScheme = "teal" variant = "solid">Signup</Button>
            <Modal isOpen = {isOpen} onClose = {onClose}>
            <ModalOverlay/>
                <ModalContent width = "90%" height = "410px">
                    <ModalHeader>
                        <Text fontWeight = "400">Signup</Text>
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <form onSubmit = {submitHandler}>
                            <FormControl mb = "20px" isRequired = {true}>
                                <FormLabel>Name</FormLabel>
                                <Input ref = {nameRef} focusBorderColor = "teal.400" type = 'text'/>
                            </FormControl>
                            <FormControl mb = "20px" isRequired = {true}>
                                <FormLabel>Email address</FormLabel>
                                <Input ref = {emailRef} focusBorderColor = "teal.400" type = 'email'/>
                            </FormControl>
                            <FormControl mb = "20px" isRequired = {true}>
                                <FormLabel>Password</FormLabel>
                                <Input ref = {passwordRef} focusBorderColor = "teal.400" type = 'password'/>
                            </FormControl>
                            <Button width = "100%" type = "submit" colorScheme = 'teal'>{isLoading ? <Spinner/> : "Signup"}</Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

  export default SignupFormMain;