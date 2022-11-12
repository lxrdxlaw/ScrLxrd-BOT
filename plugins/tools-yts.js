import yts from 'yt-search'

let handler = async (m, { conn, text, usedPrefix: _p }) => {
	if (!text) throw 'Input Query'
	let res = (await yts(text)).videos 
	if (!res.length) throw `Query "${text}" Not Found`
	let arr = [], arr2 = []
	for (let x of res) arr.push({ title: x.title, description: `Uploaded ${x.ago || '-'}, ${parseInt(x.views).toLocaleString()} views`, rowId: `${_p}yta ${x.url} --doc` })
	for (let x of res) arr2.push({ title: x.title, description: `Uploaded ${x.ago}, ${parseInt(x.views).toLocaleString()} views`, rowId: `${_p}ytv ${x.url} 360p` })
	await conn.sendMessage(m.chat, { text: `Result From: ${text}`, footer: null, title: null, buttonText: 'Result', sections: [{ title: 'Audio', rows: arr }, { title: 'Video', rows: arr2 }] }, { quoted: m })
}
handler.help = ['ytsearch']
handler.tags = ['tools']
handler.command = /^yts(earch)?$/i

export default handler