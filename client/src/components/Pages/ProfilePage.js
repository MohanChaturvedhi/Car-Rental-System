import { useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { userActions } from '../../Store';
import { useDispatch } from "react-redux";
import ProfileCard from "../Profile/ProfileCard";
import RentedList from "../Profile/RentedList.js";
import ReturnedList from "../Profile/ReturnedList.js";
import { Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Box, useToast } from "@chakra-ui/react";

const ProfilePage = () => {
    const toast = useToast();
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetch("http://localhost:3000/auth/", {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": localStorage.getItem("token")
                    }
                });
                const res = await result.json();
                if(res.status === "success") {
                    const data = {
                        name: res.profile.name,
                        email: res.profile.email,
                        dateJoined: res.profile.datejoined,
                        balance: res.profile.balance
                    };
                    dispatch(userActions.setProfileData(data));
                    dispatch(userActions.getRentedCars(res.rented));
                    dispatch(userActions.getReturnedCars(res.returned));
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
                console.log(err);
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
            <Navbar/>
            <Flex flexDirection = "column" width = "100%" height = "fit-content" p = "10px" alignItems = "center">
                <ProfileCard/>
                <Box p = "15px" mt = "30px" width = {["100%", "100%", "100%"]} maxW = "800px" height = "fit-content" shadow = "md" borderRadius = "5px">
                    <Tabs colorScheme = "teal" width = "100%">
                        <TabList>
                            <Tab>Rented</Tab>
                            <Tab>Returned</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel height = "fit-content">
                                <RentedList/>
                            </TabPanel>
                            <TabPanel height = "fit-content">
                                <ReturnedList/>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Flex>
        </>
    )
}

export default ProfilePage;