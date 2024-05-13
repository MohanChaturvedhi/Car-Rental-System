import Navbar from "../Navbar/Navbar"
import CarList from "../Cars/CarList"
import Filters from "../Navbar/Filters"
import { useEffect } from "react"
import { Flex, Show, useToast } from "@chakra-ui/react"
import { useDispatch } from "react-redux"
import { carActions } from "../../Store"

const HomePage = () => {
    const toast = useToast();
    const dispatch = useDispatch();
    useEffect(() => {
        const getCars = async () => {
            try {
                const result = await fetch(`http://localhost:3000/cars?carName=&&type=any&&price=any`, {
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
        getCars();
    }, [dispatch, toast]);
    return (
        <>
            <Navbar/>
            <Flex justifyContent = "space-between" p = "15px" width = "100%" height = "fit-content" flexDirection = "row">
                <CarList/>
                <Show above = "md">
                    <Flex position = "sticky" top = "77px" flexDirection = "column" width = {["100%", "100%", "200px", "300px", "300px"]} height = "fit-content">
                        <Filters/>
                    </Flex>
                </Show>
            </Flex>
        </>
    )
}

export default HomePage;