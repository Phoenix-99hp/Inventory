var register = function (Handlebars) {
    var helpers = {

        stringify: function (arg1, arg2, options) {
            return arg1.toString() + arg2;
        },
        isSelected: function (arg1, arg2, options) {
            if (arg1.toString() == arg2.toString()) {
                return "selected";
            }
            else {
                return "false";
            }
        },
        priceify: function (arg, options) {
            let string = arg.toString();
            let decIndex = string.indexOf(".");
            const arr = [];
            const dollar = ["$"];

            if ((string.match(/.\d+$/) !== null) && (string.match(/.\d+$/)[0].length < 3)) {
                string += "0";
            }
            if (decIndex !== -1) {
                for (let i = 0; i < string.length; i++) {
                    arr.push(string.charAt(i));
                }
                let j = decIndex
                while (j > 0) {
                    j -= 3;
                    if (j > 0) {
                        arr.splice(j, 0, ",");
                    }
                }
                if (arr.includes("$")) {
                    return arr.join("");
                }
                else {
                    const withDollar = dollar.concat(arr);
                    return withDollar.join("");
                }
            }
            else {
                for (let i = 0; i < string.length; i++) {
                    arr.push(string.charAt(i));
                }
                let k = arr.length;
                while (k > 0) {
                    k -= 3;
                    if (k > 0) {
                        arr.splice(k, 0, ",");
                    }
                }
                if (arr.includes("$")) {
                    return arr.join("");
                }
                else {
                    const withDollar = dollar.concat(arr);
                    return withDollar.join("");
                }
            }
        },
        dePriceify: function (arg, options) {
            const string = arg.toString();
            const arr = [];
            for (let i = 0; i < string.length; i++) {
                arr.push(string.charAt(i));
            }
            while (arr.includes(",")) {
                arr.splice(arr.indexOf(","), 1);
            }
            return arr.join("");
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }

};

module.exports.register = register;
module.exports.helpers = register(null);   