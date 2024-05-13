import { Show, Flex, Input, IconButton, useToast } from "@chakra-ui/react";
import FiltersMin from "./FiltersMin";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions, carActions } from "../../Store";

const SearchBarMain = () => {
    const toast = useToast();
    const dispatch = useDispatch();
    const searchBarRef = useRef("");
    const type = useSelector(state => state.user.type);
    const price = useSelector(state => state.user.price);
    const availablity = useSelector(state => state.user.availablity);
    const changeHandler = () => {
        dispatch(userActions.changeCarName(searchBarRef.current.value));
    }
    const submitHandler = async event => {
        try {
            const result = await fetch(`http://localhost:3000/cars?carName=${searchBarRef.current.value}&&type=${type ? type : "any"}&&avaliablity=${availablity ? availablity : "any"}&&price=${price ? price : "any"}`, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const res = await result.json();
            if(res.status === "success") {
                dispatch(carActions.getCars(res.data));
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
    }
    return (
        <Show above = "sm">
            <Flex justifyContent = "space-around" alignItems = "center" width = {[0, "calc(100% - 140px - 40px)", "calc(100% - 200px - 60px)", "calc(100% - 600px)"]} height = "60px">
                <Input ref = {searchBarRef} onChange = {changeHandler} placeholder = "Enter a vehicle name..." width = {["0px", "calc(100% - 120px)", "calc(100% - 60px)"]} focusBorderColor = "teal.400"></Input>
                <Show below = "md">
                    <FiltersMin/>
                </Show>
                <IconButton onClick = {submitHandler} type = "submit" width = "40px" height = "60px" backgroundColor = "transparent" _hover={{backgroundColor: "transparent"}} icon = {<svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>}/>
            </Flex>
        </Show>
    )
}

export default SearchBarMain;