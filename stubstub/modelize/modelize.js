/* eslint-disable no-restricted-syntax */
import * as models from '../../server/models';

import { parse } from './parse';
import { link } from './link';
import { builders } from './builders';
import { buildProxyObject } from './proxy';

const buildForModelName = (modelName, args) => {
	const builderFn = builders[modelName];
	if (builderFn) {
		return builderFn(args);
	}
	const Model = models[modelName];
	return Model.create(args);
};

const buildModelFromDefinition = async (modelDefinition, graph, resolvedModelsById) => {
	const { id, properties, modelName } = modelDefinition;
	const foreignKeys = {};
	for (const { v, w } of graph.outEdges(id)) {
		const association = graph.edge(v, w);
		const targetModel = resolvedModelsById[w];
		const { foreignKey } = association;
		foreignKeys[foreignKey] = targetModel.id;
	}
	const args = { ...properties, ...foreignKeys };
	return buildForModelName(modelName, args);
};

const indexDefinitionsById = (definitions) => {
	const index = [];
	for (const def of definitions) {
		index[def.id] = def;
	}
	return index;
};

const templatize = (strings, ...slots) => {
	const parameters = {};
	const slotReplacements = [];
	for (const slotValue of slots) {
		const paramName = 'P' + Object.keys(parameters).length.toString();
		parameters[paramName] = slotValue;
		slotReplacements.push('$' + paramName);
	}

	let query = '';
	for (let i = 0; i < strings.length; i++) {
		query += strings[i];
		if (slotReplacements[i]) {
			query += slotReplacements[i];
		}
	}

	return { query: query, parameters: parameters };
};

export const modelize = (...args) => {
	const { query, parameters } = templatize(...args);
	const ast = parse(query);
	const { definitions, graph, subsets } = link(ast, parameters);
	const resolvedModelsById = {};
	const resolvedModelsByBoundName = {};
	const definitionsById = indexDefinitionsById(definitions);

	const resolve = async () => {
		for (const subset of subsets) {
			// eslint-disable-next-line no-await-in-loop
			await Promise.all(
				subset.map(async (id) => {
					const definition = definitionsById[id];
					const { boundName } = definition;
					const model = await buildModelFromDefinition(
						definition,
						graph,
						resolvedModelsById,
					);
					resolvedModelsById[id] = model;
					if (boundName) {
						if (resolvedModelsByBoundName[boundName]) {
							throw new Error(
								`Modelize found duplicate bound identifier ${boundName} in template.`,
							);
						}
						resolvedModelsByBoundName[boundName] = model;
					}
				}),
			);
		}
		return resolvedModelsByBoundName;
	};

	const resolvePromise = resolve();
	return buildProxyObject(resolvePromise);
};
