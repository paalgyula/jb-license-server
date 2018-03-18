/**
 * tickets.js
 *
 * @license The Unlicense, http://unlicense.org/
 * @version 1.0
 * @author  https://github.com/paalgyula/
 * @updated 2018-03-07
 * @link    'www.paalgyula.com'
 */
'use strict'

const rsa = require('node-rsa')
const xml = require('xml')
const functions = require('firebase-functions')
const admin = require('firebase-admin')

//const logger = require('../server/logger')
const logger = {
    info: function (data) {
        console.log(`${data}`)
    },
    error: function (data) {
        console.error(`${data}`)
    }
}

logger.info('Initializing firebase app...')
admin.initializeApp(functions.config().firebase)

/**
 * Request Ticket implementation
 * @param {req} req Express's request object
 * @param {res} res Express's response object
 * @param {callback} next The next callback to continue processing
 */
const handleRequestTicket = (req, res, next) => {
    logger.info(`Request ticket request received from: ${req.query.userName}`, {query: req.query})

    // let username = req.query.userName;
    const salt = req.query.salt

    authenticate(req, (username) => {
        let prolongation_period = '607875500'

        let xml_content = xml([{
            ObtainTicketResponse: [{
                message: ''
            }, {
                prolongationPeriod: prolongation_period
            }, {
                responseCode: 'OK'
            }, {
                salt: salt
            }, {
                ticketId: 1
            }, {
                ticketProperties: `licensee=${username}\tlicenseType=0\t` // TODO: dig around licenseType
            }]
        }])

        signAndSend(xml_content, res)
    }, (message) => {
        logger.error(message)
        signAndSend(xml([{
            ObtainTicketResponse: [{
                message: 'Access denied!'
            }, {
                salt: salt
            }, {
                responseCode: 'ERROR'
            }]
        }]), res)
    }) // Authenticate the user
}

/**
 * Releasing ticket from the pool
 * @param {req} req Express's request object
 * @param {res} res Express's response object
 * @param {callback} next The next callback to continue processing
 */
const handleReleaseTicket = (req, res, next) => {
    //
    // Request: /rpc/releaseTicket.action?
    // buildNumber=2017.2.3+Build+PY-172.3968.37
    // &clientVersion=4
    // &hostName=2GIZRWS4YAICTHM
    // &machineId=62dd416a-b26c-41ed-9888-18872b08c375
    // &productCode=e8d15448-eecd-440e-bbe9-1e5f754d781b
    // &productFamilyId=e8d15448-eecd-440e-bbe9-1e5f754d781b
    // &salt=1512096608496
    // &secure=false
    // &ticketId=1
    // &userName=Administrator

    logger.info(`Release ticket request received from: ${req.query.userName}`, {query: req.query})

    const xml_data = xml([{
        ReleaseTicketResponse: [{
            message: ''
        },
            {
                responseCode: 'OK'
            },
            {
                salt: req.query.salt
            }
        ]
    }], {
        declaration: false
    })

    signAndSend(xml_data, res)
}

/**
 * @deprecated Handleping may renamed to
 * Handling ping to not release the tickets automatically
 * @param {req} req Express's request object
 * @param {res} res Express's response object
 * @param {callback} next The next callback to continue processing
 */
const handlePing = (req, res, next) => {
    // /rpc/ping.action?
    // buildNumber=2017.2.3+Build+PY-172.3968.37
    // &clientVersion=4
    // &hostName=2GIZRWS4YAICTHM
    // &machineId=62dd416a-b26c-41ed-9888-18872b08c375
    // &productCode=e8d15448-eecd-440e-bbe9-1e5f754d781b
    // &productFamilyId=e8d15448-eecd-440e-bbe9-1e5f754d781b
    // &salt=1512096608496
    // &secure=false
    // &ticketId=1
    // &userName=Administrator
    logger.info(`Ping request received from: ${req.query.userName}`, {query: req.query})

    const salt = req.query.salt

    let xml_content = xml([{
        PingResponse: [{
            message: ''
        }, {
            responseCode: 'OK'
        }, {
            salt: salt
        }]
    }])

    signAndSend(xml_content, res)
}

/**
 * TODO: dig around whats this action and why not ping is the action now?!
 * @param {req} req Express's request object
 * @param {res} res Express's response object
 * @param {callback} next The next callback to continue processing
 */
const handleProlongTicket = (req, res, next) => {
    logger.info(`Prolong ticket request received from: ${req.query.userName}`, {query: req.query})

    let xml_content = xml([{
        ProlongTicketResponse: [{
            message: ''
        }, {
            responseCode: 'OK'
        }, {
            salt: req.query.salt
        }, {
            ticketId: req.query.ticketId
        }]
    }])

    signAndSend(xml_content, res)
}

/**
 * Signs and sends back the result to the client
 * @param {string} xml_content the XML content as string
 * @param {res} res the express's response object
 */
const signAndSend = (xml_content, res) => {
    const database = admin.database()
    database.ref('signkey').once('value', (snapshot) => {
        if (snapshot.exists()) {
            send(snapshot.val(), xml_content, res)
        } else {
            certError('Certificate not found in the firebase database! ref:signkey')
        }
    }, (errorObject) => certError(errorObject))
}

/**
 * Sending and raising the certificate error
 * @param errorObject
 */
const certError = (errorObject) => {
    let errorString = 'There\'s no uploaded PEM private key for signing. ' +
        'Please upload a signing certificate next to the source as "signkey.pem" ' +
        'or paste the content at the admin page!'

    logger.error(errorString + " - " + JSON.stringify(errorObject))
    throw new Error(errorString)
}

/**
 * Sending the signed response to the client
 * @param cert the certificate as string
 * @param xml_content the XML what should be signed
 * @param res express's response object
 */
const send = (cert, xml_content, res) => {
    const signer = new rsa(cert,
        'pkcs1-private-pem', {
            encryptionScheme: 'pkcs1',
            signingScheme: 'md5'
        })

    let xml_signature = signer.sign(xml_content, 'hex')
    res.status(200)
        .header("Content-Type", "text/plain; charset=utf-8")
        .end(`<!-- ${xml_signature} -->\n${xml_content}`)
}

/**
 * This method checks for the firebase database for users
 //* @param req the query params at obtainticket.action
 * @param req express's request object
 * @param success success callback
 * @param failure failure callback when the user doesnt exists or the alias is blank/empty
 * @returns {string} username
 */
const authenticate = (req, success, failure) => {
    const username = req.query.userName;
    admin.database().ref(`users/${username}/alias`).once('value', snapshot => {
        if (snapshot.exists() && snapshot.val() !== '') {
            success(snapshot.val())

            let newLoginKey = admin.database()
                .ref()
                .child(`users/${username}/logins`)
                .push()
                .key;

            let updates = {};
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

            updates[`/users/${username}/logins/${newLoginKey}`] = {
                username: username,
                ip: ip,
                hostName: req.query.hostName,
                buildNumber: req.query.buildNumber,
                time: new Date()
            }

            admin
                .database()
                .ref()
                .update(updates);
        } else {
            failure('User not exists or the alias is empty.')
        }
    })
}

module.exports = {
    requestTicket: handleRequestTicket,
    prolongTicket: handleProlongTicket,
    releaseTicket: handleReleaseTicket
}