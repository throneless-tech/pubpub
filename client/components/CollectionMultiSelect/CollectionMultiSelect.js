import React from 'react';
import PropTypes from 'prop-types';
import { Position } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/select';
import fuzzysearch from 'fuzzysearch';

require('./collectionMultiSelect.scss');

const propTypes = {
	allCollections: PropTypes.array.isRequired,
	selectedCollectionIds: PropTypes.array.isRequired,
	onItemSelect: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
};

const defaultProps = {
	placeholder: '',
};

const CollectionMultiSelect = function(props) {
	const collectionsById = {};
	props.allCollections.forEach((collection) => {
		collectionsById[collection.id] = collection;
	});

	return (
		<MultiSelect
			items={Object.keys(collectionsById)}
			itemPredicate={(query, item) => {
				const existingCollectionIds = props.selectedCollectionIds || [];
				if (existingCollectionIds.indexOf(item) > -1) {
					return false;
				}

				if (!query) {
					return true;
				}
				const collection = collectionsById[item];
				return fuzzysearch(query.toLowerCase(), collection.title.toLowerCase());
			}}
			itemRenderer={(item, { handleClick, modifiers }) => {
				const collection = collectionsById[item];
				return (
					<li key={item}>
						<button
							type="button"
							tabIndex={-1}
							onClick={handleClick}
							className={
								modifiers.active ? 'bp3-menu-item bp3-active' : 'bp3-menu-item'
							}
						>
							{collection.title}
						</button>
					</li>
				);
			}}
			selectedItems={props.selectedCollectionIds}
			tagRenderer={(item) => {
				const collection = collectionsById[item];
				return collection && collection.title;
			}}
			tagInputProps={{
				onRemove: props.onRemove,
				placeholder: props.placeholder,
				collectionProps: {
					className: 'bp3-minimal bp3-intent-primary',
				},
				inputProps: {
					placeholder: props.placeholder,
				},
			}}
			resetOnSelect={true}
			onItemSelect={props.onItemSelect}
			noResults={<div className="bp3-menu-item">No Matching Collections</div>}
			popoverProps={{
				popoverClassName: 'bp3-minimal',
				position: Position.BOTTOM_LEFT,
				modifiers: {
					preventOverflow: { enabled: false },
					hide: { enabled: false },
				},
			}}
		/>
	);
};

CollectionMultiSelect.propTypes = propTypes;
CollectionMultiSelect.defaultProps = defaultProps;
export default CollectionMultiSelect;
