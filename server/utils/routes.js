export const hostIsValid = (req, access) => {
	const isBasePubPub = req.hostname === 'www.pubpub.org';
	if (!isBasePubPub && access !== 'community') {
		return false;
	}
	if (isBasePubPub && access !== 'pubpub') {
		return false;
	}
	return true;
};
