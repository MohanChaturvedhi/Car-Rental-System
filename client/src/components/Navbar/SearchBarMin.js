import { IconButton, Center, Input, Flex, useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UIActions } from "../../Store";
import FiltersMin from "./FiltersMin";
import { userActions, carActions } from "../../Store";

const SearchBarMin = () => {
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
                dispatch(UIActions.toggleSearchBar());
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
    <Flex pl = "15" position = "absolute" left = "0%" height = "60px" width = "100%">
            <Flex justifyContent = "space-around" alignItems = "center" width = "calc(100% - 40px)" height = "60px">
                <Input ref = {searchBarRef} onChange = {changeHandler} placeholder="Enter a vehicle name..." width = "calc(100% - 110px)" focusBorderColor = "teal.400"></Input>
                <FiltersMin/>
                <IconButton onClick = {submitHandler} width = "40px" height = "60px" backgroundColor = "transparent" _hover={{backgroundColor: "transparent"}} icon = {<svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>}/>
            </Flex>
            <Center cursor = "pointer" onClick = {() => { dispatch(UIActions.toggleSearchBar()) }} width = "50px" height = "60px">
                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>                   
            </Center>
        </Flex>
    )
}

export default SearchBarMin;