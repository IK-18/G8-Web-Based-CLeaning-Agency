require("dotenv").config();
const express = require("express");
const bookings = express.Router();
const {pool} = require("../utils/db");

bookings.get("/", (req, res) => {
	if (req.user.role === "User") {
		let id = req.user.id;
		pool.query(
			"SELECT * FROM Booking WHERE CustomerID = ?",
			[id],
			(e, results) => {
				if (e) throw e;
				if (results.length <= 0) {
					res.status(404).json({
						message: "Booking not found!",
					});
				}
				res.status(200).json(results);
			},
		);
	} else if (req.user.role === "Admin") {
		pool.query("SELECT * FROM Booking", (e, results) => {
			if (e) throw e;
			res.status(200).send(results);
		});
	}
});

bookings.get("/:id", (req, res) => {
	let id = req.params.id;
	pool.query(
		"SELECT * FROM Booking WHERE BookingID = ?",
		[id],
		(e, results) => {
			if (e) throw e;
			if (results.length <= 0) {
				res.status(404).json({
					message: "Booking not found!",
				});
			}
			res.status(200).json(results[0]);
		},
	);
});

bookings.post("/", (req, res) => {
	if (req.user.role === "User") {
		let userID = req.user.CustomerID;
		let pkgID = req.body.pkgID;
		let date = req.body.date;
		let status = req.body.status;
		pool.query(
			"INSERT INTO Booking (CutomerID, PackageID, Date, Status) VALUES (?, ?, ?, ?)",
			[userID, pkgID, date, status],
			(e, results) => {
				if (e) throw e;
				let bookingID = results.insertId;
				res.status(200).json({
					message: "Created Booking successully!",
					id: bookingID,
				});
			},
		);
	} else if (req.user.role === "Admin") {
		let userID = req.body.userID;
		let pkgID = req.body.pkgID;
		let date = req.body.date;
		let status = req.body.status;
		pool.query(
			"INSERT INTO Booking (CutomerID, PackageID, Date, Status) VALUES (?, ?, ?, ?)",
			[userID, pkgID, date, status],
			(e, results) => {
				if (e) throw e;
				let bookingID = results.insertId;
				res.status(200).json({
					message: "Created Booking successully!",
					id: bookingID,
				});
			},
		);
	}
});

bookings.put("/:id", (req, res) => {
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
		`UPDATE Booking SET ${updateClause} WHERE BookingID = ?`,
		[id],
		(e, results) => {
			if (e) throw e;
			if (results.affectedRows <= 0) {
				res.status(404).json({
					message: "Booking not found!",
				});
			}
			res.status(200).json({message: "Booking updated!"});
		},
	);
});

bookings.delete("/:id", (req, res) => {
	if (req.user.role === "User") {
		let id = req.user.id;
		let bookingID = req.params.id;
		pool.query(
			"DELETE FROM Booking WHERE BookingID = ? AND CustomerID = ?",
			[id],
			(e, results) => {
				if (e) throw e;
				if (results.affectedRows <= 0) {
					res.status(404).json({
						message: "Booking not found!",
					});
				}
				res.status(200).json({
					message: "Booking deleted successfully!",
				});
			},
		);
	} else if (req.user.role === "Admin") {
		let id = req.params.id;
		pool.query(
			"DELETE FROM Booking WHERE BookingID = ?",
			[id],
			(e, results) => {
				if (e) throw e;
				if (results.affectedRows <= 0) {
					res.status(404).json({
						message: "Booking not found!",
					});
				}
				res.status(200).json({
					message: "Booking deleted successfully!",
				});
			},
		);
	}
});

module.exports.bookingRouter = bookings;
