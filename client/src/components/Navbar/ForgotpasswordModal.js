import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, useDisclosure, useToast, Spinner } from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UIActions } from '../../Store';

const ForgotPasswordModal = () => {
    const toast = useToast();
    const emailRef = useRef();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const forgotPasswordModalOpen = useSelector(state => state.UI.forgotPasswordModalOpen);
    useEffect(() => {
        if(forgotPasswordModalOpen === true) {
            onOpen();
        } else {
            onClose();
        }
    }, [forgotPasswordModalOpen, onOpen, onClose]);
    const submitHandler = async event => {
        setIsLoading(true);
        try {
            event.preventDefault();
            const enteredEmail = emailRef.current.value
            const result = await fetch(`http://localhost:3000/auth/resetemail?email=${enteredEmail}`, {
                method: "GET",
                mode: "cors",
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
            console.log(err);
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
        <Modal isOpen = {isOpen} onClose = {onClose}>
            <ModalOverlay/>
            <ModalContent width = "90%" height = "230px">
                <ModalHeader>Forgot password</ModalHeader>
                <ModalCloseButton onClick = {() => { dispatch(UIActions.toggleForgotPasswordModal()) }}/>
                <ModalBody>
                    <form onSubmit = {submitHandler}>
                        <FormControl mb = "20px" isRequired = {true}>
                            <FormLabel>Email address</FormLabel>
                            <Input ref = {emailRef} focusBorderColor="teal.400" type='email'/>
                        </FormControl>
                        <Button width = "100%" type = "submit" colorScheme = 'teal'>{isLoading ? <Spinner/> : "Submit"}</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

  export default ForgotPasswordModal;