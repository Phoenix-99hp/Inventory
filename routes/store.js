var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoryController');
var item_controller = require('../controllers/itemController');

router.get('/', item_controller.index);

router.get('/products/create', item_controller.item_create_get);

router.post('/products/create', item_controller.item_create_post);

router.get('/products/details/:id/delete', item_controller.item_delete_get);

router.post('/products/details/:id/delete', item_controller.item_delete_post);

router.get('/products/details/:id/update', item_controller.item_update_get);

router.post('/products/details/:id/update', item_controller.item_update_post);

router.get('/products/details/:id', item_controller.item_detail);

router.get('/products/search', item_controller.item_search_get);

router.post('/products/search', item_controller.item_search_post);

router.get('/categories/create', category_controller.category_create_get);

router.post('/categories/create', category_controller.category_create_post);

router.get('/categories/details/:id/delete', category_controller.category_delete_get);

router.post('/categories/details/:id/delete', category_controller.category_delete_post);

router.get('/categories/details/:id/update', category_controller.category_update_get);

router.post('/categories/details/:id/update', category_controller.category_update_post);

router.get('/categories/details/:id', category_controller.category_detail);

router.get('/categories/search', category_controller.category_search_get);

module.exports = router;