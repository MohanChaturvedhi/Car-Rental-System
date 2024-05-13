const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db/index.js");
const auth = require("../utilities/auth.js");
const router = express.Router();
const path = require("path");
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: path.join(__dirname, "..", ".env") });
}

router.post("/login", async (req, res) => {
    try {
        const { adminAccessKey } = req.body;
        if(adminAccessKey === process.env.ADMIN_ACCESS_KEY) {
            const token = jwt.sign({
                adminAccessKey: "theAdminAccessKey"
            }, process.env.ADMIN_ACCESS_KEY);
            return res.json({
                status: "success",
                info: "Login Successful, Welcome",
                title: "Success",
                data: token
            });
        } else {
            return res.json({
                status: "error",
                info: "Invalid Access Key",
                title: "Error"
            });
        }
    } catch(err) {
        console.log(err);
        res.json({ 
            info :"An unexpected error occured, please try again later", 
            status: "error", 
            title: "Error" 
        });
    }
});


router.delete("/:numberPlate/sell", auth.requireAdminAuthentication, async (req, res) => {
    try {
        const { numberPlate } = req.params;
        const result = await db.deleteInventoryItem(numberPlate);
        res.json(result);
    } catch(err) {
        console.log(err);
        res.json({ 
            info :"An unexpected error occured, please try again later", 
            status: "error", 
            title: "Error" 
        });
    }
});

router.patch("/:numberPlate/repair", auth.requireAdminAuthentication, async (req, res) => {
    try {
        const { numberPlate } = req.params;
        const result = await db.repairCar(numberPlate);
        res.json(result);
    } catch(err) {
        console.log(err);
        res.json({ 
            info :"An unexpected error occured, please try again later", 
            status: "error", 
            title: "Error" 
        });
    }
});

router.patch("/:numberPlate/retrieve", auth.requireAdminAuthentication, async (req, res) => {
    try {
        const { numberPlate } = req.params;
        const result = await db.retrieveCar(numberPlate);
        res.json(result);
    } catch(err) {
        console.log(err);
        res.json({ 
            info :"An unexpected error occured, please try again later", 
            status: "error", 
            title: "Error" 
        });
    }
});

router.patch("/return", auth.requireAdminAuthentication, async (req, res) => {
    try {
        let { rentId, mileMeterEnd, gasConsumed, refundAmount, mileMeterStart, baseAmount } = req.body;
        mileMeterEnd = parseInt(mileMeterEnd);
        gasConsumed = parseInt(gasConsumed);
        refundAmount = parseInt(refundAmount);
        mileMeterStart = parseInt(mileMeterStart);
        baseAmount = parseInt(baseAmount);
        if(mileMeterEnd < mileMeterStart) {
            return res.json({
                title: "warning",
                status: "warning",
                info: "Milemeter end cant be less than milemeter start"
            });
        } else if(gasConsumed < 0) {
            return res.json({
                title: "warning",
                status: "warning",
                info: "Gas consumed cant be less than zero"
            });
        } else if(refundAmount < 0) {
            return res.json({
                title: "warning",
                status: "warning",
                info: "Refund amount cant be less than 0"
            });
        } else if(refundAmount > baseAmount) {
            return res.json({
                title: "warning",
                status: "warning",
                info: "Refund amount cant be greater than baseamount"
            });
        }
        const result = await db.returnCar(rentId, mileMeterEnd, gasConsumed, refundAmount);
        res.json(result);
    } catch(err) {
        console.log(err);
        res.json({ 
            info :"An unexpected error occured, please try again later", 
            status: "error", 
            title: "Error" 
        });
    }
});

router.post("/cars", auth.requireAdminAuthentication, async (req, res) => {
    try {
        let { carname, price, baseamount, rupeeperkm, rupeeperhour, imagelink } = req.body;
        price = parseInt(price);
        baseamount = parseInt(baseamount);
        rupeeperkm = parseInt(rupeeperkm);
        rupeeperhour = parseInt(rupeeperhour);
        if(price < 0) {
            return res.json({
                info: "Price cant be negative", 
                status: "warning", 
                title: "Warning" 
            });
        } else if(baseamount < 0) {
            return res.json({
                info: "Base amount cant be negative",
                status: "warning",
                title: "Warning"
            });
        } else if(rupeeperkm < 0) {
            return res.json({
                info: "Rupee per kilometer cant be negative",
                status: "warning",
                title: "Warning"
            });
        } else if(rupeeperhour < 0) {
            return res.json({
                info: "Rupee per hour cant be negative",
                status: "warning",
                title: "Warning"
            });
        }
        const result = await db.insertCarModel(carname, price, baseamount, rupeeperkm, rupeeperhour, imagelink);
        res.json(result);
    } catch(err) {
        console.log(err);
        res.json({ 
            info :"An unexpected error occured, please try again later", 
            status: "error", 
            title: "Error" 
        });
    }
});

router.delete("/cars", auth.requireAdminAuthentication, async (req, res) => {
    try {
        const { carId } = req.body;
        const result = await db.deleteCarItem(carId);
        res.json(result);
    } catch(err) {
        console.log(err);
        res.json({ 
            info :"An unexpected error occured, please try again later", 
            status: "error", 
            title: "Error" 
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const availablity = "";
        const result1 = await db.getCarData(availablity);
        const result2 = await db.getRentData();
        const result3 = await db.getCarModels();
        res.json({
            title: "Success",
            info: "Admin data fetched successfully",
            status: "success",
            inventory: result1.data,
            rents: result2.data,
            models: result3.data,
        });
    } catch(err) {
        console.log(err);
        res.json({ 
            info :"An unexpected error occured, please try again later", 
            status: "error", 
            title: "Error" 
        });
    }
});

module.exports = router;