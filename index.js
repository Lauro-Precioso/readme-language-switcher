require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'lauro-precioso/lauro-precioso';
const WORKFLOW_FILE = 'translate-readme-en.yml';
const BRANCH = 'main';

app.get('/trigger', async (req, res) => {
    const lang = req.query.lang || 'en';

    try {
        const githubRes = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ${GITHUB_TOKEN}',
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ref: BRANCH,
                inputs: { lang }
            })
        });
        if (!githubRes.ok) {
            console.error('Error triggering the workflow:', await githubRes.text());
            return res.redirect('https://github.com/lauro-precioso?lang=error');
        }
        res.redirect('https://github.com/lauro-precioso');
    } catch (err) {
        console.error('Unexpected Error:', err);
        res.redirect('https://github.com/lauro-precioso?lang=error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is Running at http://localhost:${PORT}`);
});