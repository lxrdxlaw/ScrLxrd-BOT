import cheerio from 'cheerio'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix: _p, command: cmd }) => {
	if (args[0] && args[0].match(/(https:\/\/sfile.mobi\/)/gi)) {
		let res = await sfile.download(args[0])
		if (!res) throw 'Error'
		await m.reply(Object.keys(res).map(v => `*• ${v.capitalize()}:* ${res[v]}`).join('\n') + '\n\n_Sending file..._')
		await conn.sendFile(m.chat, res.download, res.filename, '', m, false, { mimetype: res.mimetype, asDocument: true })
	} else if (args[0]) {
		let query = args.join` `.split`|`[0], page = parseInt(args.join` `.split`|`[1]) || 1,
			res = await sfile.search(query, page)
		if (!res.length) throw `Query "${query}" not found`
		res = res.map(v => `*Title:* ${v.title}\n*Size:* ${v.size}\n*Link:* ${v.link}`).join`\n\n`
		await conn.sendButton(m.chat, res, `Page: ${page}`, null, /0|1/.test(page) ? [['Next', `${_p + cmd} ${query}|${page + 1}`]] : [['Back', `${_p + cmd} ${query}|${page - 1}`], ['Next', `${_p + cmd} ${query}|${page + 1}`]], m)
	} else throw 'Input Query / Sfile Url!'
}
handler.help = ['sfile']
handler.tags = ['downloader']
handler.command = /^(sfile)$/i

export default handler

export const sfile = {
	search: async (query, page = 1) => {
		let res = await fetch(`https://sfile.mobi/search.php?q=${query}&page=${page}`)
		let $ = cheerio.load(await res.text()), arr = []
		$('div.list').each((idx, el) => {
			let title = $(el).find('a').text(),
				size = $(el).text().trim().split(' (')[1],
				link = $(el).find('a').attr('href')
			if (link) arr.push({ title, size: size.replace(')', ''), link })
		})
		return arr
	},
	download: async url => {
		let res = await fetch(url)
		let $ = cheerio.load(await res.text()), obj = {}
		obj.filename = $('div.w3-row-padding').find('img').attr('alt')
		obj.mimetype = $('div.list').text().split(' - ')[1].split('\n')[0]
		obj.filesize = $('#download').text().replace(/Download File/g, '').replace(/\(|\)/g, '').trim()
		obj.download = await getLink(url)
		return obj
	}
}

async function getLink(url) {
	url = 'https://sfile.mobi/download' + (new URL(url)).pathname
	let html = await (await fetch(url)).text()
	return html.split('" rel="nofollow"')[0].split('start, <a href="')[1]
}