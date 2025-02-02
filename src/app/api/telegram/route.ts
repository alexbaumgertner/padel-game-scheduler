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

      // Define keyboard options
      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '👍 Yes', callback_data: 'yes' },
              { text: '👎 No', callback_data: 'no' },
            ],
            [{ text: '📅 Schedule', callback_data: 'schedule' }],
          ],
        },
      }

      // Send message with buttons
      await bot.sendMessage(chatId, 'Would you like to play padel?', options)
    }

    // Handle button clicks (callback queries)
    if (body.callback_query) {
      const callbackQuery = body.callback_query
      const chatId = callbackQuery.message.chat.id
      const data = callbackQuery.data

      let responseText = ''
      switch (data) {
        case 'yes':
          responseText = "Great! Let's schedule a game!"
          break
        case 'no':
          responseText = 'Maybe next time!'
          break
        case 'schedule':
          responseText = 'Opening schedule options...'
          break
      }

      // Answer the callback query (to remove loading state from button)
      await bot.answerCallbackQuery(callbackQuery.id)

      // Send response message
      await bot.sendMessage(chatId, responseText)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Error processing telegram webhook:', error)
    return NextResponse.json(
      { status: 'error', message: (error as Error).message },
      { status: 500 }
    )
  }
}
