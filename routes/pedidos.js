const express = require('express');
const router = express.Router();

// RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem : 'Retorna os pedidos'
    });
});

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_produto', (req, res, next) => {

    const id = req.params.id_produto
    res.status(200).send({
        mensagem : 'Detalhes do pedido',
        id_pedido : id
    });

});

// INSERE UM PEDIDO
router.post('/', (req, res, next) => {
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    };
    res.status(201).send({
        mensagem : 'O pedido foi criado',
        pedidoCriado: pedido
    });
});

// EXCLUI UM PEDIDO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem : 'Pedido excluido'
    });
});

module.exports = router;