const express = require('express');
const router = express.Router();
const multer = require('multer');
//const upload = multer({ dest: 'uploads/'});
const login = require('../middleware/login');

const produtosController = require('../controllers/produtos-controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
    // cb(null, true);
    // cb(null, false);
}

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //5Mb
    },
    fileFilter: fileFilter
 });

router.get('/', produtosController.getProdutos);
router.get('/:id_produto', produtosController.getUmProduto);
router.post(
    '/', 
    login.obrigatorio, 
    upload.single('produto_imagem'), 
    produtosController.postProduto
);
router.patch(
    '/', 
    login.obrigatorio, 
    produtosController.patchProduto
);
router.delete(
    '/', 
    login.obrigatorio, 
    produtosController.deleteProduto
);

module.exports = router;