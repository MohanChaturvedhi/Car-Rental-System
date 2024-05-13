import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Show } from '@chakra-ui/react'
import RentDetails from './RentDetails';
import { useSelector } from 'react-redux';

const RentedList = () => {
    const rentedCars = useSelector(state => state.user.rentedCars);
    return (
        <TableContainer>
            <Table variant = "simple">
                <TableCaption>Rented Cars</TableCaption>
                <Thead>
                    <Tr>
                        <Th textAlign = "center">Car Name</Th>
                        <Show above = "475px"><Th textAlign = "center">Date Rented</Th></Show>
                        <Show above = "600px"><Th textAlign = "center">Type</Th></Show>
                        <Th textAlign = "center">Options</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        rentedCars.map((rentedCar, i) => 
                            <Tr key = {i}>
                                <Td textAlign = "center">{rentedCar.carname}</Td>
                                <Show above = "475px"><Td textAlign = "center">{rentedCar.rentedon}</Td></Show>
                                <Show above = "600px"><Td textAlign = "center">{rentedCar.cartype}</Td></Show>
                                <Td textAlign = "center"><RentDetails details = {rentedCar}/></Td>
                            </Tr>
                        )
                    }
                </Tbody>
                <Tfoot>

                </Tfoot>
            </Table>
        </TableContainer>
    );
}

export default RentedList;