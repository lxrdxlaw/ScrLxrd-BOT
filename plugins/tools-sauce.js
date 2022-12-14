import fs from 'fs'
import sagiri from 'sagiri'
let l = 'ć'
let r = 'ć'

let sauceClient = sagiri('96a418eb1f0d7581fad16d30e0dbf1dbbdf4d3bd')

let handler = async (m, { conn, usedPrefix, command }) => {
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || ''
	if (/image/.test(mime)) {
		let media = Date.now() + '.' + mime.split('/')[1]
		fs.writeFileSync(media, await q.download())
		let sauce = await sauceClient(media)
		let txt = sauce.map(({ url, site, similarity, thumbnail, authorName, authorUrl }) => {
			return `*${l}ā${r} Similarity:* ${similarity}%\n*${l}š${r}  Site:* ${site}\n*${l}š${r} Url:* ${url}\n*${l}š§§${r} Thumb:* ${thumbnail}\n*${l}šļø${r} Author Name:* ${authorName}\n*${l}ā${r} Author Url:* ${authorUrl}`
		}).join('\n\nāāāāāāāāāāāāāāāāāāāāāāāāāāāāāāāāāāāāāāāāāāā\n\n')
		await conn.sendFile(m.chat, sauce[0].thumbnail, 0, txt.trim(), m, false, {thumbnail: global.thumb2 })
		fs.unlinkSync(media)
	} else throw 'Reply imagenya'
}
handler.help = ['sauce']
handler.tags = ['tools']
handler.command = /^(sauce)$/i

export default handler
