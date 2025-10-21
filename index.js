const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

const password = 'supersecret';

app.get('/files', (req, res) => {
  const filename = req.query.filename; // User-provided input

  if (!filename) {
    return res.status(400).send('Filename is required.');
  }
  
  // 🚨 VULNERABLE CODE: Direct use of user input in a shell command
  const command = `ls -l public/${filename}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err.message}`);
      return res.status(500).send('Internal Server Error');
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).send('Internal Server Error');
    }
    res.send(`<pre>${stdout}</pre>`);
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});