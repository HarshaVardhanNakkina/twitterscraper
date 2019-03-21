import { getHTML, getTwitterFollowers, getTwitterPhotos, getPhotosAndStore } from './lib/scraper';


async function go() {
    const html = await getHTML('https://twitter.com/MukhiSree/media');
    const account = await getTwitterFollowers(html);

    const imageLinks = await getTwitterPhotos(html);
    getPhotosAndStore(imageLinks, `/home/kennys/coding/twittersrcaper/${account.name}/`);
}

go();