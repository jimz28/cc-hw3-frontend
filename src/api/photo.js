import axios from 'axios';


export async function uploadPhoto(photoURL) {
    try {
        // // but first, coffee
        // const coffee = await getCoffee();
        // console.log(coffee); // ☕
        // // then we grab some data over an Ajax request
        // const wes = await axios('https://api.github.com/users/wesbos');
        // console.log(wes.data); // mediocre code
        // // many requests should be concurrent - don't slow things down!
        // // fire off three requests and save their promises
        // const wordPromise = axios('http://www.setgetgo.com/randomword/get.php');
        // const userPromise = axios('https://randomuser.me/api/');
        // const namePromise = axios('https://uinames.com/api/');
        // // await all three promises to come back and destructure the result into their own variables
        // const [word, user, name] = await Promise.all([wordPromise, userPromise, namePromise]);
        // console.log(word.data, user.data, name.data); // cool, {...}, {....}
    } catch (e) {
        console.error(e);
    }
}