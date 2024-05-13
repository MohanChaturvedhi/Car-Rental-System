import { Select, useToast, Button } from '@chakra-ui/react'
import { carActions, userActions } from '../../Store'
import { useSelector, useDispatch } from "react-redux";

const Filters = () => {
    const toast = useToast();
    const dispatch = useDispatch();
    const type = useSelector(state => state.user.type);
    const price = useSelector(state => state.user.price);
    const carName = useSelector(state => state.user.carName);
    const submitHandler = async event => {
        try {
            event.preventDefault();
            const result = await fetch(`http://localhost:3000/cars?carName=${carName}&&type=${type ? type : "any"}&&price=${price ? price : "any"}`, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const res = await result.json();
            console.log(res);
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
    const typeHandler = event => {
        dispatch(userActions.changeType(event.target.value || "any"));
    }
    const priceHandler = event => {
        dispatch(userActions.changePrice(event.target.value || "any"));
    }
    return (
        <form onSubmit = {submitHandler}>
            <Select onChange = {typeHandler} focusBorderColor = "teal.400" mb = "20px" placeholder = "Select Type" shadow = {["none", "none", "md", "md", "md"]} border = "1px solid" borderColor = "gray.200">
                <option value = "AC">AC</option>
                <option value = "NONAC">NON-AC</option>
                <option value = "any">Any</option>
            </Select>
            <Select onChange = {priceHandler} focusBorderColor = "teal.400" mb = "20px" placeholder = "Select Price" shadow = {["none", "none", "md", "md", "md"]} border = "1px solid" borderColor = "gray.200">
                <option value = "2000">Below 2000</option>
                <option value = "4000">2000 - 4000</option>
                <option value = "6000">4000 - 6000</option>
                <option value = "infinity">Above 6000</option>
                <option value = "any">Any</option>
            </Select>
            <Button type = "submit" colorScheme = "teal" width = "100%" borderRadius = "4px">Submit</Button>
        </form>
    )
}

export default Filters;