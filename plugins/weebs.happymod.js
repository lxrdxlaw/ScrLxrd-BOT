let handler = async (m, { text, usedPrefix, command, conn }) => {
    if (!text) throw `uhm.. cari apa?\n\ncontoh:\n${usedPrefix + command} Pou`
    let res = await hwhw(text)
    if (!res.result.length) throw 'Aplikasi tidak ditemukan :/'
    let teks = '[ *HAPPYMOD SEARCH* ]\n\n'
    teks += res.result.map((v) => `*Title:* ${v.title}\n*Link:* ${v.link}\n`).join`\n\n`
    //conn.sendFile(m.chat, res.result.thumb, 'hppy.jpg', teks, m)
    m.reply(teks)
}
handler.help = ['happymod']
handler.tags = ['weebs']
handler.command = /^happymod|hppymod/i

export default handler

import axios from 'axios'
import { load } from 'cheerio'

async function hwhw(q) {
let html = (await axios.get(`https://happymod.com/search.html?q=${q}`)).data;
let $ = load(html)
let tez = $('body > div.container-row.clearfix.container-wrap > div.container-left > section > div.pdt-app-box')

if(!tez.toString()) throw { result: [] };
let res = []

tez.each(function (g, o) {
let link = host+$(o).find('a').attr("href")
let title = $(o).find('a').attr("title");
let thumb = $(o).find('img').attr('data-original');
res.push({ title, link, thumb})
})

return { result: res }
}