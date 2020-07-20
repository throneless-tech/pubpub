import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DiscussionNav from './DiscussionNav';
import Discussion from '../Discussion';

require('./discussionGroup.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	historyData: PropTypes.object.isRequired,
	discussions: PropTypes.array.isRequired,
	mountClassName: PropTypes.string.isRequired,
	updateLocalData: PropTypes.func.isRequired,
	sideContentRef: PropTypes.object.isRequired,
	mainContentRef: PropTypes.object.isRequired,
	prevNewDiscussionIds: PropTypes.object.isRequired,
	prevConvertedDiscussionIds: PropTypes.object.isRequired,
};

const DiscussionGroup = (props) => {
	const {
		pubData,
		historyData,
		updateLocalData,
		discussions,
		sideContentRef,
		mainContentRef,
		mountClassName,
		prevNewDiscussionIds,
		prevConvertedDiscussionIds,
	} = props;
	const [activeThreadHover, setActiveThreadHover] = useState(undefined);
	const [activeThread, setActiveThread] = useState(undefined);
	const [isExpanded, setExpanded] = useState(false);

	const mainRect = mainContentRef.current.getBoundingClientRect();
	const sideRect = sideContentRef.current.getBoundingClientRect();

	useEffect(() => {
		/* We want to set the activeThread to any newly opened new discussion */
		const justCreatedDiscussionId = discussions.reduce((prev, curr) => {
			const isNewDiscussion = !curr.number;
			const alreadyKnowAboutNewDiscussion = prevNewDiscussionIds.current.includes(curr.id);
			if (isNewDiscussion && !alreadyKnowAboutNewDiscussion) {
				return curr.id;
			}
			return prev;
		}, undefined);
		if (justCreatedDiscussionId) {
			prevNewDiscussionIds.current.push(justCreatedDiscussionId);
			setActiveThread(justCreatedDiscussionId);
		}
		const justConvertedDiscussionId = discussions.reduce((prev, curr) => {
			const isNewDiscussion = !curr.number;
			const alreadyKnowAboutNewDiscussion = prevNewDiscussionIds.current.includes(curr.id);
			const alreadyKnowAboutConvertedDiscussion = prevConvertedDiscussionIds.current.includes(
				curr.id,
			);
			if (
				!isNewDiscussion &&
				alreadyKnowAboutNewDiscussion &&
				!alreadyKnowAboutConvertedDiscussion
			) {
				return curr.id;
			}
			return prev;
		}, undefined);
		if (justConvertedDiscussionId) {
			prevConvertedDiscussionIds.current.push(justConvertedDiscussionId);
			setActiveThread(justConvertedDiscussionId);
		}
	}, [prevNewDiscussionIds, prevConvertedDiscussionIds, discussions]);

	useEffect(() => {
		/* This effect is due to a Chrome rendering bug that causes */
		/* the text to not reflow when moving back to position: absolute */
		document.getElementsByClassName(mountClassName)[0].style.display =
			activeThread && isExpanded ? 'block' : 'inline';
	}, [mountClassName, isExpanded, activeThread]);

	/* When a highlight is removed (i.e. a new one is Cancelled) */
	/* and was the activeThread, we need to clear */
	const activeDiscussionData = discussions.find((thread) => {
		return thread.id === activeThread;
	});
	const style = {
		left: sideRect.left - mainRect.left,
		width: sideRect.width,
	};

	return (
		<span
			className={classNames({
				'discussion-group-component': true,
				active: activeThread,
				expanded: isExpanded && activeThread,
			})}
			style={style}
			tabIndex={-1}
		>
			<DiscussionNav
				key={isExpanded && activeThread}
				discussions={discussions}
				activeThreadHover={activeThreadHover}
				setActiveThreadHover={setActiveThreadHover}
				activeThread={activeThread}
				setActiveThread={setActiveThread}
				isExpanded={isExpanded}
				setExpanded={setExpanded}
			/>
			{activeDiscussionData && (
				<Discussion
					pubData={pubData}
					historyData={historyData}
					discussionData={activeDiscussionData}
					updateLocalData={updateLocalData}
				/>
			)}
		</span>
	);
};

DiscussionGroup.propTypes = propTypes;
export default DiscussionGroup;
