import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import request from 'request';

export async function getHTML(url) {
    let { data: html } = await axios.get(url);
    return html;
}

export async function getTwitterFollowers(html) {
    const $ = cheerio.load(html);
    const name = $('.ProfileHeaderCard-name .ProfileHeaderCard-nameLink')
    const account = $('[data-nav="followers"] .ProfileNav-value');
    return {
        name: name.html(),
        followers: account.data('count')
    };
}

export async function getTwitterPhotos(html) {
    const $ = cheerio.load(html);
    const images = $('.AdaptiveMedia-container img');
    let imageLinks = [];
    images.map((ind, image) => {
        imageLinks.push(image.attribs.src);
    });
    return imageLinks;
}

function verifyPath(path) {

    if (fs.existsSync(path)) {
        console.log(`\n${path} exits\n`);
    } else {
        console.log(`\n${path} doesn't exists\n`);
        fs.mkdir(path, { recursive: true }, (err) => {
            console.log("creating directory " + path);
            if (err) console.log(err);
            else console.log("directory created");
        });
    }
}

export function getPhotosAndStore(imageLinks, path) {
    verifyPath(path);
    imageLinks.forEach(async function (imageLink) {
        let imageLinkSplitted = imageLink.split('/')
        let photoName = imageLinkSplitted[imageLinkSplitted.length - 1];
        // GET request for remote image
        axios({
            method: 'get',
            url: imageLink,
            responseType: 'stream'
        }).then(function (response) {
            response.data
                .pipe(fs.createWriteStream(path + photoName))
                .on('close', function () {
                    console.log("done");
                });
        });
    });
}
