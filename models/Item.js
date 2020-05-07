var mongoose = require('mongoose');
var mongooseLeanVirtuals = require('mongoose-lean-virtuals');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
        name: { type: String, required: true },
        name_lower: { type: String, required: true },
        description: { type: String },
        category: { type: Schema.Types.ObjectId, ref: "Category" },
        price: { type: Number, required: true },
        stock: { type: Number }
    }
);

ItemSchema
    .virtual('url')
    .get(function () {
        return '/store/products/details/' + this._id;
    });

ItemSchema.plugin(mongooseLeanVirtuals);
module.exports = mongoose.model("Item", ItemSchema);