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
const fs = require('fs')
const path = require('path')
//const logger = require('../server/logger')
const logger = {
    info: function(data) {
        console.log(`info:\t${data}`)
    }
}

// RSA decrypter
const decrypter = new rsa(fs.readFileSync('./signkey.pem'),
    'pkcs1-private-pem', {
        encryptionScheme: 'pkcs1',
        signingScheme: 'md5'
    })

/**
 * Request Ticket implementation
 * @param {req} req Express's request object
 * @param {res} res Express's response object
 * @param {callback} next The next callback to continue processing
 */
const handleRequestTicket = (req, res, next) => {
    logger.info(`Request ticket request received from: ${req.query.userName}`, {query: req.query})

    // let username = req.query.userName;
    const salt = req.query.salt;

    let username = authenticate(req.query) // Authenticate the user

    if (!username || !username.trim()) { // If username is empty, dropping the user
        signAndSend(xml([{
            ObtainTicketResponse: [{
                message: 'Access denied!'
            }, {
                salt: salt
            }, {
                responseCode: 'ERROR'
            }]
        }]), res)
        return
    }

    let prolongation_period = '607875500';

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

    signAndSend(xml_content, res);
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
    }]);

    signAndSend(xml_content, res)
}

/**
 * TODO: dig around whats this action and why not ping is the action now?!
 * @param {string} xml_content the XML content as string
 * @param {Response} res the express's response object
 */
const handleProlongTicket = function (req, res, next) {
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
    }]);

    signAndSend(xml_content, res)
}

/**
 * Signs and sends back the result to the client
 * @param {string} xml_content the XML content as string
 * @param {res} res the express's response object
 */
const signAndSend = function (xml_content, res) {
    let xml_signature = decrypter.sign(xml_content, 'hex')
    res.status(200)
        .header("Content-Type", "text/plain; charset=utf-8")
        .end(`<!-- ${xml_signature} -->\n${xml_content}`)
}

/**
 * FIXME: This method is just a temporary implementation of login system.
 * @param query the query params at obtainticket.action
 * @returns {string} username
 */
const authenticate = function (query) {
    const filename = path.join(__dirname, '../permissions.json')

    if ( fs.existsSync(filename) ) {
        const obj = JSON.parse(fs.readFileSync(filename))

        if ( obj[query.userName] ) {
            return obj[query.userName].alias // Set alias to '' to prevent the app to register
        }
    } else {
        logger.info('permissions.json file doesn\'t exists...')
    }

    return query.userName
}

module.exports = {
    requestTicket: handleRequestTicket,
    prolongTicket: handleProlongTicket,
    releaseTicket: handleReleaseTicket
}