import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@blueprintjs/core';

import { Avatar } from 'components';

const collaboratorType = PropTypes.shape({
	cursorColor: PropTypes.string,
	id: PropTypes.string,
	image: PropTypes.string,
	initials: PropTypes.string,
	name: PropTypes.string,
});

const propTypes = {
	collabData: PropTypes.shape({
		localCollabUser: collaboratorType,
		collaborators: PropTypes.arrayOf(collaboratorType),
		remoteCollabUsers: PropTypes.array,
	}).isRequired,
};

const getUniqueCollaborators = (collaborators, isAnonymous) => {
	const uniqueCollaborators = {};
	collaborators.forEach((item) => {
		if (item.initials !== '?') {
			uniqueCollaborators[item.id] = item;
		}
	});
	const numAnonymous = Math.max(
		0,
		collaborators.reduce(
			(sum, collaborator) => (collaborator.initials === '?' ? sum + 1 : sum),
			0,
		) - (isAnonymous ? 1 : 0),
	);
	if (numAnonymous) {
		uniqueCollaborators.anon = {
			backgroundColor: 'rgba(96,96,96, 0.2)',
			cursorColor: 'rgba(96,96,96, 1.0)',
			id: 'anon',
			initials: numAnonymous,
			name: `${numAnonymous} anonymous user${numAnonymous === 1 ? '' : 's'}`,
		};
	}
	return uniqueCollaborators;
};

const PubHeaderCollaborators = (props) => {
	const { remoteCollabUsers, localCollabUser } = props.collabData;
	const uniqueCollaborators = getUniqueCollaborators(remoteCollabUsers, !localCollabUser.id);
	return (
		<div>
			{Object.keys(uniqueCollaborators)
				.map((key) => uniqueCollaborators[key])
				.filter((x) => x)
				.map((collaborator) => {
					return (
						<div className="avatar-wrapper" key={`present-avatar-${collaborator.id}`}>
							<Tooltip content={collaborator.name} tooltipClassName="bp3-dark">
								<Avatar
									/* Cast initials to string since
									the anonymous Avatar is a int count */
									initials={String(collaborator.initials)}
									avatar={collaborator.image}
									borderColor={collaborator.cursorColor}
									borderWidth="2px"
									width={24}
								/>
							</Tooltip>
						</div>
					);
				})}
		</div>
	);
};
PubHeaderCollaborators.propTypes = propTypes;
export default PubHeaderCollaborators;
