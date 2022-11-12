import axios from 'axios'
import cheerio from 'cheerio'
import { lookup } from 'mime-types'
import { extract } from 'zs-extract'
let handler = m => m

handler.before = async function (m) {
	let a = Object.entries(global.db.data.chats).filter(chat => chat[1].updateAnime)
    let b = a.map(([jid], i) => jid)
	for (let i of b) {
		let chat = db.data.chats[i] || {}
		if (!chat.lastAnime) chat.lastAnime = []
		let lastAnime = chat.lastAnime
			conn.logger.info(`Checking anime for "${i}"`)
			let { title, cover, url } = (await getLatestAnime())[0]
			if (lastAnime.includes(title)) {
				conn.logger.info(`${title} already sent to "${i}"`)
				continue
			}
			let length = lastAnime[lastAnime.length - 1]
			lastAnime.push(title)
			if (lastAnime.indexOf(length) !== -1) lastAnime.splice(lastAnime.indexOf(length), 1)
			conn.logger.info(`Sending anime ${title} to "${i}"`)
			let detailAnime = await getDetailAnime(url), download = detailAnime.download
			let txt = parseResult(detailAnime, { title: '*ANIME UPDATE*', ignoreKey: ['update', 'cover', 'download'] })
			let list = Object.keys(download).map(v => parseResult(download[v], { headers: `*• ${v}:*`, body: ' - Quality: %key\n - Url: %value' }))
			let zippy = download['Zippy'], isMovie = /Movie/.test(detailAnime.episode)
			let templateButtons = [{ urlButton: { displayText: 'Source', url }}]
			let quoted = await conn.sendMessage(i, { image: { url: cover }, caption: `${txt}\n*• Download:*\n${list.join('\n')}`, footer: detailAnime.update, templateButtons })
			if (isMovie && !('durasi' in detailAnime)) {
				conn.reply(i, 'Bot tidak dapat mengirim file video karena terlalu besar...', quoted)
				continue
			}
			let res = await downloadAnime(zippy?.['480p'] || zippy?.['720p'] || zippy?.['360p']).catch(() => null)
			if (!res) {
				conn.reply(i, 'Link download belum tersedia...', quoted)
				continue
			}
			await conn.sendMessage(i, { document: { url: res?.download }, fileName: res?.filename, mimetype: res?.mimetype }, { quoted })
	}
}

handler.anime = true
export default handler

function parseResult(json, options) {
    // github: https://github.com/Zobin33/Anu-Wabot/blob/master/lib/functions.js#L81
	let opts = {
		unicode: true,
		ignoreVal: [null, undefined],
		ignoreKey: [],
		title: ' ',
		headers: `%title\n`,
		body: `*• %key:* %value`,
		footer: '\n',
		...options
	}
	let { unicode, ignoreKey, title, headers, ignoreVal, body, footer } = opts
	let obj = Object.entries(json), tmp = []
	for (let [_key, val] of obj) {
		if (ignoreVal.indexOf(val) !== -1) continue
		let key = _key.capitalize(), type = typeof val
		if (ignoreKey && ignoreKey.includes(_key)) continue
		switch (type) {
			case 'boolean':
				tmp.push([key, val ? true : false])
			break
			case 'object':
				if (Array.isArray(val)) tmp.push([key, val.join(', ')])
				else tmp.push([key, parseResult(val, { ignoreKey, unicode: false })])
			break
			default:
				tmp.push([key, val])
			break
		}
	}
	if (unicode) {
		let text = [
			headers.replace(/%title/g, title), tmp.map((v) => {
				return body.replace(/%key/g, v[0]).replace(/%value/g, v[1])
			}).join('\n'), footer
		]
		return text.join('\n').trim()
	}
	return tmp
}

async function downloadAnime(url) {
	// url = url?.['Zippy']?.['480p'] || url?.['Zippy']?.['360p']
	let res = await extract(url)
	let mimetype = await lookup(res.download)
	return { ...res, mimetype }
}

async function getLatestAnime() {
	let html = (await axios.get('https://anoboy.ninja/')).data
	let $ = cheerio.load(html), arr = []
	$('div.home_index > a').each((idx, el) => {
		arr.push({
			title: $(el).attr('title'),
			cover: $(el).find('div.amv > amp-img').attr('src'),
			url: $(el).attr('href')
		})
	})
	return arr
}
//https://anoboy.lol/2021/12/tokyo-revengers-live-action-2021/
//https://185.224.82.210/
//https://62.182.83.93/
async function getDetailAnime(url) {
	let html = (await axios.get(url)).data
	let $ = cheerio.load(html), obj = {}
	obj.title = $('div.pagetitle > h1').text().trim().replace(/Subtitle Indonesia/, '')
	obj.episode = /Episode/.test(obj.title) ? obj.title.split(' Episode ')[1] : 'Movie'
	obj.update = $('div.breadcrumb > span > time').attr('datetime')
	$('div.contenttable > table > tbody > tr').each((idx, el) => {
		let text = $(el).find('th').text().toLowerCase()
		if (/semua/.test(text)) return
		obj[text] = $(el).find('td').text()
	})
	obj.sinopsis = $('div.contentdeks').text().trim() || $('div.unduhan').eq(0).text().trim()
	obj.cover = $('div.sisi > amp-img').attr('src')
	obj.download = {}
	$('#colomb > p > span').each((idx, el) => {
		let site = $(el).find('span').text()
		obj.download[site] = {}
		$(el).find('a').each((idx2, el2) => {
			let quality = $(el2).text().replace('SD', '').toLowerCase()
			obj.download[site][quality] = $(el2).attr('href')
		})
	})
	return obj
}


