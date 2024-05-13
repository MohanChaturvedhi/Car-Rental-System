const express = require("express");
const db = require("../db/index.js");
const auth = require("../utilities/auth.js");
const router = express.Router();

const dateCompare = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    if(date1 > date2) {
        return 1;
    } else if(date1 < date2) {
        return -1;
    }
    return 0;
}

router.get("/", async (req, res) => {
    try {
        const { carName, type, price } = req.query;
        let lowerBound, upperBound;
        if(price == "2000") {
            lowerBound = 0;
            upperBound = 2000;
        } else if(price === "4000") {
            lowerBound = 2000;
            upperBound = 4000;
        } else if(price === "6000") {
            lowerBound = 4000;
            upperBound = 6000;
        } else if(price == "infinity") {
            lowerBound = 6000;
            upperBound = 1000000;
        } else {              
            lowerBound = 0;
            upperBound = 1000000;
        }
        const result = await db.getCars(carName, type, lowerBound, upperBound);
        res.json(result);
    } catch(err) {
        console.log(err);
        res.json({
            info: "An unexpected error occured, please try again later", 
            status: "error", 
            title: "Error" 
        });
    }
});

router.post("/rent", auth.requireAuthentication, async (req, res) => {
    try {
        const { carId, carType, expectedReturn } = req.body;
        const modifiedExpectedReturn = expectedReturn.substr(8, 2) + "/" + expectedReturn.substr(5, 2) + "/" + expectedReturn.substr(0, 4);
        const currDate = new Date(Date.now());
        modifiedCurrDate = currDate.toLocaleString("en-GB").substring(0, 10);
        const checkPastDate = dateCompare(modifiedExpectedReturn, modifiedCurrDate);
        if(checkPastDate < 0) {
            return res.json({
                info: "Date cannot be past date",
                status: "warning",
                title: "Warning"
            });
        }
        const result = await db.rentCar(carId, modifiedExpectedReturn, res.locals.userid, carType);
        res.json(result);
    } catch(err) {
        res.json({
            info: "An unexpected error occured, please try again later", 
            status: "error", 
            title: "Error" 
        });
    }
});

router.get("/models", auth.requireAdminAuthentication, async (req, res) => {
    try {
        const result = await db.getCarModels();
        res.json(result);
    } catch(err) {
        res.json({
            info: "An unexpected error occured, please try again later", 
            status: "error", 
            title: "Error" 
        });
    }
});

router.post("/", auth.requireAdminAuthentication, async (req, res) => {
    try {
        let { carId, carType, numberPlate, mileMeterReading } = req.body;
        mileMeterReading = parseInt(mileMeterReading);
        if(mileMeterReading < 0) {
            return res.json({
                info: "Milemeter reading cant be less than zero",
                status: "warning",
                title: "Warning"
            });
        } else if(numberPlate.match(/[A-Z]{2}[0-9]{2}\s[A-Z]{2}[0-9]{4}/) === null) {
            return res.json({
                info: "Number plate can only be in the format AAXX AAXXXX",
                title: "Warning",
                status: "warning"
            });
        }
        const result = await db.insertInventory(carId, carType, numberPlate, mileMeterReading);
        res.json(result);
    } catch(err) {
        console.log(err);
        res.json({
            info: "An unexpected error occured, please try again later", 
            status: "error", 
            title: "Error" 
        });
    }
});

router.patch("/return", auth.requireAuthentication, async (req, res) => {
    try {
        const { rentId } = req.query;
        const result = await db.requestedToReturn(rentId);
        res.json(result);
    } catch(err) {
        console.log(err);
        res.json({
            info: "An unexpected error occured, please try again later", 
            status: "error", 
            title: "Error" 
        });
    }
});

module.exports = router;