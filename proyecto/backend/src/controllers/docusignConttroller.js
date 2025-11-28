// Configuracion de DocuSign
const docusign = require('docusign-esign');
const fs = require('fs');
const path = require('path');
const pool = require('../db/db');

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
        const results = await apiClient.requestJWTUserToken(
            DS_CONFIG.integrationKey,
            DS_CONFIG.userId,
            scopes,
            privateKey,
            3600 
        );
        return results.body.access_token;
    } catch (error) {
        console.error("Error al obtener token de DocuSign:", error);
        throw error;
    }
}

async function getApiClient() {
    const accessToken = await getDocuSignAccessToken();
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(DS_CONFIG.basePath);
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    return apiClient;
}


// Aca realmente empieza el controller, lo de antes lo pude haber separado mas pero era solo complicar mas la cosa
const { getDocumentBase64 } = require('../utils/pdfBase64');

// Funcion para la vista de iniciarFirma
async function firma(req, res) {
    // Necesita el nombre del cliente, el email y el id del prestamo
    // en la tabla prestamo se guarda el envelopeId y el estado de la firma
    const {emailCliente, nombreCliente, idSolicitud} = req.body;

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

        // LO SIGUEINTE ESTA COMENTADO PORQUE ESTO MISMO YA LO TENIA CONFIGURADO EN LA CUENTA DE DOCUSIGN
        // entonces como estaba doble, se mandaba 2 veces el evento al webhook, para evitar eso preferi comentar esto
        // lo borraria pero si hay que cambiar la cuenta de docusign, nos podemos ahorrar una parte de la configuracion solo descomentando este codigo
        // la verdad preferiria crear otra cuenta, para aumentar el plazo de la prueba gratis y ademas para que me dejen de llegar los correos a mi :)

        // let notificacionEvento = new docusign.EventNotification();
        // notificacionEvento.url = 'https://commercialistic-muscularly-kaiya.ngrok-free.dev/api/docusign/webhook';
        // notificacionEvento.loggingEnabled = 'true';
        // notificacionEvento.requireAcknowledgment = 'true';

        // let envelopeEvents = [
        //     docusign.EnvelopeEvent.constructFromObject({ envelopeEventStatusCode: 'completed'}),
        //     docusign.EnvelopeEvent.constructFromObject({ envelopeEventStatusCode: 'declined'}),
        // ];
        // notificacionEvento.envelopeEvents = envelopeEvents;
        // env.EventNotification = notificacionEvento


        // 6. Enviamos el Sobre (la solicitud de firma)
        const results = await envelopesApi.createEnvelope(DS_CONFIG.apiAccountId, {
            envelopeDefinition: env
        });

        // Si el envelope se crea correctamente, se guarda su id en prestamo y el estado de firma en enviado
        const nuevoEnvelopeId = results.envelopeId;
        const updateQuery = `UPDATE prestamo SET envelope_id = $1, estado_firma = 'ENVIADO' WHERE id = $2`;
        await pool.query(updateQuery, [nuevoEnvelopeId, idSolicitud]);

        console.log(`Solicitud ID ${idSolicitud} actualizada con Envelope ID: ${nuevoEnvelopeId}`);
        console.log('Sobre enviado! Envelope ID:', results.envelopeId);
        // el envelopeId tenemos que guardarlo en la BDD para relacionarlo al proceso de firma del credito que corresponda
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


    // Recibe la señal de docusign de que fue firmado exitosamente o los documentos fueron rechazados por el cliente
    // Aca habria que actualizar tambien el estado segun la señal a la solicitud de credito a quien le corresponda el envelopeId
async function recibirWebhook(req, res) {
    const payload = req.body;
    console.log('¡Webhook de DocuSign recibido!',JSON.stringify(payload, null, 2));
    if (payload.event === 'envelope-completed') {
        // Cuando la firma es completada, se actualiza el estado a FIRMADO
        const envelopeId = payload.data.envelopeId;
        const envId = payload.data.envelopeId;
        const query = `UPDATE prestamo SET estado_firma = 'FIRMADO' WHERE envelope_id = $1`;
        await pool.query(query, [envId]);
        console.log(`Solicitud asociada al sobre ${envId} marcada como FIRMADO.`);
        console.log(`Proceso de firma ${envelopeId} exitosa.`);
    } else if (payload.event === 'envelope-declined') {
        // Si la firma es rechazada, se actualiza estado_firma como RECHAZADO
        const envelopeId = payload.data.envelopeId;
        const envId = payload.data.envelopeId;
        const query = `UPDATE prestamo SET estado_firma = 'RECHAZADO' WHERE envelope_id = $1`;
        await pool.query(query, [envId]);
        console.log(`Solicitud asociada al sobre ${envId} marcada como RECHAZADO`);
        console.log(`Proceso de firma ${envelopeId} exitosa.`);
    } else {
        // por como lo puse deberia avisar solamente si es firmado correctamente o es rechazado, pero por si acaso le puse eso
        // cualquier cosa se puede cambiar desde la configuracion de la API en la pagina
        console.log("Evento recibido no es exito ni rechazo")
    }
    // Respondes a DocuSign que recibiste el webhook
    res.status(200).send();
}

module.exports = { 
    firma, recibirWebhook
}