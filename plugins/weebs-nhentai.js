import fetch from 'node-fetch'

import { extractImageThumb } from '@adiwajshing/baileys'
let handler = async (m, { conn, args }) => {

	let code = (args[0] || '').replace(/\D/g, '')

	if (!code) throw 'Input code' 

	await m.reply('_In progress, please wait..._')

	let res = await fetch('https://mxmxk.herokuapp.com/nhentai?code=' + code)

	if (!res.ok) throw await res.statusText

	let json = await res.json()

	let v = await fetch('https://mxmxk.herokuapp.com/nhentai/' + code)

	let json2 = await v.json()

	let buffer = await (await fetch(json.result.images.pages[0])).buffer()

	let jpegThumbnail = await extractImageThumb(buffer)

	conn.sendMessage(m.chat, { document: { url: json2.result }, jpegThumbnail, fileName: json.result.title.english + '.pdf', mimetype: 'application/pdf' }, { quoted: m })

}
 
handler.help = ['nhentai']

handler.tags = ['nsfw']

handler.command = /^(nhentai)$/i

handler.premium = false

handler.limit = false

export default handler

