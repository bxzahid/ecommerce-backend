const mongoose = require("mongoose")
const {
	Schema,
	model
} = mongoose

const notificationSchema = new Schema({
	title: {
		type: String,
		trim: true
	},
	link: {
		type: String,
		trim: true
	},
	read: Boolean
}, {
	timestamps: true
});

const Notification = model("Notification", notificationSchema);

module.exports = Notification;