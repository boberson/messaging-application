/* 
 * To change this license header, choose License Headers in Project.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var messaging = require('./messaging');
var Message = messaging.model.Message;

var msg1 = {};
msg1.name = "ROUTINE UNCLAS MESSAGE";
msg1.text = "RTTUZHSW {osri}1616 {jul}0420-UUUU—{dri}.\\r\nZNR UUUUU\\r\nR {dtg}\\r\n{fl6}\\r\n{fl7}\\r\nBT\\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\\r\nBT\\r\n#1616\\r\n\\r\n\\r\n\\r\n\\r\n\\r\n\\r\n\\r\nNNNN";
msg1.tags = ["UNCLASS", "ROUTINE"];

var msg2 = {};
msg2.name = "PRIORITY UNCLAS MESSAGE";
msg2.text = "RTTUZHSW {osri}1616 {jul}0421-UUUU—{dri}.\\r\nZNR UUUUU/BBBBB\\r\nP {dtg}\\r\n{fl6}\\r\n{fl7}\\r\nBT\\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\\r\nBT\\r\n#1616\\r\n\\r\n\\r\n\\r\n\\r\n\\r\n\\r\n\\r\nNNNN";
msg2.tags = ["UNCLASS", "PRIORITY", "SHD", "B", "SHD B"];

var msg3 = {};
msg3.name = "IMMED UNCLAS MESSAGE";
msg3.text = "RTTUZHSW {osri}1616 {jul}0422-UUUU—{dri}.\\r\nZNR UUUUU/FFFFF\\r\nO {dtg}\\r\n{fl6}\\r\n{fl7}\\r\nBT\\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\\r\nBT\\r\n#1616\\r\n\\r\n\\r\n\\r\n\\r\n\\r\n\\r\n\\r\nNNNN";

var msg4 = {};
msg4.name = "FLASH UNCLAS MESSAGE";
msg4.tags = ["FLASH", "UNCLAS", "ACP128"];
msg4.text = "RTTUZHSW {osri}1616 {jul}0423-UUUU—{dri}.\\r\nZNR UUUUU/LLLLL\\r\nZ {dtg}\\r\n{fl6}\\r\n{fl7}\\r\nBT\\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\\r\nBT\\r\n#1616\\r\n\\r\n\\r\n\\r\n\\r\n\\r\n\\r\n\\r\nNNNN";

var msg5 = {};
msg5.name = "UNCLASS ROUTINE SHD P";
msg5.text = "RTTUZHSW {osri}1616 {jul}0424-UUUU—{dri}.\\r\nZNR UUUUU/PPPPP\\r\nR {dtg}\\r\n{fl6}\\r\n{fl7}\\r\nBT\\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\\r\nBT\\r\n#1616\\r\n\\r\n\\r\n\\r\n\\r\n\\r\n\\r\n\\r\nNNNN";

message1 = new Message(msg1);
message1.save(function(err, rst) {
  if(err) {
    console.log("Error saving object to database: " + err);
  }
});

message2 = new Message(msg2);
message2.save(function(err, rst) {
  if(err) {
    console.log("Error saving object to database: " + err);
  }
});

message3 = new Message(msg3);
message3.save(function(err, rst) {
  if(err) {
    console.log("Error saving object to database: " + err);
  }
});

message4 = new Message(msg4);
message4.save(function(err, rst) {
  if(err) {
    console.log("Error saving object to database: " + err);
  }
});

message5 = new Message(msg5);
message5.save(function(err, rst) {
  if(err) {
    console.log("Error saving object to database: " + err);
  }
});