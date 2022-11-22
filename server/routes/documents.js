var express = require("express");
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator')
const Document = require('../models/document')

router.get('/', (req, res, next) => {
    const documents = Document.find()
    if (!documents) {
        return 
    }
})

module.exports = router;
