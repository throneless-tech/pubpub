import { Pub, ReviewNew } from 'server/models';

import { baseAuthor, baseThread, baseVisibility } from './util';

export default async (pubSlug, reviewNumber, communityId) => {
	const sanitizedSlug = pubSlug.toLowerCase();
	const pubData = await Pub.findOne({
		where: { slug: sanitizedSlug, communityId: communityId },
	});
	if (!pubData) {
		throw new Error('Review Not Found');
	}

	const reviewData = await ReviewNew.findOne({
		where: {
			number: reviewNumber,
			pubId: pubData.id,
		},
		include: [...baseAuthor, ...baseVisibility, ...baseThread],
	});

	if (!reviewData) {
		throw new Error('Review Not Found');
	}
	return reviewData.toJSON();
};
