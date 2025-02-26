/*
Project : Cryptotrades
FileName : mailController.js
Author : LinkWell
File Created : 21/07/2021
CopyRights : LinkWell
Purpose : This is the file which used to send email notificaiton to user
*/
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
var config = require('./../../../helper/config')

/**
 *   This is the function handle html render
 */
var readFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

/**
 * This is the function which used to send email 
 */
exports.mail =  function (data,receiptant,subject,sender, callback) {  
    if(config.mail.type == "") {
      callback(null,"success");
      return;
    }
    var filePath = __basedir;
    
    readFile(filePath + '/templates/mail/index.html', function(err, html) {
          var template = handlebars.compile(html);
          data.sitename = config.site_name;
          data.maillink = config.site_link;
          var htmlToSend = template(data);
          try {
            let transporter = nodemailer.createTransport({
                host: config.mail.smtp.host,
                port: config.mail.smtp.port,
                secure: config.mail.smtp.secure, // true for 465, false for other ports
                auth: {
                  user: config.mail.smtp.username, // generated ethereal user
                  pass: config.mail.smtp.password // generated ethereal password
                }
              });
              let info =  transporter.sendMail({
                from: sender, // sender address
                to: receiptant, // list of receivers
                subject: subject, // Subject line
                html: htmlToSend // html body
              }).then(reason=>{
                callback(null,info)
              }); 

          } catch (error) {
              console.log("mail error is ", )
              callback("mail error",'')
          }
       
    });  
 };
