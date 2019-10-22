import React, { useState } from 'react';
import Head from 'next/head';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Play, Clipboard } from 'react-feather';

import Nav from '../components/nav';
import { ucwords, selectDatatype } from '../helpers/index';
import './style.css';

const Home = () => {
	const [query, setQuery] = useState('');
	const [schema, setSchema] = useState('');

	const handleQuery = e => setQuery(e.target.value);

	const makeSchema = () => {
		const lines = query.split('\n');
		let graphqlSchema = '';
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].includes('CREATE TABLE')) {
				const tableName = lines[i].replace('CREATE TABLE', '').replace(/[^\w\s]/gi, '');
				graphqlSchema += `type ${ucwords(tableName.trim())}{
        `;
			}

			if (lines[i].trim().startsWith('`')) {
				const fieldLine = lines[i].trim();
				const getField = fieldLine.substr(0, fieldLine.indexOf(' ')).replace(/[^\w\s]/gi, '');
				const notNull = fieldLine.includes('NOT NULL');
				let type = '';
				if (getField === 'id' || getField.includes('_id')) type = 'ID';
				else type = selectDatatype(fieldLine.toLowerCase());
				graphqlSchema += `${getField}: ${type}${notNull && '!'}
        `;
			}

			if (lines[i].startsWith(')')) {
				graphqlSchema += `}
`;
			}

			setSchema(graphqlSchema);
		}
	};

	return (
		<div>
			<Head>
				<title>SQL to Graphql Schema Generator</title>
				<link rel="icon" href="/favicon.ico" />
				<meta charset="UTF-8" />
				<meta name="title" content="SQL to Graphql Schema Generator" />
				<meta name="description" content="Generate graphql schema from SQL Query" />
				<meta name="keywords" content="sql,graphql, schema, graphql schema generator, schema generator" />
				<meta name="author" content="Devzstudio" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				<meta property="og:type" content="website" />
				<meta property="og:title" content="SQL to Graphql Schema Generator" />
				<meta property="og:description" content="Generate graphql schema from SQL Query" />
				<meta property="og:image" content="/cover.png" />

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:title" content="SQL to Graphql Schema Generator" />
				<meta property="twitter:description" content="Generate graphql schema from SQL Query" />
				<meta property="twitter:image" content="/cover.png" />
			</Head>

			<Nav />

			<div className="hero">
				<div className="flex">
					<div className="flex">
						<textarea onBlur={handleQuery} placeholder="SQL Create Table Query"></textarea>
						<div className="btn-wrapper">
							<button onClick={makeSchema}>
								<Play />
							</button>
							{schema && (
								<CopyToClipboard text={schema} onCopy={() => alert('Copied')}>
									<button>
										<Clipboard />
									</button>
								</CopyToClipboard>
							)}
						</div>
					</div>
					<div>
						<textarea placeholder="Graphql Schema" value={schema} readOnly></textarea>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
