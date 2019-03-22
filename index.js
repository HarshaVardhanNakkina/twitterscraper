import {
    getHTML,
    getTwitterDetails,
    getTwitterPhotoLinks,
    getPhotosAndStore
} from "./lib/scraper";

async function go() {
    const html = await getHTML("https://twitter.com/RaashiKhanna/media");
    const account = await getTwitterDetails(html);

    console.log(account.name, account.followers);

    // const imageLinks = await getTwitterPhotoLinks(html);
    // getPhotosAndStore(
    //     imageLinks,
    //     `/home/kennys/Pictures/twitterscraper/${account.name}/`
    // );
}

go();
