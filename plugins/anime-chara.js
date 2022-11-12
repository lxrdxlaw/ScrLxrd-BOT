import fetch from "node-fetch"

let handler = async (m, { conn, text }) => {
    if (!text) throw 'Input Query!'
    // if (text.split(' ').length > 2) return m.reply('Nama Karakter Harus memiliki 2 kalimat saja!\ncontoh:\nGabriel White Tenma:\n#chara Gabriel Tenma\nJadi hanya gunakan 2 kalimat saja :)')
    text = text.split(' ').map((v) => v.capitalize())
    text = text.join(' ')
    let res = await fetch(global.API('https://api.jikan.moe', '/v3/search/character', { q: text }))
    if (!res.ok) return
    let json = await res.json()
    let { name, alternative_names, url, image_url, mal_id, type, anime } = json.results[0]
    let sauce = []
    for (let a in anime) {
       sauce.push(anime[a].name)
    }
    let charaingfo = `[ *CHARACTER* ]
    🔑 *Id Character:* ${mal_id}
    💬 *Name:* ${name}
    💭 *Nickname:* ${alternative_names}
    👤 *Character Type:* ${type === undefined ? 'Default' : type}
    🔗 *Link Karakter:* ${url}
    🔥 *Anime:* 
-${sauce.join('\n-')}`
    conn.sendFile(m.chat, image_url, '', charaingfo, m)
    // conn.sendButton(m.chat, animeingfo, conn.user.name, image_url, [['More Detail', `#kuso ${text.replace('-end', '')}`]], m)
}
handler.help = ['character']
handler.tags = ['anime']
handler.command = /^(chara|character)$/i

export default handler