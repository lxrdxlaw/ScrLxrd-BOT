import fetch from "node-fetch"
import { load } from 'cheerio'
import { URL_REGEX } from '@adiwajshing/baileys'

let handler = async (m, { conn, text }) => {
  if (!text) throw `Input Query!`
  if (!/otakudesu.video/i.test(text)) {
  let res = await get(text)
  let sections = [{ title: "Select result", rows: [] }]
  for (let idx in res) {
    sections[0].rows.push({ title: res[idx].judul, rowId: `#anime ${res[idx].link}` })
  }
  await conn.sendMessage(
    m.chat,
    {
        text: "Hasil Pencarian Anime\nclick tombol dibawah untuk memilih.",
        buttonText: "Search Result",
        footer: conn.user.name,
        mentions: [m.sender],
        sections,
    },
    { quoted: m }
)
} else {
let gut = await info(text)
let animeingfo = `✨️ *Title:* ${gut.judul}
🎆️ *Episodes:* ${gut.total_episode}
🎗️ *Genre:* ${gut.genre}
🕑 *Durasi:* ${gut.durasi}
🔚 *Rilis:* ${gut.rilis}
💬 *Show Type:* ${gut.tipe}
💌️ *Rating:* ${gut.rating}
⚡ *Studio:* ${gut.studio}
📌 *Status:* ${gut.anime_status}
👥 *Producer:* ${gut.produser}
💚️ *Sinopsis:* ${gut.sinopsis}`
     conn.sendButton(m.chat, animeingfo, gut.japanese + '\n' + gut.download_lengkap || '' + '\n' + conn.user.name, gut.thumbnail, [['More Detail', `#kuso ${gut.judul}`]], m)
 }
}
handler.help = ['anime']
handler.tags = ['anime']
handler.command = /^(anime)$/i

export default handler

let get = (query) => {
    return new Promise((resolve, reject) => {
        axios({ method: 'GET', url: `https://otakudesu.video/?s=${query}&post_type=anime`, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 XYZ/3.0' }}).then(({data}) => {
                const hasil = []
                const $ = cheerio.load(data)
                $('#venkonten > div > div.venser > div > div > ul > li').each(function (a, b) {
                        let result = {
                            judul: $(b).find('> h2 > a').text(),
                            thumbnail: $(b).find('> img').attr('src'),
                            link: $(b).find('> h2 > a').attr('href')
                        };
                        hasil.push(result);
                    });
                resolve(hasil)
            }).catch(reject)
    })
}

let info = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(url).then(({data}) => {
                const $ = cheerio.load(data)
                        let result = {
                            judul: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(1) > span').text().split(': ')[1],
                            japanese: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(2) > span').text().split(': ')[1],
                            rating: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(3) > span').text().split(': ')[1],
                            produser: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(4) > span').text().split(': ')[1],
                            tipe: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(5) > span').text().split(': ')[1],
                            anime_status: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(6) > span').text().split(': ')[1],
                            total_episode: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(7) > span').text().split(': ')[1],
                            durasi: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(8) > span').text().split(': ')[1],
                            rilis: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(9) > span').text().split(': ')[1],
                            studio: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(10) > span').text().split(': ')[1],
                            genre: $('#venkonten > div.venser > div.fotoanime > div.infozin > div > p:nth-child(11)').text().split(': ')[1],
                            download_lengkap: $('#venkonten > div.venser > div:nth-child(10) > ul > li > span:nth-child(1) > a').attr('href'),
                            thumbnail: $('#venkonten > div.venser > div.fotoanime > img').attr('src'),
                            sinopsis: $('#venkonten > div.venser > div.fotoanime > div.sinopc').text().trim()
                        };
                resolve(result)
            }).catch(reject)
    })
}