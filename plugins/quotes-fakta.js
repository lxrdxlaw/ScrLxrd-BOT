import fetch from "node-fetch"

let handler  = async (m, { conn }) => {
            await fetch(`https://raw.githubusercontent.com/HasamiAini/Bot_Takagisan/main/faktanya.txt`)
            .then(res => res.text())
            .then(body => {
                let splitnix = body.split('\n')
                let randomnix = splitnix[Math.floor(Math.random() * splitnix.length)]
                conn.sendButton(m.chat, randomnix, 'Fakta Unik!', null, [['Fakta lainnya', '.fakta']], m)
  })
} 
handler.help = ['fakta']
handler.tags = ['quotes']
handler.command = /^(fakta|faktaunik)$/i

export default handler
