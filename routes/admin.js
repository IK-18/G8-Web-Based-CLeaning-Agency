require("dotenv").config();
const express = require("express");
const admin = express.Router();
const {pool} = require("../utils/db");
const {servicesRouter} = require("./services");
const {bookingRouter} = require("./booking");
const {paymentsRouter} = require("./payment");
const {cleanerRouter} = require("./cleaner");
const {feedbackRouter} = require("./feedback");
const {reportsRouter} = require("./reports");

admin.get("/accounts/:id", (req, res) => {
	let id = req.params.userId;
	pool.query(
		"SELECT * FROM Customer WHERE CustomerID = ?",
		[id],
		(e, results) => {
			if (e) throw e;
			if (results.length <= 0) {
				res.status(404).json({
					message: "User not found!",
				});
			}
			let {CustomerID, Name, Phone, Email, Address, Role} = results[0];
			let user = {CustomerID, Name, Phone, Email, Address, Role};
			res.status(200).json(user);
		},
	);
});

admin.delete("/accounts/:id", (req, res) => {
	let id = req.params.userId;
	pool.query(
		"DELETE FROM Customer WHERE CustomerID = ?",
		[id],
		(e, results) => {
			if (e) throw e;
			if (results.affectedRows <= 0) {
				res.status(404).json({
					message: "User not found!",
				});
			}
			res.status(200).json({message: "User deleted successfully!"});
		},
	);
});

admin.use("/services", servicesRouter);

admin.use("/bookings", bookingRouter);

admin.use("/payments", paymentsRouter);

admin.use("/cleaners", cleanerRouter);

admin.use("/feedback", feedbackRouter);

admin.use("/reports", reportsRouter);

module.exports.adminRouter = admin;
