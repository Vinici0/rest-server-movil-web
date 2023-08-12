const pdf = require('html-pdf');
const pdfTemplate = require('../prueba/public/pdfTemplate');
const path = require("path");

const createDocument = async (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
        if (err) {
            res.send(Promise.reject());
        }

        res.send(Promise.resolve());
    });
};

const getDocument = async (req, res) => {
    res.sendFile(path.join(__dirname, '../result.pdf'));
};

module.exports = { createDocument, getDocument };