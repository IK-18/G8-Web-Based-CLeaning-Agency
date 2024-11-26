require("dotenv").config();
const express = require("express");
const payments = express.Router();
const {pool} = require("../utils/db");

payments.get("/", (req, res) => {
	if (req.user.role !== "Admin") {
		pool.query("SELECT * FROM Payment", (e, results) => {
			if (e) {
				res.status(400).json({message: "Error in query", error: e});
			}
			res.status(200).send(results);
		});
	} else {
		res.send(403).json({message: "User not authenticated/authorized"});
	}
});

payments.get("/:id", (req, res) => {
	let id = req.params.id;
	if (req.user.role == "User") {
		pool.query(
			"SELECT * FROM Payment WHERE BookingID = ?",
			[id],
			(e, results) => {
				if (e) {
					res.status(400).json({message: "Error in query", error: e});
				}
				if (results.length <= 0) {
					res.status(404).json({
						message: "Payment not found!",
					});
				}
				let payment = results[0];
				res.status(200).json(payment);
			},
		);
	} else if (req.user.role === "Admin") {
		pool.query(
			"SELECT * FROM Payment WHERE PaymentID = ?",
			[id],
			(e, results) => {
				if (e) {
					res.status(400).json({message: "Error in query", error: e});
				}
				if (results.length <= 0) {
					res.status(404).json({
						message: "Payment not found!",
					});
				}
				let payment = results[0];
				res.status(200).json(payment);
			},
		);
	}
});

payments.post("/", (req, res) => {
	let id = req.body.id;
	let amount = req.body.amount;
	let date = req.body.date;
	let status = req.body.status;
	pool.query(
		"INSERT INTO Payment (BookingID, Amount, Date, Status) VALUES (?, ?, ?, ?)",
		[id, amount, date, status],
		(e, results) => {
			if (e) {
				res.status(400).json({message: "Error in query", error: e});
			}
			let paymentID = results.insertId;
			res.status(200).json({
				message: "Recorded Payment successully!",
				id: paymentID,
			});
		},
	);
});

module.exports.paymentsRouter = payments;
