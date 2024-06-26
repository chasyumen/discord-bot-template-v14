import { Schema, model as _model } from "mongoose";
import config from "../../../config.js";

const model = Schema({
	userId: { type: String || null, default: null },
	language: { type: String || null, default: null },
	// lastLanguage: { type: String || null, default: null },
});

export default _model("user", model);