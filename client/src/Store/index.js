import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialUIState = {
    searchBarOpen: false,
    forgotPasswordModalOpen: false
}

const UISlice = createSlice({
    name: "UI",
    initialState: initialUIState,
    reducers: {
        toggleSearchBar: state => {
            state.searchBarOpen = !state.searchBarOpen;
        },
        toggleForgotPasswordModal: state => {
            state.forgotPasswordModalOpen = !state.forgotPasswordModalOpen;
        }
    }
});

const initialUserState = {
    name: "",
    dateJoined: "",
    email: "",
    balance: "",
    isLoggedIn: !!localStorage.getItem("token"),
    rentedCars: [],
    returnedCars: [],
    carName: "",
    price: "",
    type: ""
}

const userSlice = createSlice({
    name: "user",
    initialState: initialUserState,
    reducers: {
        handleAuthState: state => {
            state.isLoggedIn = !!localStorage.getItem("token");
        },
        changeCarName: (state, action) => {
            state.carName = action.payload;
        },
        changeType: (state, action) => {
            state.type = action.payload;
        },
        changePrice: (state, action) => {
            state.price = action.payload;
        },
        getRentedCars: (state, action) => {
            state.rentedCars = action.payload;
        },
        getReturnedCars: (state, action) => {
            state.returnedCars = action.payload;
        },
        requestedToReturn: (state, action) => {
            for(let rent of state.rentedCars) {
                if(rent.rentid === action.payload) {
                    rent.rentstatus = "requestedToReturn";
                }
            }
        },
        setProfileData: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.dateJoined = action.payload.dateJoined;
            state.balance = parseInt(action.payload.balance);
        },
        updateBalance: (state, action) => {
            state.balance += parseInt(action.payload);
        }
    }
});

const initialCarState = {
    carsSearched: []
}

const carSlice = createSlice({
    name: "car",
    initialState: initialCarState,
    reducers: {
        getCars: (state, action) => {
            state.carsSearched = action.payload;
        },
        clearCar: (state, action) => {
            state.carsSearched = state.carsSearched.filter(car => car.carid !== action.payload);
        }
    }
});

const initialAdminState = {
    isLoggedIn: !!localStorage.getItem("adminToken"),
    inventory: [],
    rents: [],
    cars: []
}

const adminSlice = createSlice({
    name: "admin",
    initialState: initialAdminState,
    reducers: {
        handleAuthState: state => {
            state.isLoggedIn = !!localStorage.getItem("adminToken");
        },
        getInventory: (state, action) => {
            state.inventory = action.payload;
            for(let item of state.inventory) {
                item.revenueearned |= 0;
                item.revenueearned = parseInt(item.revenueearned);
                item.demand = parseFloat(item.demand);
                item.carid = parseInt(item.carid);
                item.totalgasconsumed |= 0;
                if(item.cartype === "AC") {
                    item.baseamount *= 1.5;
                    item.rupeeperkm *= 1.5;
                    item.rupeeperhour *= 1.5;
                }
            }
        },
        removeInventory: (state, action) => {
            state.inventory = state.inventory.filter(item => item.numberplate !== action.payload);
            state.rents = state.rents.filter(item => item.numberplate !== action.payload);
        },
        repairInventory: (state, action) => {
            for(let item of state.inventory) {
                if(item.numberplate === action.payload) {
                    item.carstatus = "repaired";
                }
            }
        },
        retrieveInventory: (state, action) => {
            for(let item of state.inventory) {
                if(item.numberplate === action.payload.numberplate) {
                    item.carstatus = "available";
                    item.maintainenceexpense += action.payload.cost;
                }
            }
        },
        sortInventoryOnAvailablity: state => {
            const availableCars = state.inventory.filter(item => item.carstatus === "available");
            const repairedCars = state.inventory.filter(item => item.carstatus === "repaired");
            const rentedCars = state.inventory.filter(item => item.carstatus === "rented");
            state.inventory = [...availableCars, ...repairedCars, ...rentedCars];
        },
        sortInventoryOnRevenueEarned: state => {
            state.inventory = state.inventory.sort((a, b) => parseInt(b.revenueearned) - parseInt(a.revenueearned));
        },
        sortInventoryOnCarId: state => {
            state.inventory = state.inventory.sort((a, b) => parseInt(a.carid) - parseInt(b.carid));
        },
        sortInventoryOnDemand: state => {
            state.inventory = state.inventory.sort((a, b) => parseInt(b.demand) - parseInt(a.demand));
        },
        getRents: (state, action) => {
            state.rents = action.payload;
        },
        getCarModels: (state, action) => {
            state.cars = action.payload;
        },
        addCarModel: (state, action) => {
            action.payload.revenueearned = 0;
            action.payload.demand = 0;
            action.payload.carid = state.cars.length + 1;
            state.cars.push(action.payload);
        },
        sortCarModelsOnId: state => {
            state.cars = state.cars.sort((a, b) => parseInt(a.carid) - parseInt(b.carid));
        },
        sortCarModelsOnPrice: state => {
            state.cars = state.cars.sort((a, b) => parseInt(b.price) - parseInt(a.price));
        },
        sortCarModelsOnDemand: state => {
            state.cars = state.cars.sort((a, b) => parseInt(b.demand) - parseInt(a.demand));
        },
        sortCarModelsOnRevenueEarned: state => {
            state.cars = state.cars.sort((a, b) => parseInt(b.revenueearned) - parseInt(a.revenueearned));
        },
        removeCar: (state, action) => {
            state.cars = state.cars.filter(item => item.carid !== action.payload);
            state.inventory = state.inventory.filter(item => item.carid !== action.payload);
            state.rents = state.rents.filter(item => item.carid !== action.payload);
        }
    }
});

const store = configureStore({
    reducer: {
        UI: UISlice.reducer,
        user: userSlice.reducer,
        car: carSlice.reducer,
        admin: adminSlice.reducer,
    }
});

export default store;
export const UIActions = UISlice.actions;
export const userActions = userSlice.actions;
export const carActions = carSlice.actions;
export const adminActions = adminSlice.actions;