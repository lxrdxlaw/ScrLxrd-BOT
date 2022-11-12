let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Pengunaan:\n${usedPrefix + command} <teks>\n\nContoh:\n${usedPrefix + command} ini komen`
  conn.sendFile(m.chat, API('https://some-random-api.ml', '/canvas/youtube-comment', {
    avatar: await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
    comment: text,
    username: conn.getName(m.sender)
  }), 'file.png', '', m)
}

handler.help = ['ytcomment']
handler.tags = ['tools']

handler.command = /^(ytcomment)$/i

export default handler