import pocketbaseEs from 'pocketbase';
import PocketBase from 'pocketbase';
import { async } from 'regenerator-runtime';
import { POCKET_BASE_API, MAIN_URL } from './config';

export const pb = new PocketBase(POCKET_BASE_API);
const redirectUrl = MAIN_URL;


export const addAuthLink = async function () {
    const authMethods = await pb.collection('users').listAuthMethods();

    const provider = authMethods.authProviders[0];

    const aEl = document.querySelector('.auth-link')
    aEl.setAttribute('href', provider.authUrl + redirectUrl);

    aEl.addEventListener('click', function () {
        localStorage.setItem('provider', JSON.stringify(provider));
    })
}

export const attemptAuth = async function () {
    // parse the query parameters from the redirected url
    const params = (new URL(window.location)).searchParams;
    const provider = JSON.parse(localStorage.getItem('provider'));
    if (provider?.state !== params.get('state')) {
        throw "User not signed in.";
    }

    try {
        const authData = await pb.collection('users').authWithOAuth2(
            provider.name,
            params.get('code'),
            provider.codeVerifier,
            redirectUrl,
            { emailVisibility: false }
        );
        return pb.authStore.model.id;
    } catch (err) {
        console.log("Failed to exchange code.\n" + err);
    }
};

export const attempUploadTask = async function (data) {
    const newData = Object.assign({}, data)
    if (newData.taskTag) newData.taskTag = newData.taskTag.join(',');
    const record = await pb.collection('tasks').create(newData);
    return record.id;
};

export const attemptGetRecordList = async function () {
    const records = await pb.collection('tasks').getFullList();
    return records
};

export const attemptUpdateTask = async function (id, parameter, value) {
    const record = await pb.collection('tasks').update(`${id}`, { [parameter]: `${value}` })
};

export const attemptDeleteTask = async function (id) {
    const record = await pb.collection('tasks').delete(`${id}`)
};

export const attemptLogOut = async function () {
    pb.authStore.clear();
};
