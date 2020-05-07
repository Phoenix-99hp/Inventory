var db = require('../models');
var async = require('async');

exports.category_search_get = (req, res, next) => {
    db.Category.find()
        .sort([["name", "ascending"]])
        .lean({ virtuals: true })
        .exec((err, results) => {
            if (err) { return next(err); }
            else if ((results[0] !== null) && (results[0] !== undefined)) {
                res.render('category_search', { results: results });
            }
            else {
                res.render('category_search_none', { results: null });
            }
        });
    return;
}

exports.category_detail = (req, res, next) => {

    async.parallel({
        items: function (callback) {
            db.Item.find({ category: req.params.id })
                .lean({ virtuals: true })
                .exec(callback);
        },
        category: function (callback) {
            db.Category.findById(req.params.id)
                .lean({ virtuals: true })
                .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render("category_detail", { items: results.items, category: results.category });
    });

};

exports.category_create_get = (req, res, next) => {

    res.render("category_create");

};

exports.category_create_post = (req, res, next) => {

    var adjustedName = req.body.name.trim();
    if (/^[a-z0-9\/\s!\-:&']+$/i.test(adjustedName) === true) {

        var category = new db.Category(
            {
                name: adjustedName,
                name_lower: adjustedName.toLowerCase()
            });

        category.save(function (err) {
            if (err) { return next(err); }
            res.redirect(category.url);
        });
    }
    else {
        res.render("error", { title: "Invalid category name", message: "The category name you have entered is invalid. Category names may only consist of alphanumeric characters, slashes, dashes, exclamation marks, colons, and '&'." });
    }

};

exports.category_update_get = (req, res, next) => {

    db.Category.findById(req.params.id)
        .sort([["name", "ascending"]])
        .lean({ virtuals: true })
        .exec((err, results) => {
            if (err) { return next(err); }
            res.render("category_update", { category: results });
        });

};

exports.category_update_post = (req, res, next) => {

    var adjustedName = req.body.name.trim();
    if (/^[a-z0-9\/\s!\-:&']+$/i.test(adjustedName) === true) {

        var category = new db.Category(
            {
                name: adjustedName,
                name_lower: adjustedName.toLowerCase(),
                _id: req.params.id
            });

        db.Category.findByIdAndUpdate(req.params.id, category, { virtuals: true }, function (err, thecategory) {
            if (err) { return next(err); }
            res.redirect(thecategory.url);
        });
    }
    else {
        res.render("error", { title: "Invalid category name", message: "The category name you have entered is invalid. Category names may only consist of alphanumeric characters, slashes, dashes, exclamation marks, colons, and '&'." });
    }

}

exports.category_delete_get = (req, res, next) => {

    db.Category.findById(req.params.id)
        .lean({ virtuals: true })
        .exec((err, results) => {
            if (err) { return next(err); }
            if (results == null) {
                res.redirect('/store/categories');
            }
            res.render('category_delete', { category: results });
        });

};

exports.category_delete_post = (req, res, next) => {

    async.parallel({
        items: function (callback) {
            db.Item.find({ category: req.params.id }, 'category')
                .remove()
                .lean({ virtuals: true })
                .exec(callback);
        },
        category: function (callback) {
            db.Category.findByIdAndRemove(req.params.id)
                .lean({ virtuals: true })
                .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.redirect('/store/categories/search');
    });

};