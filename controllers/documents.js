const pdf = require('html-pdf');
const pdfTemplate = require('../prueba/public/pdfTemplate');
const path = require("path");

const createDocument = async (req, res) => {
 res.send('PDF');
};

const getDocument = async (req, res) => {
    res.sendFile(path.join(__dirname, 'datos.pdf'));
};

module.exports = { createDocument, getDocument };