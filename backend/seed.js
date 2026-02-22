import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Transaction from "./models/transaction.model.js";

dotenv.config();

const seed = async () => {
	await mongoose.connect(process.env.MONGO_URI);
	console.log("Connected to DB");

	await User.deleteMany();
	await Transaction.deleteMany();
	console.log("Cleared existing data");

	const hashedPassword = await bcrypt.hash("password123", 10);

	const users = await User.insertMany([
		{ username: "alice", name: "Alice", password: hashedPassword, gender: "female" },
		{ username: "bob", name: "Bob", password: hashedPassword, gender: "male" },
		{ username: "charlie", name: "Charlie", password: hashedPassword, gender: "male" },
	]);

	await Transaction.insertMany([
		{ userId: users[0]._id, description: "Groceries", paymentType: "cash", category: "expense", amount: 80, date: new Date("2024-01-05") },
		{ userId: users[0]._id, description: "Stock investment", paymentType: "card", category: "investment", amount: 500, date: new Date("2024-01-10") },
		{ userId: users[1]._id, description: "Monthly savings", paymentType: "card", category: "saving", amount: 300, date: new Date("2024-01-12") },
		{ userId: users[1]._id, description: "Netflix", paymentType: "card", category: "expense", amount: 15, date: new Date("2024-01-15") },
		{ userId: users[2]._id, description: "Freelance income saved", paymentType: "cash", category: "saving", amount: 1000, date: new Date("2024-01-20") },
	]);

	console.log("Seeded users:", users.map((u) => u.username));
	console.log("Seeded 5 transactions");
	await mongoose.disconnect();
};

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
