"use strict";

const functions = require("firebase-functions");
const express = require("express");

// License manager base
const ticket = require('./tickets')

const app = express();

//app.get('/obatainTicket.action', (req, res) => res.send("fudejoittminden"));

app.get('/rpc/releaseTicket.action', ticket.releaseTicket)
app.get('/rpc/obtainTicket.action', ticket.requestTicket)
app.get('/rpc/prolongTicket.action', ticket.prolongTicket)
app.get('**', (req, res) => {
    res.send('Ez nem jo path! ' + JSON.stringify(req.path))
})

exports.license = functions.https.onRequest(app);