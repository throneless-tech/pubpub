import React from 'react';
import PropTypes from 'prop-types';
import { Overlay as BlueprintOverlay } from '@blueprintjs/core';

require('./overlay.scss');

const propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
	maxWidth: PropTypes.number,
};

const defaultProps = {
	maxWidth: 940,
	isOpen: false,
};

const Overlay = function(props) {
	return (
		<BlueprintOverlay
			className="bp3-overlay-scroll-container"
			isOpen={props.isOpen}
			onClose={props.onClose}
			transitionName="pub-overlay"
			transitionDuration={200}
		>
			<style>
				{`
					@media only screen and (min-width: ${props.maxWidth / 0.9}px) {
						.overlay-wrapper {
							left: calc(50vw - ${props.maxWidth / 2}px);
							width: ${props.maxWidth}px; // Effectively it's max width
						}
					}
				`}
			</style>
			<div className="overlay-wrapper bp3-card bp3-elevation-2">{props.children}</div>
		</BlueprintOverlay>
	);
};

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;
export default Overlay;
