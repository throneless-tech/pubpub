/* eslint-disable prettier/prettier */

/* ------- Global ------- */
process.env.AWS_ACCESS_KEY_ID = 'xxxxx'; // You'll need an AWS IAM user with full access to an S3 bucket
																				 // with public read named "assets.pubpub.org".
																				 // You'll also need to find/replace anywhere in code with
																				 // https://assets.pubpub.org/{filename} with the full public
																				 // url to your bucket.
process.env.AWS_SECRET_ACCESS_KEY = 'xxxxx'; // AWS IAM user
process.env.DOI_SUBMISSION_URL = 'https://test.crossref.org/servlet/deposit'; // crossref test url, stays the same
process.env.DOI_LOGIN_ID = 'xxxxx'; // Not required. Crossref login
process.env.DOI_LOGIN_PASSWORD = 'xxxxx'; // Not required. Crossref login
process.env.MAILGUN_API_KEY = 'xxxxx'; // Mailgun, for sending new user info and password resets
process.env.MAILCHIMP_API_KEY = 'xxxx'; // Not required. Mailchimp API, for adding subscribers
process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 = 'xxxx'; // Google Firebase account
																											// You'll also need to modify
																											// /utils/editor/fireBaseConfig.js
																											// with the api key, name, url, etc.
process.env.METABASE_SECRET_KEY = 'xxxx'; // Not Required. for Impact analytics

/* ------- v6 dev ------- */
process.env.DATABASE_URL_v6Dev = 'postgres://xxxx'; // Full URL to postgres DB (postgres:// with port and login, etc.). We use heroku.
process.env.CLOUDAMQP_APIKEY_v6Dev = 'xxxx' // Not required, I don't think, though you will get errors. For exports, mainly. We use the heroku cloudamqp add-on.
process.env.CLOUDAMQP_URL_v6Dev = 'amqp://xxxx'; // Not required. Full url to amqp server (amqp://...)
process.env.ALGOLIA_ID_v6Dev = 'xxxx'; // Not required. For search.
process.env.ALGOLIA_KEY_v6Dev = ''; // Not required. For search, as above.
process.env.ALGOLIA_SEARCH_KEY_v6Dev = ''; // Not required. For search, as above.

/* You likely don't need to setup the prod variables – everything can be tested locally with npm start */
/* ------- v6 prod ------- */
process.env.DATABASE_URL_v6Prod = 'postgres://xxxx';
process.env.CLOUDAMQP_APIKEY_v6Prod = 'xxxx';
process.env.CLOUDAMQP_URL_v6Prod = 'amqp://xxxx';
process.env.ALGOLIA_ID_v6Prod = 'xxxx';
process.env.ALGOLIA_KEY_v6Prod = 'xxxx';
process.env.ALGOLIA_SEARCH_KEY_v6Prod = 'xxxx';

/* ------- Active ------- /
/ Simply comment/uncomment PUBPUB_PRODUCTION to /
/ switch which environment is used in local dev */
// process.env.PUBPUB_PRODUCTION = 'true';
// process.env.PUBPUB_LOCAL_COMMUNITY = 'scifab';

const getVal = (varKey) => {

const useProduction = process.env.PUBPUB_PRODUCTION === 'true';
return 	useProduction
	? process.env[`${varKey}_v6Prod`]
	: process.env[`${varKey}_v6Dev`];

}

process.env.DATABASE_URL = getVal('DATABASE_URL');
process.env.CLOUDAMQP_APIKEY = getVal('CLOUDAMQP_APIKEY');
process.env.CLOUDAMQP_URL = getVal('CLOUDAMQP_URL');
process.env.ALGOLIA_ID = getVal('ALGOLIA_ID');
process.env.ALGOLIA_KEY = getVal('ALGOLIA_KEY');
process.env.ALGOLIA_SEARCH_KEY = getVal('ALGOLIA_SEARCH_KEY');
