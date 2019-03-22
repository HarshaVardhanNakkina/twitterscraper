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
    const picsLinks = await getTwitterPicsLinks(html, user);
    const path = `/home/kennys/Pictures/twitterscraper/${account.name}/`;
    if (picsLinks.length === 0)
        console.log(`no new pics found for ${account.name}\n`);
    else getPicsAndStore(picsLinks, path);
}

fs.readFile("./userstoscrape.json", (err, data) => {
    if (err) throw err;
    let { users } = JSON.parse(data);
    users.map(scrapeUser);
    users = users.reduce((acc, cur) => {
        cur = { ...cur, lastDateTime: new Date().toString() };
        acc.push(cur);
        return acc;
    }, []);
    fs.writeFile("./userstoscrape.json", JSON.stringify({ users }), err => {
        if (err) throw err;
        console.log("last downloaded dates are updated and written back\n");
    });
});
