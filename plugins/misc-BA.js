import axios from 'axios'
async function fetchJson(url, options) {
  try {
      options ? options : {}
      const res = await axios({
          method: 'GET',
          url: url,
          headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
          },
          ...options
      })
      return res.data
  } catch (err) {
      return err
  }
}
async function handler(m, { args, conn }) {
let q = args.join(` `)
if (!q) return m.reply('Masukkan nama muridnya!')
let aw = q.split('-fix')[0]
let awm = aw.split(' ').join('_')
let similiar1 = await fetchJson(`https://bluearchive.wiki/w/api.php?action=opensearch&search=${awm}&format=json`)
let wq = similiar1.indexOf(capitalizeFirstLetter(awm))
let qq = q.split(' ').join('_')
let similiar = await fetchJson(`https://bluearchive.wiki/w/api.php?action=opensearch&search=${qq}&format=json`)


if(q.includes('-')){
try {

let thumbss = await fetchJson(`https://bluearchive.wiki/w/api.php?action=query&titles=File:${similiar1[1][wq]}.png&prop=imageinfo&iilimit=50&iiend=2007-12-31T23:59:59Z&iiprop=timestamp|user|url&format=json`)
let thumbww = Object.keys(thumbss.query.pages)
let thumb = thumbss.query.pages[thumbww].imageinfo[0].url



let fullsw = await fetchJson(`https://bluearchive.wiki/w/api.php?action=query&titles=File:${similiar1[1][wq]}_full.png&prop=imageinfo&iilimit=50&iiend=2007-12-31T23:59:59Z&iiprop=timestamp|user|url&format=json`)
let fusll = Object.keys(fullsw.query.pages)
let full = fullsw.query.pages[fusll].imageinfo[0].url

let alldb = await fetchJson('https://bluearchive.wiki/w/rest.php/v1/page/'+ similiar1[1][wq])

let datas = JSON.parse(JSON.stringify(await fetchJson("https://raw.githubusercontent.com/lonqie/SchaleDB/main/data/en/students.json")))
let satu = datas.find((obj => obj.Name == alldb.title));
let bint = ''
let yeksnya = ''
let skills = ''
try {
for (var i = 0; i < satu.StarGrade; i++) {
  bint += "⭐"
}


for (let item of satu.Equipment) {
yeksnya += `${item} `
}

for (let itesm of satu.Skills) {
skills += `• Type: ${itesm.SkillType}\n`
skills += `• Name: ${itesm.Name}\n`
let abg = itesm.Desc.split('<b:').join('')
let abg2 = abg.split('>').join('')
let desc = abg2.split('<?').join('')
skills += `• Desc: ${desc}\n\n`
}
} catch {
  satu = {}

}


let str = `
📌 Name: ${satu.FamilyName || '-'} ${satu.PersonalName || ''}
🏫 School: ${satu.School || '-'}
🎋 Club: ${satu.Club || '-'}
🏅 Star Grade: ${bint || '⭐'}
🎭 Role: ${satu.TacticRole || '-'}
🎴 Position: ${satu.Position || '-'}
🎨 Hobby: ${satu.hobby || '-'}
🎲 Attact Type: ${satu.BulletType || '-'}
🔰 Armor Type: ${satu.ArmorType || '-'}
🏹 Weapon: ${satu.WeaponType || '-'}
🎉 Birthday: ${satu.BirthDay || '-'}
🎐 Equip: ${yeksnya || '-'}

Desc:

${satu.ProfileIntroduction || '-'}

Skill:

${skills || '-'}`

await conn.sendMessage(
m.chat,
{
image: { url: full },
caption: str,
},
{ quoted: m })
} catch (e) {
throw e
}
} else if(similiar[1].length >= 1.5) {
let listnya = []
for (let item of similiar[1]) {
listnya.push({title: `${item}`, rowId: `#ba-info ${item} -fix`})
}
const sections = [
    {
	title: "</Hello World>",
	rows: listnya
    }
]
 
const listMessage = {
  text: `I found ${similiar[1].length} similarities which one do you want?`,
  footer: "choose what you want",
  title: "Blue Archive Students",
  buttonText: "search",
  sections
}
await conn.sendMessage(m.chat, listMessage, { quoted: m })
} else if(similiar[1].length == 1) {
try {
let thumbss = await fetchJson(`https://bluearchive.wiki/w/api.php?action=query&titles=File:${similiar[1][0]}.png&prop=imageinfo&iilimit=50&iiend=2007-12-31T23:59:59Z&iiprop=timestamp|user|url&format=json`)
let thumbww = Object.keys(thumbss.query.pages)
let thumb = thumbss.query.pages[thumbww].imageinfo[0].url



let fullsw = await fetchJson(`https://bluearchive.wiki/w/api.php?action=query&titles=File:${similiar[1][0]}_full.png&prop=imageinfo&iilimit=50&iiend=2007-12-31T23:59:59Z&iiprop=timestamp|user|url&format=json`)
let fusll = Object.keys(fullsw.query.pages)
let full = fullsw.query.pages[fusll].imageinfo[0].url

let alldb = await fetchJson('https://bluearchive.wiki/w/rest.php/v1/page/'+ similiar[1][0])

let datas = JSON.parse(JSON.stringify(await fetchJson("https://raw.githubusercontent.com/lonqie/SchaleDB/main/data/en/students.json")))
let satu = datas.find((obj => obj.Name == alldb.title));
let bint = ''
let yeksnya = ''
let skills = ''
try {
for (var i = 0; i < satu.StarGrade; i++) {
  bint += "⭐"
}


for (let item of satu.Equipment) {
yeksnya += `${item} `
}

for (let itesm of satu.Skills) {
skills += `• Type: ${itesm.SkillType}\n`
skills += `• Name: ${itesm.Name}\n`
let abg = itesm.Desc.split('<b:').join('')
let abg2 = abg.split('>').join('')
let desc = abg2.split('<?').join('')
skills += `• Desc: ${desc}\n\n`
}
} catch {
  satu = {}

}


let str = `
📌 Name: ${satu.FamilyName || '-'} ${satu.PersonalName || ''}
🏫 School: ${satu.School || '-'}
🎋 Club: ${satu.Club || '-'}
🏅 Star Grade: ${bint || '⭐'}
🎭 Role: ${satu.TacticRole || '-'}
🎴 Position: ${satu.Position || '-'}
🎨 Hobby: ${satu.hobby || '-'}
🎲 Attact Type: ${satu.BulletType || '-'}
🔰 Armor Type: ${satu.ArmorType || '-'}
🏹 Weapon: ${satu.WeaponType || '-'}
🎉 Birthday: ${satu.BirthDay || '-'}
🎐 Equip: ${yeksnya || '-'}

Desc:

${satu.ProfileIntroduction || '-'}

Skill:

${skills || '-'}`

await conn.sendMessage(
m.chat,
{
image: { url: full },
caption: str,
},
{ quoted: m })
} catch (e) {
throw e
}
} else {
m.reply("NOT-FOUND")
}
} 


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
}

handler.help = ['ba-info']
handler.tags = ['misc']
handler.command = /^(ba-info|bainfo)$/i

export default handler