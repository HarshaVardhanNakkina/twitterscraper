import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";

export async function getHTML(url) {
    console.log(`fetching details of ${url}\n`);
    let { data: html } = await axios.get(url);
    return html;
}

export async function getTwitterDetails(html) {
    const $ = cheerio.load(html);
    const name = $(".ProfileHeaderCard-name .ProfileHeaderCard-nameLink");
    const followers = $('[data-nav="followers"] .ProfileNav-value');
    return {
        name: name.html(),
        followers: followers.data("count")
    };
}

export async function getTwitterPicsLinks(html) {
    const $ = cheerio.load(html);
    const tweetList = $(".tweet");
    // console.log(tweetList);
    const images = $(".AdaptiveMedia-container img");
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
        fs.mkdir(path, { recursive: true }, err => {
            console.log("creating directory " + path);
            if (err) console.log(err);
            else console.log("directory created");
        });
    }
}

export async function getPicsAndStore(picsLinks, path) {
    verifyPath(path);

    picsLinks.map(async picLink => {
        let picLinkSplitted = picLink.split("/");
        let picName = picLinkSplitted[picLinkSplitted.length - 1];
        console.clear();

        // GET request for remote image
        const { data } = await axios({
            method: "get",
            url: picLink,
            responseType: "stream"
        });
        data.pipe(fs.createWriteStream(path + picName)).on("close", function() {
            console.log("downloaded " + picName);
        });
    });
}
