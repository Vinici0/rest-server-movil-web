
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = '538224676274-66q03vper7rorc34ndtnb3g7sllclt8n.apps.googleusercontent.com';

const client = new OAuth2Client(CLIENT_ID);

const validarGoogleIdToken = async ( token ) => {

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [
                CLIENT_ID,
                '538224676274-6dm96dvsaknf5gf1uh7sp672demu4at1.apps.googleusercontent.com',
            ],  
        });


        const payload = ticket.getPayload();

     
        return {
            name: payload['name'],
            picture: payload['picture'],
            email: payload['email'],
        }
    } catch (error) {
        return null;
    }

}

module.exports = {
    validarGoogleIdToken
}
