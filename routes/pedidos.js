const express = require('express');
const router = express.Router();

const pedidosController = require('../controllers/pedidos-controller');

router.get('/', pedidosController.getPedidos);
router.get('/:id_pedido', pedidosController.getUmPedido);
router.post('/', pedidosController.postPedidos);
router.delete('/', pedidosController.deletePedido);

module.exports = router;