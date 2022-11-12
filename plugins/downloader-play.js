import axios from 'axios'
import yts from 'yt-search'
import ytdl from 'ytdl-core'

let handler = async (m, { conn, text, usedPrefix: _p }) => {
	if (!text) throw 'Input Query'
	let vid = await yts(ytdl.validateURL(text) ? { videoId: await ytdl.getURLVideoID(text) } : { query: text })
	vid = vid.videos ? vid.videos[0] : vid
	if (!vid) throw `Query "${text}" Not Found :/`
	let { title, description, url, seconds, timestamp, views, ago, image } = vid
	let ytLink = (await axios.post('https://api.onlinevideoconverter.pro/api/convert', new URLSearchParams(Object.entries({ url })) )).data?.mp3Converter
	let capt = `*Title:* ${title}\n*Published:* ${ago || ''}\n*Duration:* ${timestamp}\n*Views:* ${views?.toLocaleString()}\n*Url:* ${url}`
	let buttons = [
		{ buttonText: { displayText: 'Audio (Document)' }, buttonId: `${_p}yta ${url} --doc` },
		{ buttonText: { displayText: 'Video' }, buttonId: `${_p}ytv ${url} 360` }
	]
	let msg = await conn.sendMessage(m.chat, { image: { url: image }, caption: capt, footer: '_Audio on progress..._', buttons }, { quoted: m })
	// if (seconds > 3600) return conn.sendMessage(m.chat, { document: { url: ytLink }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m })
	conn.sendMessage(m.chat, { [seconds > 1800 ? 'document' : 'audio']: { url: ytLink }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: msg })
}
handler.help = handler.alias = ['play']
handler.tags = ['downloader']
handler.command = /^(play)$/i
handler.exp = 0

export default handler
