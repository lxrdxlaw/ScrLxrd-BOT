import fetch from 'node-fetch'
import { savefrom, tiktokdl, tiktokdlv3 } from '@bochilteam/scraper'

let handler = async (m, { conn, args, usedPrefix }) => {
	if (!args[0]) throw 'Input URL' 
	if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(args[0])) throw 'Invalid URL'
	let { url, status, statusText } = await fetch(args[0])
	if (status !== 200) throw statusText
	let data = await savefrom(url).catch(async _ => await tiktokdl(url)).catch(async _ => await tiktokdlv3(url))
	let meta = await getInfo(url)
	await m.reply('_In progress, please wait..._')
	let vid = data.url?.[0]?.url || data.video?.no_watermark || data.video?.no_watermark2
	let desc = meta?.description || data?.description || data?.meta?.title || ' '
	await conn.sendMessage(m.chat, { video: { url: vid }, caption: desc, footer: await shortUrl(vid), buttons: [{ buttonText: { displayText: 'Audio' }, buttonId: `${usedPrefix}tomp3` }] }, { quoted: m })
	// await conn.sendButton(m.chat, desc, await shortUrl(vid), vid, [['Audio', `${usedPrefix}tomp3`]], m)
}
handler.help = ['tiktok']
handler.tags = ['downloader']
handler.command = /^(tt|tiktok)(dl|nowm)?$/i

export default handler

async function getInfo(url) {
	// url = (await fetch(url)).url
	let id = url.split('?')[0].split('/')
	let res = await (await fetch(`https://www.tiktok.com/node/share/video/${id[3]}/${id[5]}/`)).json().catch(_ => {})
	return res?.seoProps?.metaParams
}

async function shortUrl(url) {
	return await (await fetch(`https://tinyurl.com/api-create.php?url=${url}`)).text().catch(_ => {})
}