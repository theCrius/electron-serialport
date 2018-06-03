// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var serialport = require('serialport')
var serialportTest = require('serialport/test');
var createTable = require('data-table')

serialport.list((err, ports) => {
  console.log('ports', ports);
  if (err) {
    document.getElementById('error').textContent = err.message
    return
  } else {
    document.getElementById('error').textContent = ''
  }

  if (ports.length === 0) {
    document.getElementById('error').textContent = 'No ports discovered'
  }

  var headers = Object.keys(ports.length ? ports[0] : {})
  var table = createTable(headers)
  tableHTML = ''
  table.on('data', data => tableHTML += data)
  table.on('end', () => document.getElementById('ports').innerHTML = tableHTML)
  ports.forEach(port => table.write(port))
  table.end();
});

document.getElementById("openListener").onclick = function(serialport) {
  var port = new serialport(document.getElementById('listener').value);
  port.on('data', function (data) {
    console.log('Data:', data);
  });
};

document.getElementById("testListener").onclick = function() {
  console.log('Start Testing /dev/testPort Port');
  var MockBinding = serialportTest.Binding;
  MockBinding.createPort('/dev/testPort', { echo: true, record: true })
  var port = new serialport('/dev/testPort');

  port.on('data', function (data) {
    console.log('Data:', data);
  });

  port.write('Sending data to test port');
  port.write('Sending data to test port again');
  port.write('Sending data to test port for the last time');
};
