const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require('adm-zip');

// Replace these values with your GitHub repository information
const owner = 'huintech';
const repo = 'coconut-driver';
const branch = 'main'; // or 'master', or any other branch
const filePath = 'coconut-drivers-win.zip'; // path to the file you want to download
const outputdir = path.join(__dirname, '../drivers');

// GitHub API endpoint for raw content
// const apiUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;

// Function to create the download directory if it doesn't exist
function createDownloadDirectory() {
    if (!fs.existsSync(outputdir)) {
        fs.mkdirSync(outputdir);
    }
}

// Function to get the latest release information
async function getLatestRelease() {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);

        return response.data;
    } catch (error) {
        console.error('Error fetching latest release:', error.message);
        throw error;
    }
}

if (!fs.existsSync(outputdir)) {
    fs.mkdirSync(outputdir, {recursive: true});
}

// Function to download the latest release asset
async function downloadLatestReleaseAsset() {
    try {
        createDownloadDirectory();

        const latestRelease = await getLatestRelease();

        if (!latestRelease.assets || latestRelease.assets.length === 0) {
            console.error('No assets found for the latest release.');
            return;
        }

        const asset = latestRelease.assets[0]; // Assuming the first asset is the one you want to download

        const response = await axios({
            url: asset.browser_download_url,
            method: 'GET',
            responseType: 'stream',
        });

        // Save the asset to the specified directory
        const fileName = path.join(outputdir, asset.name);
        await response.data.pipe(fs.createWriteStream(fileName));

        console.log(`Asset "${fileName}" downloaded successfully!`);

        // Create a new instance of AdmZip
        const zip = new AdmZip(fileName);

        try {
            // Extract all entries from the zip file to the specified directory
            zip.extractAllTo('./', /*overwrite*/ true);

            console.log('ZIP file extracted successfully!');
        } catch (error) {
            console.error('Error extracting ZIP file:', error.message);
        }
    } catch (error) {
        console.error('Error downloading latest release asset:', error.message);
    }
}

// Call the function to download the latest release asset
downloadLatestReleaseAsset();
