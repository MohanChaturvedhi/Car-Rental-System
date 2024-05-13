import { useToast, useDisclosure, Button, FormControl, ModalBody, Input, FormLabel, Text, ModalCloseButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, Spinner } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from '../../Store';

const ChangeProfileForm = () => {
    const toast = useToast();
    const nameRef = useRef("");
    const dispatch = useDispatch();
    const passwordRef = useRef("");
    const userData = useSelector(state => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const changeDetailsHandler = async event => {
        setIsLoading(true);
        event.preventDefault();
        try {
            if(!(nameRef.current.value.search(/[^a-zA-Z]+/) === -1)) {
                toast({
                    position: "top",
                    title: "Warning",
                    description: "Name can only contain alphabets",
                    status: "warning",
                    duration: 10000,
                    isClosable: true,
                });
                setIsLoading(false);
                return;
            }
            const result = await fetch(`http://localhost:3000/auth/?name=${nameRef.current.value}&&password=${passwordRef.current.value}`, {
                mode: "cors",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": localStorage.getItem("token")
                }
            });
            const res = await result.json();
            if(res.status === "success") {
                const data = {
                    name: nameRef.current.value === "" ? userData.name : nameRef.current.value,
                    email: userData.email,
                    dateJoined: userData.dateJoined,
                    balance: userData.balance
                }
                dispatch(userActions.setProfileData(data));
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
            <Button variant="outline" onClick={onOpen} leftIcon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>}colorScheme='teal'>Edit</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent width="95%">
                <ModalHeader>Change Details</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Text>Leave the fields you dont want to change</Text>
                    <form onSubmit = {changeDetailsHandler}>
                        <FormControl mt={4}>
                            <FormLabel>New username</FormLabel>
                            <Input ref = {nameRef} variant="outline" focusBorderColor="teal.400" placeholder="enter username..." type="text"/>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>New password</FormLabel>
                            <Input ref = {passwordRef} variant="outline" focusBorderColor="teal.400" placeholder="enter password..." type="text"/>
                        </FormControl>
                        <FormControl mt={6}>
                            <Button variant="solid" width="100%" type="submit" colorScheme="teal">{isLoading ? <Spinner/> : "Save Changes"}</Button>
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

export default ChangeProfileForm;