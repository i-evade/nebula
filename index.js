const express = require('express');
const fs = require('fs');
const app = express();

// Read TLD data from tld.txt
const readTldData = () => {
  try {
    const data = fs.readFileSync('tld.txt', 'utf8');
    return data.split('\n').filter(Boolean); // Filter out empty lines
  } catch (error) {
    console.error(error);
    throw new Error('Failed to read TLD data from tld.txt file.');
  }
};

// API endpoint to check if a TLD is valid
app.get('/is-a-tld', (req, res) => {
  try {
    const queryTld = req.query.tld;

    if (!queryTld) {
      res.status(400).json({ error: 'Bad request', message: 'Missing query parameter "tld".' });
      return;
    }

    const tlds = readTldData();
    const uppercaseTld = queryTld.toUpperCase();

    if (tlds.includes(uppercaseTld)) {
      res.json({ message: `.${uppercaseTld.toLowerCase()} is a valid TLD.` });
    } else {
      res.json({ message: `.${uppercaseTld.toLowerCase()} is not a valid TLD.` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', message: 'Failed to read TLD data.' });
  }
});

// API endpoint to check if a link contains a TLD
app.get('/contains-tld', (req, res) => {
  try {
    const queryLink = req.query.link;

    if (!queryLink) {
      res.status(400).json({ error: 'Bad request', message: 'Missing query parameter "link".' });
      return;
    }

    const tlds = readTldData();
    const lowercaseLink = queryLink.toLowerCase();

    const linkTlds = tlds.filter(tld => lowercaseLink.includes(`.${tld.toLowerCase()}`));

    if (linkTlds.length > 0) {
      res.json({ message: `The link "${lowercaseLink}" contains the following TLDs: ${linkTlds.join(', ')}` });
    } else {
      res.json({ message: `The link "${lowercaseLink}" does not contain any known TLDs.` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', message: 'Failed to read TLD data.' });
  }
});

// Serve index.html from the public directory for the main page
app.use('/', express.static('public'));

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
