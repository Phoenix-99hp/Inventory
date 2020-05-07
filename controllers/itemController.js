var db = require('../models');
var async = require('async');

exports.index = (req, res, next) => {

    db.Item.find({}, "name description price stock")
        .populate("category")
        .sort([["name", "ascending"]])
        .lean({ virtuals: true })
        .exec((err, results) => {
            if (err) { return next(err); }
            res.render("index", { title: "Smart-Mart", products: results });
        });

};

exports.item_search_get = (req, res, next) => {
    res.render("item_search");
}

exports.item_search_post = (req, res, next) => {

    var adjusted = req.body.name.toLowerCase().trim();
    if (/^[a-z0-9\/\s!\-&]+$/.test(adjusted) === true) {

        db.Item.find({ name_lower: adjusted })
            .populate("category")
            .sort([["name", "ascending"]])
            .lean({ virtuals: true })
            .exec((err, results) => {
                if (err) { return next(err); }
                else if ((results[0] !== null) && (results[0] !== undefined)) {
                    res.render('item_search', { results: results });
                }
                else {
                    res.render('item_search_none', { results: null });
                }
            });
        return;
    }
    else {
        res.render('error', { title: "Invalid search", message: "Only alphanumeric characters, slashes, dashes, exclamation marks, and '&' can be used when searching for a product" });
    }
}

exports.item_detail = (req, res, next) => {

    db.Item.findById(req.params.id)
        .populate("category")
        .lean({ virtuals: true })
        .exec((err, results) => {
            if (err) { return next(err); }
            res.render("item_detail", { details: results });
        });

};

exports.item_create_get = (req, res, next) => {

    db.Category.find()
        .sort([["name", "ascending"]])
        .lean()
        .exec((err, results) => {
            if (err) { return next(err); }
            res.render("item_create", { categories: results });
        });

};

exports.item_create_post = (req, res, next) => {

    var adjustedName = req.body.name.trim();
    var adjustedDescription = req.body.description.trim();
    var adjustedPrice = req.body.price.trim().replace(/,/g, '').replace(/\$/, '');
    var adjustedStock = req.body.stock.trim().replace(/,/g, '');

    if (adjustedPrice > 1000) {
        res.render("error", { title: "Invalid price entry", message: "We don't sell anything that expensive" });
    }

    else if (adjustedStock > 1000) {
        res.render("error", { title: "Invalid stock entry", message: "We don't carry that many products" });
    }

    else if (adjustedName.length > 30) {
        res.render("error", { title: "Invalid product name entry", message: "We don't use long product names" });
    }

    else if (adjustedDescription.length > 100) {
        res.render("error", { title: "Invalid description", message: "Keep it simple" });
    }

    else if ((/^[a-z0-9\/\s!\-&']+$/i.test(adjustedName) === true) && (/^[a-z0-9,\.\s\-\/!;?:']*$/i.test(adjustedDescription) === true) && (/^[0-9\.\$]+$/.test(adjustedPrice) === true) && (/[0-9]*/.test(adjustedStock) === true)) {
        function checkPrice(adj) {

            if (adj.toString().match(/\.\d+$/) == null)
                return adj;
            else if (adj.toString().match(/\.\d+$/)[0].length > 3) {
                return adj.toString().match(/^\d+/)[0] + adj.toString().match(/\.\d+$/)[0].slice(0, 3);
            }
            else {
                return adj;
            }
        }

        var item = new db.Item(
            {
                name: adjustedName,
                name_lower: adjustedName.toLowerCase(),
                description: adjustedDescription,
                category: req.body.category,
                price: checkPrice(adjustedPrice),
                stock: adjustedStock
            });

        item.save(function (err) {
            if (err) { return next(err); }
            res.redirect(item.url);
        });
    }
    else {
        res.render("error", { title: "Invalid field entry", message: "One or more field entries is invalid" });
    }
};

exports.item_update_get = (req, res, next) => {

    async.parallel({
        item: function (callback) {
            db.Item.findById(req.params.id)
                .populate("category")
                .lean({ virtuals: true })
                .exec(callback);
        },
        categories: function (callback) {
            db.Category.find()
                .sort([["name", "ascending"]])
                .lean()
                .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render("item_update", { toUpdate: results.item, categories: results.categories });
    });
};

exports.item_update_post = (req, res, next) => {

    var adjustedName = req.body.name.trim();
    var adjustedDescription = req.body.description.trim();
    var adjustedPrice = req.body.price.trim().replace(/,/g, '').replace(/\$/, '');
    var adjustedStock = req.body.stock.trim().replace(/,/g, '');

    if (adjustedPrice > 1000) {
        res.render("error", { title: "Invalid price entry", message: "We don't sell anything that expensive" });
    }

    else if (adjustedStock > 1000) {
        res.render("error", { title: "Invalid stock entry", message: "We don't carry that many products" });
    }

    else if (adjustedName.length > 30) {
        res.render("error", { title: "Invalid product name entry", message: "We don't use long product names" });
    }

    else if (adjustedDescription.length > 100) {
        res.render("error", { title: "Invalid description", message: "Keep it simple" });
    }

    else if ((/^[a-z0-9\/\s!\-&']+$/i.test(adjustedName) === true) && (/^[a-z0-9,\.\s\-\/!?;:']*$/i.test(adjustedDescription) === true) && (/^[0-9\.\$]+$/.test(adjustedPrice) === true) && (/[0-9]*/.test(adjustedStock) === true)) {

        function checkPrice(adj) {

            if (adj.toString().match(/\.\d+$/) == null)
                return adj;
            else if (adj.toString().match(/\.\d+$/)[0].length > 3) {
                return adj.toString().match(/^\d+/)[0] + adj.toString().match(/\.\d+$/)[0].slice(0, 3);
            }
            else {
                return adj;
            }
        }

        db.Category.findOne({ name: req.body.category })
            .lean({ virtuals: true })
            .exec((err, result) => {
                if (err) { return next(err); }
                var item = new db.Item(
                    {
                        name: adjustedName,
                        name_lower: adjustedName.toLowerCase(),
                        description: adjustedDescription,
                        category: result,
                        price: checkPrice(adjustedPrice),
                        stock: adjustedStock,
                        _id: req.params.id
                    });

                db.Item.findByIdAndUpdate(req.params.id, item, { virtuals: true }, function (err, theitem) {
                    if (err) { return next(err); }
                    res.redirect(theitem.url);
                });

            });


        // var item = new db.Item(
        //     {
        //         name: adjustedName,
        //         name_lower: adjustedName.toLowerCase(),
        //         description: adjustedDescription,
        //         category: cat,
        //         price: checkPrice(adjustedPrice),
        //         stock: adjustedStock,
        //         _id: req.params.id
        //     });

        // db.Item.findByIdAndUpdate(req.params.id, item, { virtuals: true }, function (err, theitem) {
        //     if (err) { return next(err); }
        //     res.redirect(theitem.url);
        // });
    }
    else {
        res.render("error", { title: "Invalid field entry", message: "One or more field entries is invalid" })
    }
}

exports.item_delete_get = (req, res, next) => {

    db.Item.findById(req.params.id)
        .lean({ virtuals: true })
        .populate("category")
        .exec((err, results) => {
            if (err) { return next(err); }
            if (results == null) {
                res.redirect('/store');
            }
            res.render('item_delete', { item: results });
        });

};

exports.item_delete_post = (req, res, next) => {

    db.Item.findById(req.params.id)
        .lean({ virtuals: true })
        .exec((err, results) => {
            if (err) { return next(err); }
            db.Item.findByIdAndRemove(req.params.id, function deleteItem(err) {
                if (err) { return next(err); }
                res.redirect('/store')
            })
        });

};