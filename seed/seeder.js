var async = require("async");
var mongoose = require("mongoose");
var db = require("../models");

// mongoose.connect("mongodb://localhost/inventory", {
mongoose.connect(process.env.DB_URI, {
	useNewUrlParser: true,
	useFindAndModify: false,
});

var categories = [];
var items = [];

function categoryCreate(name, name_lower, cb) {
	var cat = new db.Category({ name: name, name_lower: name_lower });

	cat.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log("New Category: " + cat);
		categories.push(cat);
		cb(null, cat);
	});
}

function itemCreate(name, name_lower, description, category, price, stock, cb) {
	itemdetail = {
		name: name,
		name_lower: name_lower,
		description: description,
		price: price,
		stock: stock,
	};
	if (category != false) itemdetail.category = category;

	var item = new db.Item(itemdetail);
	item.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log("New Item: " + item);
		items.push(item);
		cb(null, item);
	});
}

function createCategories(cb) {
	async.series(
		[
			function (callback) {
				categoryCreate("Breakfast & Cereal", "breakfast & cereal", callback);
			},
			function (callback) {
				categoryCreate(
					"Dairy, Eggs & Cheese",
					"dairy, eggs & cheese",
					callback
				);
			},
			function (callback) {
				categoryCreate("Frozen Foods", "frozen foods", callback);
			},
			function (callback) {
				categoryCreate(
					"Grains, Pasta & Sides",
					"grains, pasta & sides",
					callback
				);
			},
			function (callback) {
				categoryCreate("Meat & Seafood", "meat & seafood", callback);
			},
			function (callback) {
				categoryCreate(
					"Produce: Fruits & Vegetables",
					"produce: fruits & vegetables",
					callback
				);
			},
			function (callback) {
				categoryCreate("Bread & Bakery", "bread & bakery", callback);
			},
			function (callback) {
				categoryCreate(
					"Cookies, Snacks, & Candy",
					"cookies, snacks, & candy",
					callback
				);
			},
		],
		// optional callback
		cb
	);
}

function createItems(cb) {
	async.parallel(
		[
			function (callback) {
				itemCreate(
					"Peas",
					"peas",
					"Round and green",
					categories[2],
					2.0,
					50,
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Carrots",
					"carrots",
					"Crisp and orange",
					categories[2],
					1.5,
					60,
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Fruit Loops",
					"fruit loops",
					"Colorful",
					categories[0],
					4.0,
					100,
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Cookie Crisp",
					"cookie crisp",
					"Chocolate Chip",
					categories[0],
					5.53,
					120,
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Apple Jacks",
					"apple jacks",
					"A touch of cinnamon",
					categories[0],
					3.0,
					200,
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Orange",
					"orange",
					"Orange you glad I didn't say banana?",
					categories[5],
					1.2,
					33,
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Banana",
					"banana",
					"Not an orange",
					categories[5],
					1.1,
					40,
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Penne Pasta",
					"penne pasta",
					"The best",
					categories[3],
					2.0,
					500,
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Linguini Pasta",
					"linguini pasta",
					"Why not buy penne?",
					categories[3],
					1.9,
					47,
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Chicken",
					"chicken",
					"Don't be",
					categories[4],
					9.83,
					20,
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Greek Yogurt",
					"greek yogurt",
					"Lots of protein",
					categories[1],
					1.25,
					90,
					callback
				);
			},
			function (callback) {
				itemCreate("Milk", "milk", "Whole", categories[1], 3.0, 101, callback);
			},
			function (callback) {
				itemCreate(
					"Cheese",
					"cheese",
					"Very cheesey",
					categories[1],
					5.5,
					26,
					callback
				);
			},
			function (callback) {
				itemCreate(
					"French Bread",
					"french bread",
					"From Paris with love",
					categories[6],
					5.23,
					18,
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Snickers",
					"snickers",
					"Satisfies",
					categories[7],
					1.75,
					107,
					callback
				);
			},
			function (callback) {
				itemCreate(
					"Lucky Charms",
					"lucky charms",
					"Magically Delicious",
					categories[0],
					1.75,
					107,
					callback
				);
			},
		],
		// optional callback
		cb
	);
}

db.Category.deleteMany({})
	.then(() => db.Item.deleteMany({}))
	.then(() => {
		async.series(
			[createCategories, createItems],
			// Optional callback
			function (err, results) {
				if (err) {
					console.log("FINAL ERR: " + err);
				} else {
					console.log(results.length + " records inserted!");
				}
				// All done, disconnect from database
				mongoose.connection.close();
			}
		);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
