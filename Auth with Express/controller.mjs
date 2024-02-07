import { User } from "./models.mjs";

export async function createUser(obj) {
	return await User.create(obj);
}

export async function findUser(query) {
	return await User.findOne(query);
}

export async function getUser() {
	return await User.find().select({
		email: 1,
		name: 1,
		username: 1,
		password: 1,
	});
}
