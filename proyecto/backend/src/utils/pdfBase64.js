const fs = require('fs');
const path = require('path');

function getDocumentBase64(filePath) {
    try {
        const fileBytes = fs.readFileSync(filePath);
        return Buffer.from(fileBytes).toString('base64');
    } catch (error) {
        console.error(`Error al leer el documento: ${filePath}`, error);
        throw new Error(`No se pudo encontrar o leer el documento: ${filePath}`);
    }
}

module.exports = {
    getDocumentBase64
};