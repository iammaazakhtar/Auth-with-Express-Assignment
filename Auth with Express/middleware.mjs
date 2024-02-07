import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { findUser } from "./controller.mjs";

export async function hashPassword(req, _, next){
	const salt = await bcrypt.genSalt(7)
	req.body =Object.assign(req.body, {salt, password: await bcrypt.hash(req.body.password, salt)})
	next()
}

export function signupKeyValidate(req, res, next) {
	const payloadCheckList = ["name", "email", "password", "username"];
	const isValid = payloadCheckList.every(key => key in req.body)
	if (isValid) {
		next();
	} else {
		throw new Error("Sign up key verification failed")
	}
}

export function loginKeyValidate(req, _, next) {
	const payloadCheckList = ["password", "username"];
	const isValid = payloadCheckList.every(key => key in req.body)
	if (isValid) {
		next();
	} else {
		throw new Error("Login key verification failed")
	}
}

function extractUserData(token){
	return jwt.decode(token, process.env.JWT_SECRET)
}

function updateRequestObject(requestObj, key, data){
	requestObj[key] = data
}

export async function verifyToken(req, _, next){
	const token = req.header("authorization")?.split(" ")[1]
	console.log("1",req.header("authorization"))
	console.log("2", token)
	console.log("3", req.headers)
	if(jwt.verify(token, process.env.JWT_SECRET)){
		updateRequestObject(req, "user", extractUserData(token))
		next()
	}else{
		throw new Error("JWT token verification failed.")
	}
}

export async function createJWTToken(req, res, next){
	const user = await findUser({username: req.body.username})
	const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET)
	res.setHeader("authorization", `Bearer ${token}`)
	req.user = user
	next()
}