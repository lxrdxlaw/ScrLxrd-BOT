import fetch from 'node-fetch'

let list = ['ass', 'bdsm', 'cum', 'doujin', 'femdom', 'hentai', 'maid', 'orgy', 'panties', 'netorare', 'feet', 'pussy', 'uniform', 'gangbang', 'foxgirl', 'glasses', 'school', 'yuri', 'succubus']

let handler = async (m, { conn, command: cmd, usedPrefix: _p, args }) => {
	let type = (args[0] || '').toLowerCase()
	let param = list.findIndex(v => v.toLowerCase() == type)
	if (param == -1) {
		let arr = []
		for (let x of list.sort()) arr.push({ title: x.capitalize(), rowId: `${_p}${cmd} ${x}` })
		await conn.sendMessage(m.chat, { text: `Type${type ? ` ${type}` : ''} Not Available`, footer: null, title: null, buttonText: 'List Type', sections: [{ rows: arr }] }, { quoted: m })
	} else {
		param = list[param]
		let res = await fetch('https://akaneko-api.herokuapp.com/api/' + param)
		if (!res.ok) throw await res.text()
		let json = await res.json()
		if (!json.url) throw json
		let templateButtons = [
			{ urlButton: { displayText: 'Source', url: json.url }},
			{ quickReplyButton: { displayText: 'Next', id: `${_p}${cmd} ${param}` }}
		]
		await conn.sendMessage(m.chat, { image: { url: json.url }, caption: `Type: ${param.capitalize()}`, footer: null, templateButtons }, { quoted: m })
	}
}
handler.command = /^nsfw$/i

export default handler
