import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, useToast } from '@chakra-ui/react';
import AdminNavbar from '../Admin/AdminNavbar';
import InventoryDetails from '../Admin/InventoryDetails.js';
import RentDetails from '../Admin/RentDetails.js';
import CarDetails from '../Admin/CarDetails';
import { adminActions } from '../../Store';
import { useEffect } from 'react';
import { useDispatch } from "react-redux";

const AdminHomePage = () => {
    const toast = useToast();
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetch("http://localhost:3000/admin/", {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": localStorage.getItem("adminToken")
                    }
                });
                const res = await result.json();
                if(res.status === "success") {
                    dispatch(adminActions.getInventory(res.inventory));
                    dispatch(adminActions.getRents(res.rents));
                    dispatch(adminActions.getCarModels(res.models));
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
        fetchData();
    }, [dispatch, toast]);
    return (
        <>
            <AdminNavbar/>
            <Box width = "100%" p = {["0px", "15px"]} py = "15px" height = "fit-content">
                <Tabs height = "max(calc(100vh - 92px), fit-content)" shadow = "md" colorScheme = "teal" width = "100%">
                    <TabList>
                        <Tab>Inventory</Tab>
                        <Tab>Rents</Tab>
                        <Tab>Cars</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <InventoryDetails/>
                        </TabPanel>
                        <TabPanel>
                            <RentDetails/>
                        </TabPanel>
                        <TabPanel>
                            <CarDetails/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </>
    )
}

export default AdminHomePage;