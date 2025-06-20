import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const guildId = searchParams.get('guildId')

  if (!guildId) {
    return NextResponse.json({ error: 'GuildID gerekli' }, { status: 400 })
  }

  const endpoint = `https://discord.com/api/guilds/${guildId}/widget.json`

  try {
    const res = await fetch(endpoint)
    if (!res.ok) {
      throw new Error('API yanıt vermedi')
    }

    const data = await res.json()

    return NextResponse.json({
      online: data.presence_count,
      invite: data.instant_invite,
      name: data.name
    });
  } catch (error) {
    return NextResponse.json(
      { online: false, error: 'Sunucuya ulaşılamadı veya geçersiz yanıt.' },
      { status: 200 }
    )
  }
}
