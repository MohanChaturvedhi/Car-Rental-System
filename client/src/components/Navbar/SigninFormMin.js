import { Spinner, Input, FormControl, Box, FormLabel, useToast, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Text, Flex } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { UIActions, userActions } from '../../Store';

let isInitial = true;

const SigninFormMain = () => {
    const toast = useToast();
    const emailRef = useRef("");
    const dispatch = useDispatch();
    const passwordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const forgotPasswordModalOpen = useSelector(state => state.UI.forgotPasswordModalOpen);
    useEffect(() => {
        if(isInitial === true) {
            isInitial = false;
            return;
        } else if(forgotPasswordModalOpen === true) {
            onClose();
        }
    }, [forgotPasswordModalOpen, onOpen, onClose]);
    const submitHandler = async event => {
        setIsLoading(true);
        try {
            event.preventDefault();
            const data = {
                email: emailRef.current.value,
                password: passwordRef.current.value
            }
            const result = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const res = await result.json();
            if(res.token) {
                const data = {
                    name: res.data.name,
                    email: res.data.email,
                    dateJoined: res.data.datejoined,
                    balance: res.data.balance
                }
                dispatch(userActions.setProfileData(data));
                localStorage.setItem("token", res.token);
                dispatch(userActions.handleAuthState(data));
            }
            toast({
                position: "top",
                title: res.title,
                description: res.info,
                status: res.status,
                duration: 10000,
                isClosable: true
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
            <Box onClick = {onOpen} width = "100%" height = "100%">Signin</Box>
            <Modal isOpen = {isOpen} onClose = {onClose}>
            <ModalOverlay/>
                <ModalContent width = "90%" height = "370px">
                    <ModalHeader>
                        <Text fontWeight = "400">Signin</Text>
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <form onSubmit = {submitHandler}>
                            <FormControl mb = "20px" isRequired = {true}>
                                <FormLabel>Email address</FormLabel>
                                <Input ref = {emailRef} focusBorderColor = "teal.400" type = 'email'/>
                            </FormControl>
                            <FormControl mb = "20px" isRequired = {true}>
                                <FormLabel>Password</FormLabel>
                                <Input ref = {passwordRef} focusBorderColor = "teal.400" type = 'password'/>
                            </FormControl>
                            <Button width = "100%" type = "submit" colorScheme = 'teal'>{isLoading ? <Spinner/> : "Signin"}</Button>
                        </form>
                        <Flex position = "relative" top = "15px" width = "fit-content" height = "40px">
                            <Button variant = "link" textDecor = "underline" color = "blue" fontWeight = "400" backgroundColor = "transparent" onClick = { () => { dispatch(UIActions.toggleForgotPasswordModal()) }}>Forgot Password?</Button>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default SigninFormMain;