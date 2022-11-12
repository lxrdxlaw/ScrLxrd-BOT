let handler = m => m

handler.before = async function (m) {
	if (m.chat == '120363021075750772@g.us' || m.chat == '6285773739374-1579976073@g.us') {
		if (m.mtype == 'stickerMessage') return
		if (m.mtype !== 'imageMessage' && m.text.length < 35) return
        conn.logger.info(`Sending news v2 to "${m.chat}"`)
		let a = Object.entries(global.db.data.chats).filter(chat => chat[1].updateAnimeNews)
        let b = a.map(([jid], i) => jid)
		for (let i of b) conn.copyNForward(i, m, true)
	}
}

export default handler