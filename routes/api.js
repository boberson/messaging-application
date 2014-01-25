/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};

var msg = "RTTUZHSW {osri}1616 {jul}0420-UUUU—{dri}.\r\nZNR UUCCC\r\nR {dtg}\r\n{fl6}\r\n{fl7}\r\nBT\r\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXTr\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXTr\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXTr\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXTr\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXTr\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXTr\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXTr\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXTr\nA LINE OF TEXT A LINE OF TEXT A LINE OF TEXT\r\nBT\r\n#1616\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nNNNN";

var messages = new Array();
messages.push({"_id": "001", "name": "Message 1", "text": msg, "tags": ["GOOD", "ACP128", "Message 1", "1"]});
messages.push({"_id": "002", "name": "Message 2", "text": msg, "tags": ["GOOD", "ACP128", "Message 2", "2"]});
messages.push({"_id": "003", "name": "Message 3", "text": msg, "tags": ["GOOD", "ACP128", "Message 3", "3"]});
messages.push({"_id": "004", "name": "Message 4", "text": msg, "tags": ["GOOD", "ACP128", "Message 4", "4"]});
messages.push({"_id": "005", "name": "Message 5", "text": msg, "tags": ["GOOD", "ACP128", "Message 5", "5"]});
messages.push({"_id": "006", "name": "Message 6", "text": msg, "tags": ["GOOD", "ACP128", "Message 6", "6"]});
messages.push({"_id": "007", "name": "Message 7", "text": msg, "tags": ["GOOD", "ACP128", "Message 7", "7"]});
messages.push({"_id": "008", "name": "Message 8", "text": msg, "tags": ["GOOD", "ACP128", "Message 8", "8"]});

exports.messages = function (req, res) {
  res.json(messages);
};