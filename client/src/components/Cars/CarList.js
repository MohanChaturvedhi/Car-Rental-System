import { Flex } from '@chakra-ui/react'
import { useSelector } from 'react-redux';
import CarItem from "./CarItem.js";

const CarList = () => {
    const carsSearched = useSelector(state => state.car.carsSearched);
    return (
        <Flex 
            py = {["10px", "0px"]}
            justifyContent = "left"
            shadow = {["none", "lg"]}
            flexWrap = {["no-wrap", "wrap"]}
            flexDirection = {["column", "row"]}
            border = {["0px", "1px solid #e2e8f0"]}
            px = {["10px", "0px", "0px", "0px", "10px"]}
            alignItems = {["center", "flex-start"]}
            width = {["100%", "100%", "calc(100% - 215px)", "calc(100% - 315px)"]}
            height = {carsSearched.length === 0 ? "calc(100vh - 92px)" : "fit-content"}
            >
            {carsSearched.map((car, i) => <CarItem key = {i} details = {car}/>)}
        </Flex>
    )
}

export default CarList;