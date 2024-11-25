require("dotenv").config();
const express = require("express");
const feedback = express.Router();
const {pool} = require("../utils/db");

feedback.get("/", (req, res) => {
	if (req.user.role === "User") {
		let id = req.user.id;
		pool.query(
			"SELECT * FROM Feedback WHERE CustomerID = ?",
			[id],
			(e, results) => {
				if (e) throw e;
				res.status(200).send(results);
			},
		);
	} else if (req.user.role === "Admin") {
		pool.query("SELECT * FROM Feedback", (e, results) => {
			if (e) throw e;
			res.status(200).send(results);
		});
	}
});

feedback.get("/cleaner/:id", (req, res) => {
	if (req.user.role === "User") {
		let id = req.user.id;
		let cleanerID = req.body.id;
		pool.query(
			"SELECT * FROM Feedback WHERE CleanerID = ? AND CustomerID = ?",
			[cleanerID, id],
			(e, results) => {
				if (e) throw e;
				if (results.length <= 0) {
					res.status(404).json({
						message: "Feedback not found!",
					});
				}
				res.status(200).json(results);
			},
		);
	} else if (req.user.role === "Admin") {
		let id = req.body.id;
		pool.query(
			"SELECT * FROM Feedback WHERE CleanerID = ?",
			[id],
			(e, results) => {
				if (e) throw e;
				if (results.length <= 0) {
					res.status(404).json({
						message: "Feedback not found!",
					});
				}
				res.status(200).json(results);
			},
		);
	}
});

feedback.post("/", (req, res) => {
	let id = req.user.id;
	let cleanerID = req.body.id;
	let rating = req.body.rating;
	let comments = req.body.comments;
	pool.query(
		"INSERT INTO Feedback (CustomerID, CleanerID, Rating, Comments) VALUES (?, ?, ?, ?)",
		[id, cleanerID, rating, comments],
		(e, results) => {
			if (e) throw e;
			let FeedbackID = results.insertId;
			res.status(200).json({
				message: "Created Feedback successully!",
				id: FeedbackID,
			});
		},
	);
});

feedback.put("/:id", (req, res) => {
	if (req.user.role === "User") {
		let id = req.user.id;
		let feedbackID = req.params.id;
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
			`UPDATE Feedback SET ${updateClause} WHERE FeedbackID = ? AND CustomerID = ?`,
			[feedbackID, id],
			(e, results) => {
				if (e) throw e;
				if (results.affectedRows <= 0) {
					res.status(404).json({
						message: "Feedback not found!",
					});
				}
				res.status(200).json({message: "Feedback updated!"});
			},
		);
	} else if (req.user.role === "Admin") {
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
			`UPDATE Feedback SET ${updateClause} WHERE FeedbackID = ?`,
			[id],
			(e, results) => {
				if (e) throw e;
				if (results.affectedRows <= 0) {
					res.status(404).json({
						message: "Feedback not found!",
					});
				}
				res.status(200).json({message: "Feedback updated!"});
			},
		);
	}
});

feedback.delete("/:id", (req, res) => {
	if (req.user.role === "User") {
		let id = req.user.id;
		let feedbackID = req.params.id;
		pool.query(
			"DELETE FROM Feedback WHERE FeedbackID = ? AND CustomerID = ?",
			[feedbackID, id],
			(e, results) => {
				if (e) throw e;
				if (results.affectedRows <= 0) {
					res.status(404).json({
						message: "Feedback not found!",
					});
				}
				res.status(200).json({
					message: "Feedback deleted successfully!",
				});
			},
		);
	} else if (req.user.role === "Admin") {
		let id = req.params.id;
		pool.query(
			"DELETE FROM Feedback WHERE FeedbackID = ?",
			[id],
			(e, results) => {
				if (e) throw e;
				if (results.affectedRows <= 0) {
					res.status(404).json({
						message: "Feedback not found!",
					});
				}
				res.status(200).json({
					message: "Feedback deleted successfully!",
				});
			},
		);
	}
});

module.exports.feedbackRouter = feedback;
