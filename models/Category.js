var mongoose = require('mongoose');
var mongooseLeanVirtuals = require('mongoose-lean-virtuals');

var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        name: { type: String, required: true },
        name_lower: { type: String, required: true }
    }
);

CategorySchema
    .virtual('url')
    .get(function () {
        return '/store/categories/details/' + this._id;
    });

CategorySchema.plugin(mongooseLeanVirtuals);
module.exports = mongoose.model("Category", CategorySchema);