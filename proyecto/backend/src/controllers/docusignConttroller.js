// Configuracion de DocuSign
const docusign = require('docusign-esign');
const fs = require('fs');
const path = require('path');

const DS_CONFIG = {
    integrationKey: process.env.DS_INTEGRATION_KEY, 
    userId: process.env.DS_USER_ID, 
    apiAccountId: process.env.DS_API_ACCOUNT_ID, 
    basePath: "https://demo.docusign.net/restapi",
    privateKeyPath: path.resolve(__dirname, '../../docusign_private.key'),
    oauthBasePath: "account-d.docusign.com" 
};

//
async function getDocuSignAccessToken() {
    const apiClient = new docusign.ApiClient();
    apiClient.setOAuthBasePath(DS_CONFIG.oauthBasePath);
    let privateKey;
    try {
        privateKey = fs.readFileSync(DS_CONFIG.privateKeyPath);
    } catch (ex) {
        console.error("Error: No se pudo leer la clave privada:", DS_CONFIG.privateKeyPath);
        throw new Error("Error de configuración: docusign_private.key no encontrada.");
    }
    const scopes = ["signature", "impersonation"];
    try {
        console.log('pre apiclient');
        const results = await apiClient.requestJWTUserToken(
            DS_CONFIG.integrationKey,
            DS_CONFIG.userId,
            scopes,
            privateKey,
            3600 
        );
        console.log('post apiclient');
        return results.body.access_token;
    } catch (error) {
        console.error("Error al obtener token de DocuSign:", error);
        throw error;
    }
}

async function getApiClient() {
    console.log('pre accesstoken');
    const accessToken = await getDocuSignAccessToken();
    console.log('post accesstoken');
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(DS_CONFIG.basePath);
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    return apiClient;
}


// Aca realmente empieza el controller, lo de antes lo pude haber separado mas pero era solo complicar mas la cosa
const { getDocumentBase64 } = require('../utils/pdfBase64');

// Funcion para la vista de iniciarFirma
async function iniciarFirma(req, res) {
    const {emailCliente, nombreCliente} = req.body;

    if(!emailCliente || !nombreCliente){
        return res.status(400).send({error: 'Faltan email y nombre Cliente'})
    }
    try {
        const docPath = path.resolve(__dirname, '../../pruebaa.pdf')
        // 1. Obtenemos el cliente de API autenticado
        const apiClient = await getApiClient();
        const envelopesApi = new docusign.EnvelopesApi(apiClient);

        // 2. Creamos el "Sobre" (Envelope)
        let env = new docusign.EnvelopeDefinition();
        env.emailSubject = 'Por favor, firma tus documentos de crédito';
        env.status = 'sent'; // "sent" envía el email al firmante inmediatamente

        // 3. se crean los documentos a firmar
        let doc1 = new docusign.Document();
        doc1.documentBase64 = getDocumentBase64(docPath);
        doc1.name = 'Contrato de Crédito';
        doc1.fileExtension = 'pdf';
        doc1.documentId = '1';

        let doc2 = new docusign.Document();
        doc2.documentBase64 = getDocumentBase64(docPath);
        doc2.name = 'Pagaré';
        doc2.fileExtension = 'pdf';
        doc2.documentId = '2';

        env.documents = [doc1, doc2];
        // 4. Creamos el "Firmante" (Signer)
        let signer1 = docusign.Signer.constructFromObject({
            email: emailCliente,
            name: nombreCliente,
            recipientId: '1',
            routingOrder: '1'
        });

        // 5. Definimos DÓNDE debe firmar (las "pestañas")
        // en los pdf debe haber un texto exacto, en el lugar que se encuentre es donde se va a poner la firma
        let signHere1 = docusign.SignHere.constructFromObject({
            anchorString: '/s1/', // Busca este texto en el PDF
            anchorYOffset: '10', 
            anchorUnits: 'pixels',
            documentId: '1', // En el Contrato
            pageNumber: '1',
            recipientId: '1'
        });

        let signHere2 = docusign.SignHere.constructFromObject({
            anchorString: '/s2/', // Busca este texto en el Pagaré
            documentId: '2', // En el Pagaré
            pageNumber: '1',
            recipientId: '1'
        });
        // Agregamos las pestañas al firmante
        signer1.tabs = docusign.Tabs.constructFromObject({
            signHereTabs: [signHere1, signHere2]
        });
        // Agregamos el firmante al sobre
        env.recipients = docusign.Recipients.constructFromObject({
            signers: [signer1]
        });
        // 6. Enviamos el Sobre (la solicitud de firma)
        const results = await envelopesApi.createEnvelope(DS_CONFIG.apiAccountId, {
            envelopeDefinition: env
        });

        console.log('Sobre enviado! Envelope ID:', results.envelopeId);
        // Respondemos al frontend que todo salió bien
        res.status(200).send({ 
            message: 'Solicitud de firma enviada correctamente.',
            envelopeId: results.envelopeId 
        });
    } catch (error) {
        console.error("Error al iniciar firma:", error);
        
        // Envía una respuesta de error al cliente
        res.status(500).send({ 
            error: 'Error interno del servidor.', 
            message: error.message || 'Ocurrió un error desconocido'
        })
    }
}


async function recibirWebhook(req, res) {
    const payload = req.body;
    console.log('¡Webhook de DocuSign recibido!', payload);
    if (payload.status === 'Completed') {
        const envelopeId = payload.envelopeId;
        console.log(`Proceso de firma ${envelopeId} completado.`);
    }
    // Respondes a DocuSign que recibiste el webhook
    res.status(200).send();
}

module.exports = { 
    iniciarFirma, recibirWebhook
}