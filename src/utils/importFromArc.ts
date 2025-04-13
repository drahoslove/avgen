import { z } from 'zod'
import { EventData } from '../types'
import { toLocalIsoString, trimNonLetters } from './strings'
import safeFetch from './safeFetch'

// const EXAMPLEDATA: ArcEvent = {
//   "@context": "https://schema.org",
//   "@type": "Event",
//   "name": "Cube of Truth: München",
//   "startDate": "2025-04-18T14:00:00.000Z",
//   "endDate": "2025-04-18T17:00:00.000Z",
//   "location": { "@type": "Place", "name": "Neuhauserstraße 2, 80331 München" },
//   "description": "Wenn Sie daran interessiert sind, über zukünftige Ortsgruppen -  Aktivitäten auf dem Laufenden zu bleiben, schließen Sie sich bitte der folgenden Freiwilligengruppe bei Facebook\nan:\nhttps://www.facebook.com/groups/105129960061420/\n\nDer Cube of Truth ist eine Straßen Kampagne, die direkte Aktionen in der Öffentlichkeit in strukturierter Weise durchführt. Wir verwenden Filmmaterial von Standardpraktiken, das auf Bildschirmen gezeigt wird, um der Öffentlichkeit die Wahrheit über die Tierhaltung zu enthüllen, und führen Einzelgespräche, um sie über die Ausbeutung von Tieren aufzuklären. Bevor Ihr an einer Cube of Truth Demonstration teilnehmt, ist es zwingend erforderlich, dass Ihr Euch mit unserem AV-Outreach-Protokoll vertraut macht, indem Ihr Euch den vollständigen Workshop \"Nicht-Veganer zur Verantwortung ziehen\" anseht und unser AV-Outreach-Protokoll Dokument lest:\n\nHolding Non-Vegans Accountable Workshop:\nhttps://bit.ly/holdingnonvegansaccountable\n\nAV Outreach Protokoll:\nhttp://bit.ly/AVOutreachProtocol\n\nMasken, Schilder und Karten werden von den Organisatoren zur Verfügung gestellt.\n\nWenn Ihr an einem Cube of Truth teilnehmt, bringt bitte keine Taschen oder persönliche Gegenstände mit, es sei denn, dies ist unbedingt notwendig. Falls doch, bedeutet dies, dass Ihr Eure Tasche für die Dauer der Veranstaltung tragen werdet, packt also bitte leicht. Alle zum Cube mitgebrachten Gegenstände unterliegen Eurer eigenen Verantwortung. DIE ORGANISATOREN WERDEN EURE PERSÖNLICHE GEGENSTÄNDE NICHT AUFBEWAHREN UND SIND IN KEINER WEISE FÜR SIE VERANTWORTLICH.\n\nTragt bitte stets wetterangepasste Kleidung mit AV Label oder KOMPLETT SCHWARZ ohne Aufschriften, einschließlich Logos anderer Organisationen und/oder veganer Botschaften. Dies ist für unsere Ästhetik unerlässlich. Ihr könnt offizielle AV-Kleidung auf unserer Website kaufen: cubeoftruth.com. An einem Cube of Truth darf auf keinen Fall Kleidung und Schuhe aus Tiermaterial und kein Kunstpelz (einschließlich Kunstpelzbesatz) getragen werden.\n\nRespektiert bitte jederzeit die Organisatoren der AV-Ortsgruppen und andere Freiwillige, haltet Euch an unsere Struktur und vertretet unsere Grundwerte, während Ihr an einem Cube of Truth teilnehmt. Die Ernsthaftigkeit und Professionalität unseres Handelns stehen in direktem Verhältnis dazu, wie die Öffentlichkeit uns wahrnimmt.\n\nDanke, dass Ihr mit uns zusammen aufsteht.\n\n___________________________________________________________\n\nIf you are interested in staying up to date on future chapter activity, please join the following volunteer group: \nhttps://www.facebook.com/groups/105129960061420/\n\nThe Cube of Truth is a street outreach campaign that employs direct action with the public, in a structured manner. We use standard practice footage displayed on screens to expose the truth about animal agriculture to the public and one on one conversations to educate them about animal exploitation. Before attending a Cube of Truth it is mandatory that you learn our AV Outreach Protocol of by watching the full “Holding Non-Vegans Accountable” outreach workshop and reading our AV Outreach Protocol document:\n\nHolding Non-Vegans Accountable Workshop:\nhttps://bit.ly/holdingnonvegansaccountable\n\nAV Outreach Protocol:\nhttp://bit.ly/AVOutreachProtocol\n\nMasks, signs, and outreach cards are provided by the organisers.\n\nWhen attending a Cube of Truth, please do not bring bags or personal belongings unless you absolutely need to. If you do, this means you will be wearing your bag for the duration of the event, so pack lightly. Any items brought to the Cube are your responsibility. ORGANISERS WILL NOT BE STORING AND ARE NOT RESPONSIBLE FOR YOUR PERSONAL BELONGINGS IN ANY WAY. \n\nAlways wear weather appropriate, PLAIN BLACK or AV branded clothing without any graphics, including logos of other organisations and/or vegan messages. This is essential to our aesthetic. You can purchase official AV clothing on our website: cubeoftruth.com. Absolutely no animal derived clothing and  footwear and no fake fur (including faux fur trims) is to be worn at a Cube of Truth.\n\nRespect AV chapter organisers and other volunteers at all times, adhere to our structure and represent our core values while attending a Cube of Truth. The seriousness and professionalism of our actions are directly proportional to how the public perceives us.\n\nThank You for Standing With Us.\n",
//   "url": "https://animalrightscalendar.org//events/67ee92e26f327958386f13ed",
//   "performer": { "@type": "Organization", "name": "Anonymous for the Voiceless: München, Germany" }
// }

const ArcEventSchema = z.object({
  '@context': z.string(),
  '@type': z.string(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.object({ '@type': z.string(), name: z.string() }),
  description: z.string(),
  url: z.string(),
  performer: z.object({ '@type': z.string(), name: z.string() }),
})

type ArcEvent = z.infer<typeof ArcEventSchema>

const importFromArc = async (url: string): Promise<EventData> => {
  const page = await safeFetch(url)

  const html = await page.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const jsonScript = doc.querySelector('script[type="application/ld+json"]')
  if (!jsonScript) {
    throw new Error('No data found')
  }
  const jsonData = jsonScript.textContent
  if (!jsonData) {
    throw new Error('No data found')
  }
  let data: unknown
  try {
    data = JSON.parse(jsonData)
  } catch (e) {
    console.error('Error parsing data', e)
    throw new Error(`Invalid data`)
  }

  const parsedData: ArcEvent = ArcEventSchema.parse(data)
  const {
    name,
    startDate,
    endDate,
    location: { name: locationName },
  } = parsedData

  const chapterName: string =
    name
      .split(':')
      .find(part => !part.includes('Cube of Truth'))
      ?.trim() ?? ''
  const location: string = trimNonLetters(locationName.replace(chapterName, ''))
  const date: string = toLocalIsoString(startDate).split('T')[0]
  const timeStart: string = toLocalIsoString(startDate)
    .split('T')[1]
    .split('.')[0]
    .replace(/:00$/, '')
  const timeEnd: string = toLocalIsoString(endDate).split('T')[1].split('.')[0].replace(/:00$/, '')

  return {
    chapterName,
    location,
    date,
    timeStart,
    timeEnd,
  }
}

export default importFromArc
