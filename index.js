import {
    getHTML,
    getTwitterDetails,
    getTwitterPicsLinks,
    getPicsAndStore
} from "./lib/scraper";

import fs from "fs";

async function scrapeUser(user) {
    const html = await getHTML(user.twitterMediaLink);
    const account = await getTwitterDetails(html);
    const picsLinks = await getTwitterPicsLinks(html);
    getPicsAndStore(
        picsLinks,
        `/home/kennys/Pictures/twitterscraper/${account.name}/`
    );
}

fs.readFile("./userstoscrape.json", (err, data) => {
    if (err) throw err;
    const { users } = JSON.parse(data);
    users.map(scrapeUser).then(res => {
        console.log("after a user pics are downloaded");
    });
});
