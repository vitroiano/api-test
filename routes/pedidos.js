const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query( `SELECT pedidos.id_pedidos,
                            pedidos.quantidade,
                            produtos.id_produtos,
                            produtos.nome,
                            produtos.preco          
                    FROM pedidos 
                INNER JOIN produtos
                        ON produtos.id_produtos = pedidos.id_produtos;`,
            (error, result, fields) => {
                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    pedidos: result.map(pedido => {
                        return{
                            id_pedidos: pedido.id_pedidos,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produtos: pedido.id_produtos,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna o detalhe de um pedido em especifico',
                                url: 'http://localhost:1000/pedidos/' + pedido.id_pedidos
                            }
                            
                        }
                    })
                }
                return res.status(200).send({response: response});
            }
        )
    });
});

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedidos = ?;',
            [req.params.id_pedido],
            (error, result, fields) => {
                if(error){ return res.status(500).send({ error: error }) }
                // somente entrar, se nao tiver resultados
                if(result.length <= 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado pedido com este ID'
                    })
                }
                
                const response = {
                    produto: {
                        id_pedidos: result[0].id_pedidos,
                        id_produto: result[0].id_produtos,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: 'http://localhost:1000/pedidos/'
                        }   
                    }
                }
                return res.status(200).send({response: response});
            }
        )
    });
});

// INSERE UM PEDIDO
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM produtos where id_produtos = ?', 
        [req.body.id_produtos], 
        (error, result, field) => {
            //conn.release();
            if(error){ return res.status(500).send({ error: error }) }
            if(result.length == 0){
                return res.status(404).send({
                    mensagem: 'Produto não encontrado'
                });
            }

            conn.query(
                'INSERT INTO pedidos (id_produtos, quantidade) VALUES (?, ?)',
                [req.body.id_produtos, req.body.quantidade],
                (error, result, field) => {
                    conn.release();
    
                    if(error){ return res.status(500).send({ error: error }) }
                    const response = {
                        mensagem: 'Pedido inserido com sucesso',
                        produtoCriado: {
                            id_pedidos: result.id_pedidos,
                            id_produtos: req.body.id_produtos,
                            quantidade: req.body.quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os pedidos',
                                url: 'http://localhost:1000/pedidos/'
                            }
                        }
                    }
                    res.status(201).send(response);
                }    
            )
        })
    });
});

// EXCLUI UM PEDIDO
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        
        if(error){ return res.status(500).send({ error: error }) }

        conn.query(
            'DELETE FROM pedidos WHERE id_pedidos  = ?',
            [req.body.id_pedidos],
            (error, resultado, field) => {
                // console.log(error);
                conn.release();

                if(error){ return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Pedido removido com sucesso!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um pedido',
                        url: 'http://localhost:1000/pedidos/',
                        body: {
                            id_produtos: 'Number',
                            quantidade: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);
            }    
        )
    });
});

module.exports = router;