const TelegramApi = require('node-telegram-bot-api')
const token = '5451880414:AAE6udJFp3yP9W0Sgihu0OrvUEZuIbRbwR4'

const bot = new TelegramApi(token, {polling: true})

const {gameOptions, againOptions} = require('./options')

const chats = {};



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю число от 0 до 9, тебе нужно будет отгадать это число.`)
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Я готова, отгадывай.`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Дает информацию о пользователе'},
        {command: '/game', description: 'Сыграть в "угадай число"'}
    ])
    
    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if (text === '/start') {
            return bot.sendMessage(chatId, `Привет, ${msg.from.first_name}. Меня зовут Алуна.`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}, ID по которому тебя могут найти в телеграм - ${msg.from.username}.`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, `К сожалению, я не понимаю, что вы пишите.`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
           return startGame(chatId)
        }
        if(data == chats[chatId]) {
            return bot.sendMessage(chatId, `Ты победил, цифра была ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению, ты не угадал, я выбрала ${chats[chatId]}`, againOptions)
        }
    })
}

start();