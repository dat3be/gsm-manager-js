const gsmModem = require('serialport-gsm');
const db = require('../models/db');

// Helper function to parse USSD response
function parseUSSDResponse(response) {
  console.log(`### Full Response Object:`, response); // Log the full response object

  // Normalize response to string
  const responseStr = response?.data || response?.text || response?.result || JSON.stringify(response);

  console.log(`### Raw USSD Response String: ${responseStr}`);

  if (!responseStr || typeof responseStr !== 'string') {
    console.error(`### Error: Invalid USSD response format.`);
    return { phoneNumber: null, balance: null };
  }

  // Updated Regex Patterns
  const phoneRegex = /\b(\d{10,15})\b/; // Matches standalone phone numbers (10-15 digits)
  const balanceRegex = /TKC\s*[:]*\s*(\d+\.?\d*)/i; // Matches balance after 'TKC:'

  // Match phone number and balance
  const phoneNumberMatch = responseStr.match(phoneRegex);
  const balanceMatch = responseStr.match(balanceRegex);

  // Log parsed results for debugging
  console.log(`### Parsed Phone Number: ${phoneNumberMatch ? phoneNumberMatch[1] : 'Not found'}`);
  console.log(`### Parsed Balance: ${balanceMatch ? balanceMatch[1] : 'Not found'}`);

  return {
    phoneNumber: phoneNumberMatch ? phoneNumberMatch[1] : null,
    balance: balanceMatch ? balanceMatch[1] : null,
  };
}

exports.runUSSD = (req, res) => {
  const modem = gsmModem.Modem();
  const { port, ussd } = req.body;

  if (!port || !ussd) {
    return res.status(400).send({ error: 'Port and USSD code are required.' });
  }

  console.log(`### Attempting to open port: ${port}`);

  // Open the modem connection
  modem.open(port, { baudRate: 9600 }, (err) => {
    if (err) {
      console.error(`### Failed to open port ${port}:`, err.message);
      return res.status(500).send({ error: `Failed to connect to port ${port}` });
    }

    console.log(`### Connected to port ${port}. Sending USSD: ${ussd}`);

    // Send USSD Command using AT+CUSD
    modem.executeCommand(`AT+CUSD=1,"${ussd}",15`, (result, error) => {
      if (error) {
        console.error('### Error executing USSD command:', error.message);
        modem.close();
        return res.status(500).send({ error: 'Failed to execute USSD command.' });
      }

      console.log(`### USSD Command Response:`, result);

      // Normalize response
      const response = result?.data || result?.text || result?.result || JSON.stringify(result);
      const { phoneNumber, balance } = parseUSSDResponse(response);

      // Check if parsing succeeded
      if (!phoneNumber && !balance) {
        console.error(`### Parsing failed for response: ${response}`);
        modem.close();
        return res.status(400).send({
          error: 'Could not parse phone number or balance from response.',
          rawResponse: response,
        });
      }

      console.log(`### Parsed Data - Phone Number: ${phoneNumber}, Balance: ${balance}`);

      // Save phone number to database if available
      if (phoneNumber) {
        db.run(
          `INSERT OR IGNORE INTO phone_numbers (port, phone_number) VALUES (?, ?)`,
          [port, phoneNumber],
          (dbErr) => {
            if (dbErr) console.error('### Failed to save phone number:', dbErr.message);
          }
        );
      }

      // Close modem and respond
      modem.close();
      res.status(200).send({
        port,
        ussd,
        phoneNumber: phoneNumber || 'Not found',
        balance: balance || 'Not found',
        rawResponse: response,
      });
    });
  });

  // Ensure modem cleanup in case of unexpected errors
  modem.on('error', (err) => {
    console.error(`### Modem Error: ${err.message}`);
    modem.close();
    res.status(500).send({ error: 'Modem encountered an unexpected error.' });
  });
};
