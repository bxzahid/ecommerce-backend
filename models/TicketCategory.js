const mongoose = require("mongoose")
const {
	Schema,
	model
} = mongoose

const ticketCategorySchema = new Schema({
	title: {
		type: String,
		trim: true
	},
	live: Boolean,
	associatedWith: [{
		type: Schema.Types.ObjectId,
		ref: "Admin"
	}],
	creator: {
		type: Schema.Types.ObjectId,
		ref: "Admin"
	}
}, {
	timestamps: true
});

const TicketCategory = model("TicketCategory", ticketCategorySchema);

module.exports = TicketCategory;