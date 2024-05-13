import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Show } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import ReturnDetails from "./ReturnDetails";

const ReturnedList = () => {
    const returnedCars = useSelector(state => state.user.returnedCars);
    return (
        <TableContainer>
            <Table variant = 'simple'>
                <TableCaption>Returned Cars</TableCaption>
                <Thead>
                    <Tr>
                        <Th textAlign = "center">Car Name</Th>
                        <Show above = "510px"><Th textAlign = "center">Date Rented</Th></Show>
                        <Show above = "620px"><Th textAlign = "center">Type</Th></Show>
                        <Th textAlign = "center">Options</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        returnedCars.map(item => 
                            <Tr key = {item.rentid}>
                                <Td textAlign = "center">{item.carname}</Td>
                                <Show above = "510px"><Td textAlign = "center">{item.rentedon}</Td></Show>
                                <Show above = "620px"><Td textAlign = "center">{item.cartype}</Td></Show>
                                <Td textAlign = "center"><ReturnDetails details = {item}/></Td>
                            </Tr>
                        )
                    }
                    
                </Tbody>
                <Tfoot>

                </Tfoot>
            </Table>
        </TableContainer>
    )
}

export default ReturnedList;