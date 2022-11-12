let handler = async (m, { conn, args, isOwner }) => {
  global.db.data.changelog = global.db.data.changelog ? global.db.data.changelog : '*[CHANGELOG]*'
  let date = new Date().toLocaleString().split(',')[0]
  if (args[0] == 'add' && args[1]) {
    if (!isOwner) return global.dfail(this, m, 'owner')
    global.db.data.changelog += `\n\n${args[1]} (${date})\n${args.slice(2).join(' ')}`
    m.reply(`Sukses Menambahkan changelog!`)
 } else if (!args[0]) { 
     m.reply(global.db.data.changelog)
  } else return m.reply('Format salah!\nContoh: #changelog add versi penjelasan\n\n#changelog add 1.0.0 -fix bug\n-fix ngebug')
}
handler.help = ['changelog']
handler.tags = ['general']
handler.command =/^(changelog|chg)$/i

export default handler