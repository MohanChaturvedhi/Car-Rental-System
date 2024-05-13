import { Button, FormLabel, Input, Spinner, useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { adminActions } from "../../Store";

const AdminLoginForm = () => {
    const toast = useToast();
    const history = useHistory();
    const dispatch = useDispatch();
    const adminAccessKeyRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const submitHandler = async event => {
        try {
            event.preventDefault();
            setIsLoading(true);
            const data = {
                adminAccessKey: adminAccessKeyRef.current.value
            }
            const result = await fetch("http://localhost:3000/admin/login", {
                method: "POST",
                body: JSON.stringify(data),
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const res = await result.json();
            if(res.data) {
                localStorage.setItem("adminToken", res.data);
                dispatch(adminActions.handleAuthState());
                history.push("/admin/home");
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
        <form onSubmit = {submitHandler}>
            <FormLabel htmlFor = "adminAccessKey">Admin Access Key</FormLabel>
            <Input ref = {adminAccessKeyRef} required = {true} width = "100%" name = "adminAccessKey" border = "1px solid #ced4da" focusBorderColor = "teal.400" type = "password"/>
            <Button width = "100%" mt = "15px" type = "submit" colorScheme = "teal">{isLoading ? <Spinner/> : "Submit"}</Button>
        </form>
    )
}

export default AdminLoginForm;