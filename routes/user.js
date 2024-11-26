require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const user = express.Router();
const {pool} = require("../utils/db");
const {bookingRouter} = require("./booking");
const {paymentsRouter} = require("./payment");
const {servicesRouter} = require("./services");
const {feedbackRouter} = require("./feedback");

user.get("/", (req, res) => {
	let id = req.user.id;
	pool.query(
		"SELECT * FROM Customer WHERE CustomerID = ?",
		[id],
		(e, results) => {
			if (e) {
				res.status(400).json({message: "Error in query", error: e});
			}
			if (results.length <= 0) {
				res.status(404).json({
					message: "User not found!",
				});
			}
			let {CustomerID, Name, Phone, Email, Address} = results[0];
			let user = {CustomerID, Name, Phone, Email, Address};
			res.status(200).json(user);
		},
	);
});

user.put("/", (req, res) => {
	let id = req.params.id;
	let updates = req.body;
	if (Object.keys(updates) <= 0) {
		res.status(400).json({message: "Nothing to update."});
	}
	let updateClause = Object.keys(updates)
		.map((key) => {
			`${mysql.escapeId(key)} = ${mysql.escape(updates[key])}`;
		})
		.join(", ");
	pool.query(
		`UPDATE Customer SET ${updateClause} WHERE CustomerID = ?`,
		[id],
		(e, results) => {
			if (e) {
				res.status(400).json({message: "Error in query", error: e});
			}
			if (results.affectedRows <= 0) {
				res.status(404).json({
					message: "User not found!",
				});
			}
			res.status(200).json({message: "User updated!"});
		},
	);
});

user.use("/services", servicesRouter);

user.use("/bookings", bookingRouter);

user.use("/payments", paymentsRouter);

user.use("/feedback", feedbackRouter);

module.exports.userRouter = user;
