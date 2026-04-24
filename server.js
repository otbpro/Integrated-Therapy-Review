require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from project root
app.use(express.static(path.join(__dirname)));

// ── Nodemailer transporter ──────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// ── Input sanitisation helper ───────────────────────────────────────────────
function sanitise(value) {
    if (typeof value !== 'string') return '';
    return value.replace(/[<>"']/g, '').trim().slice(0, 1000);
}

// ── Routes ──────────────────────────────────────────────────────────────────

// Contact form
app.post('/api/contact', async (req, res) => {
    try {
        const name    = sanitise(req.body.name);
        const email   = sanitise(req.body.email);
        const subject = sanitise(req.body.subject);
        const message = sanitise(req.body.message);

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'name, email and message are required.' });
        }

        // Basic email format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email address.' });
        }

        await transporter.sendMail({
            from: `"${name}" <${process.env.SMTP_USER}>`,
            replyTo: email,
            to: process.env.CONTACT_EMAIL || 'info@mcnutraceutical.co.uk',
            subject: subject || 'Website Contact Enquiry',
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`
        });

        res.json({ success: true, message: 'Message sent.' });
    } catch (err) {
        console.error('Contact form error:', err.message);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

// Consultation booking
app.post('/api/book-consultation', async (req, res) => {
    try {
        const name    = sanitise(req.body.name);
        const email   = sanitise(req.body.email);
        const phone   = sanitise(req.body.phone);
        const date    = sanitise(req.body.date);
        const time    = sanitise(req.body.time);
        const notes   = sanitise(req.body.notes);

        if (!name || !email || !date) {
            return res.status(400).json({ error: 'name, email and date are required.' });
        }

        await transporter.sendMail({
            from: `"Booking System" <${process.env.SMTP_USER}>`,
            replyTo: email,
            to: process.env.CONTACT_EMAIL || 'info@mcnutraceutical.co.uk',
            subject: `New Consultation Booking – ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nDate: ${date}\nTime: ${time}\nNotes: ${notes}`
        });

        res.json({ success: true, message: 'Booking request sent.' });
    } catch (err) {
        console.error('Booking error:', err.message);
        res.status(500).json({ error: 'Failed to submit booking. Please try again later.' });
    }
});

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all – serve index.html for direct page loads
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Integrated Therapy server running on http://localhost:${PORT}`);
});
