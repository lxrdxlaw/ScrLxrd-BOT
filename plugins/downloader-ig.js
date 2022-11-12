import fetch from 'node-fetch'
import { igApi } from 'insta-fetcher'

let handler = async (m, { conn, args }) => {
	if (args[0] && /(?:\/p\/|\/reel\/|\/tv\/)([^\s&]+)/.test(args[0])) { /* IG Post || Reel || TV */
		let ig = await igFunc()
		let data = await ig.fetchPost(args[0])
		await m.reply('_In progress, please wait..._')
		for (let x = 0; x < data.links.length; x++) {
			let caption = x == 0 ? data.caption : ''
			await conn.sendMessage(m.chat, { [data.links[x].type]: { url: data.links[x].url }, caption }, { quoted: m })
		}
	} else if (args[0] && /\/s\/([^\s&]+)/.test(args[0])) { /* IG Highlights */
		let ig = await igFunc()
		let [url, highlightId, mediaId] = /https:\/\/www\.instagram\.com\/s\/(.*?)\?story_media_id=([\w-]+)/g.exec(args[0])
		highlightId = Buffer.from(highlightId, 'base64').toString('binary').match(/\d+/g)[0]
		url = await (await fetch(url)).url + '?__a=1&__d=dis'
		let user = (await (await fetch(url)).json()).user
		let res = await ig.fetchHighlights(user.username)
		await m.reply('_In progress, please wait..._')
		let filterHighlight = res.data.filter(x => highlightId.match(x.highlights_id))[0]
		let data = filterHighlight.highlights.filter(x => mediaId.match(x.media_id.match(/(\d+)/)[0]))[0]
		await conn.sendMessage(m.chat, { [data.type]: { url: data.url }, caption: filterHighlight.title }, { quoted: m })
	} else if (args[0] && /\/stories\/([^\s&]+)/.test(args[0])) { /* IG Story */
		let ig = await igFunc()
		let [, user, id] = (new URL(args[0])).pathname.split`/`.filter(v => v)
		let res = await ig.fetchStories(user), data = res.stories.filter(v => v.id.includes(id))[0]
		if (!data?.url) throw 'Story not found'
		await m.reply('_In progress, please wait..._')
		await conn.sendMessage(m.chat, { [data.type]: { url: data.url }, caption: data.caption || '' }, { quoted: m })
	} else throw 'Invalid URL'
}
handler.help = ['instagram']
handler.tags = ['downloader']
handler.command = /^(ig(dl)?|instagram(dl)?)$/i

export default handler

export async function igFunc() {
	let ig = new igApi('csrftoken=5j4O3S5VRUjvKJdMvU0ayQIpzjrfGdyN; mid=YMAM-QALAAEGk1JspdQtrqJ34r9u; ds_user_id=4864129873; sessionid=4864129873%3AbJz2Pyh6k7R2q4%3A25%3AAYdB8FBAhgD4ih32q20a6L3o0yRr_Vm5uC973VJJDg; ig_did=C0FFC6C7-D587-49D1-B1AA-93AB606EBFBA')
	return ig
}