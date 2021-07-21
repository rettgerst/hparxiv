import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const firstWordPrefixes: Record<string, string> = {
	An: '',
	The: ''
};

const hpPrefix = 'Harry Potter and';

async function main() {
	const url = 'https://arxiv.org/list/q-bio/new';
	console.log('fetching article list from', url);
	const html = await fetch(url).then((res) => res.text());

	const $ = cheerio.load(html);

	const titles = $('.list-title')
		.toArray()
		.map((e) => $(e).text().trim().replace('Title: ', ''))
		.map((text) => {
			const firstWordOfTitle = text.split(' ')[0];

			const prefix = firstWordPrefixes[firstWordOfTitle];

			if (prefix === undefined) return `${hpPrefix} The ${text}`;
			else return `${hpPrefix} ${prefix} ${text}`;
		})
		.map((t) => t.replace(/\s\s+/g, ' '));

	console.log('titles:', titles.join('\n\n'));
}

main().catch(console.error);
