import { NextResponse } from 'next/server'
import TelegramBot from 'node-telegram-bot-api'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false })

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.message) {
      const chatId = body.message.chat.id
      const text = body.message.text

      console.log({
        chatId,
        text,
      })

      await bot.sendMessage(chatId, `You said (test for Niko): ${text}`)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
