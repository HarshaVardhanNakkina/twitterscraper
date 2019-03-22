import {
    getHTML,
    getTwitterFollowers,
    getTwitterPhotos,
    getPhotosAndStore
} from "./lib/scraper";

async function go() {
    const html = await getHTML("https://twitter.com/imVkohli/media");
    const account = await getTwitterFollowers(html);

    const imageLinks = await getTwitterPhotos(html);
    getPhotosAndStore(
        imageLinks,
        `/home/kennys/Pictures/twitterscraper/${account.name}/`
    );
}

go();
