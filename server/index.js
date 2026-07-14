const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname);
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

function saveContact(contact) {
  let arr = [];
  try {
    if (fs.existsSync(CONTACTS_FILE)) {
      arr = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf8')) || [];
    }
  } catch (e) {
    console.error('Failed reading contacts file', e);
  }
  arr.push(Object.assign({ receivedAt: new Date().toISOString() }, contact));
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

async function trySendEmail(contact) {
  const smtpHost = process.env.SMTP_HOST;
  if (!smtpHost) return false;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined
  });

  const html = `<p>New contact inquiry</p>
    <p><strong>Name:</strong> ${contact.name}</p>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Project:</strong> ${contact.project}</p>
    <p><strong>Message:</strong><br/>${contact.message}</p>`;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'no-reply@example.com',
    to: process.env.TO_EMAIL || process.env.FROM_EMAIL,
    subject: `Contact inquiry from ${contact.name || 'website'}`,
    html
  });
  return true;
}

app.post('/api/contact', async (req, res) => {
  const { name, email, project, message } = req.body || {};
  if (!email && !message && !name) {
    return res.status(400).json({ error: 'Missing contact data' });
  }
  const contact = { name, email, project, message };
  try {
    saveContact(contact);
    let emailed = false;
    try {
      emailed = await trySendEmail(contact);
    } catch (e) {
      console.warn('Email send failed', e.message || e);
    }
    return res.json({ message: 'Received', emailed });
  } catch (err) {
    console.error('Failed to save contact', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Serve static files for convenience when running server locally
app.use(express.static(path.join(__dirname, '..')));

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
