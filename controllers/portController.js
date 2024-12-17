const { SerialPort } = require('serialport');

exports.getPorts = async (req, res) => {
  try {
    const ports = await SerialPort.list();
    res.status(200).send({ ports: ports.map((port) => port.path) });
  } catch (error) {
    console.error('Error fetching ports:', error.message);
    res.status(500).send({ error: 'Failed to fetch serial ports.' });
  }
};
