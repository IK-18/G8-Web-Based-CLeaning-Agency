require("dotenv").config();
const express = require("express");
const services = express.Router();
const {pool} = require("../utils/db");

services.get("/", (req, res) => {
	pool.query("SELECT * FROM ServicePackage", (e, results) => {
		if (e) {
			res.status(400).json({message: "Error in query", error: e});
		}
		res.status(200).send(results);
	});
});

services.get("/:id", (req, res) => {
	let id = req.params.id;
	pool.query(
		"SELECT * FROM ServicePackage WHERE PackageID = ?",
		[id],
		(e, results) => {
			if (e) {
				res.status(400).json({message: "Error in query", error: e});
			}
			if (results.length <= 0) {
				res.status(404).json({
					message: "Service Package not found!",
				});
			}
			let package = results[0];
			res.status(200).json(package);
		},
	);
});

services.post("/", (req, res) => {
	if (req.user.role === "Admin") {
		let name = req.body.name;
		let desc = req.body.desc;
		let price = req.body.price;
		pool.query(
			"INSERT INTO ServicePackage (Name, Description, Price) VALUES (?, ?, ?)",
			[name, desc, price],
			(e, results) => {
				if (e) {
					res.status(400).json({message: "Error in query", error: e});
				}
				let serviceId = results.insertId;
				res.status(200).json({
					message: "Created Service Package successully!",
					id: serviceId,
				});
			},
		);
	} else {
		res.status(403).json({message: "User not authenticated/authorized"});
	}
});

services.put("/:id", (req, res) => {
	if (req.user.role === "Admin") {
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
			`UPDATE ServicePackage SET ${updateClause} WHERE PackageID = ?`,
			[id],
			(e, results) => {
				if (e) {
					res.status(400).json({message: "Error in query", error: e});
				}
				if (results.affectedRows <= 0) {
					res.status(404).json({
						message: "Service Package not found!",
					});
				}
				res.status(200).json({message: "Service Package updated!"});
			},
		);
	} else {
		res.status(403).json({message: "User not authorized/authenticated"});
	}
});

services.delete("/:id", (req, res) => {
	if (req.user.role === "Admin") {
		let id = req.params.userId;
		pool.query(
			"DELETE FROM ServicePackage WHERE PackageID = ?",
			[id],
			(e, results) => {
				if (e) {
					res.status(400).json({message: "Error in query", error: e});
				}
				res.status(200).json({message: "User deleted successfully!"});
			},
		);
	} else {
		res.status(403).json({message: "User not authorized/authenticated"});
	}
});

module.exports.servicesRouter = services;
