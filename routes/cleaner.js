require("dotenv").config();
const express = require("express");
const cleaners = express.Router();
const {pool} = require("../utils/db");

cleaners.get("/", (req, res) => {
	pool.query("SELECT * FROM Cleaner", (e, results) => {
		if (e) {
			res.status(400).json({message: "Error in query", error: e});
		}
		res.status(200).send(results);
	});
});

cleaners.get("/:id", (req, res) => {
	let id = req.params.id;
	pool.query(
		"SELECT * FROM Cleaner WHERE CleanerID = ?",
		[id],
		(e, results) => {
			if (e) {
				res.status(400).json({message: "Error in query", error: e});
			}
			if (results.length <= 0) {
				res.status(404).json({
					message: "Cleaner not found!",
				});
			}
			res.status(200).json(results[0]);
		},
	);
});

cleaners.post("/", (req, res) => {
	let name = req.body.name;
	pool.query(
		"INSERT INTO Cleaner (Name) VALUES (?)",
		[name],
		(e, results) => {
			if (e) {
				res.status(400).json({message: "Error in query", error: e});
			}
			let CleanerID = results.insertId;
			res.status(200).json({
				message: "Created Cleaner successully!",
				id: CleanerID,
			});
		},
	);
});

cleaners.put("/:id", (req, res) => {
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
		`UPDATE Cleaner SET ${updateClause} WHERE CleanerID = ?`,
		[id],
		(e, results) => {
			if (e) {
				res.status(400).json({message: "Error in query", error: e});
			}
			if (results.affectedRows <= 0) {
				res.status(404).json({
					message: "Cleaner not found!",
				});
			}
			res.status(200).json({message: "Cleaner updated!"});
		},
	);
});

cleaners.delete("/:id", (req, res) => {
	let id = req.params.id;
	pool.query(
		"DELETE FROM Cleaner WHERE CleanerID = ?",
		[id],
		(e, results) => {
			if (e) {
				res.status(400).json({message: "Error in query", error: e});
			}
			if (results.affectedRows <= 0) {
				res.status(404).json({
					message: "Cleaner not found!",
				});
			}
			res.status(200).json({message: "Cleaner deleted successfully!"});
		},
	);
});

module.exports.cleanerRouter = cleaners;
