import { Flex, Box, Text, FormControl, FormLabel, Input, Button, useToast, FormErrorMessage, Spinner } from "@chakra-ui/react"
import { useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom";

const ForgotPasswordPage = () => {
    const toast = useToast();
    const passwordRef = useRef();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const { token } = useParams();
    const changeHandler = event => {
        setIsPasswordValid(() => event.target.value.length > 5);
    }
    const changepasswordHandler = async event => {
        event.preventDefault();
        setIsLoading(true);
        const enteredPassword = passwordRef.current.value;
        const result = await fetch(`http://localhost:3000/auth/${token}/changepassword?password=${enteredPassword}`, {
            method: "PATCH",
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
        setIsLoading(false);
        history.push("/");
    }
    return (
        <>
            <Flex justifyContent="center" alignItems="center" width="100%" height="calc(30vh - 55px)">    
                <Box width="350px">
                    <Text textAlign="center" fontWeight={["bold","bold","bold"]} fontSize={["40px","40px","40px"]} color="#39424e" position="relative" top="-20px">Car Rental System</Text>
                    <Text textAlign="center">Please enter your new password</Text>
                </Box>
            </Flex>
            <Flex justifyContent="center" width="100%" height="calc(70vh - 5px)">
                <Box w="95%" maxW="400px" height="200px" borderColor="grey.200" shadow="md" borderWidth="2px" borderRadius="lg">
                    <form onSubmit={changepasswordHandler}>
                        <Flex width = "90%" flexDirection="column" position="relative" left = "5%">
                            <FormControl isInvalid={!isPasswordValid} isRequired mt={4}>
                                <FormLabel>New Password</FormLabel>
                                <Input ref={passwordRef} onChange={changeHandler} variant="outline" focusBorderColor="teal.400"  name="password" placeholder="enter password..." type="text"/>
                                {!isPasswordValid && <FormErrorMessage>Password should be atleast 6 characters long</FormErrorMessage>}
                            </FormControl>
                            <FormControl mt={8}>
                                <Button disabled={!isPasswordValid} type = "submit" variant="solid" width="100%" colorScheme="teal">{isLoading === true ? <Spinner/> : "Change password"}</Button>
                            </FormControl>
                        </Flex>
                    </form>
                </Box>
            </Flex>
        </>
    )
}

export default ForgotPasswordPage;