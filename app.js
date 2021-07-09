const dotenv        = require('dotenv');;
dotenv.config();
const moment = require('moment');
const TG = require('telegram-bot-api')
let telegram_key = process.env.telegram_key;
let notion_key = process.env.notion_key;
const api = new TG({
    token: telegram_key
})
const { Client } = require("@notionhq/client")
const notion = new Client({
    auth: notion_key,
})
const axios = require("axios");
const mp = new TG.GetUpdateMessageProvider()
api.setMessageProvider(mp)
api.start()
    .then(() => {
        console.log('API is started')
    })
    .catch(console.err)
api.on('update', update => {
    console.log(update.channel_post)
    if (update.channel_post.text !== undefined) {
        notion.blocks.children.append({
            block_id: 'fdb6b3047ad4424ba25d0b40c26e07ed',
            children: [
                {
                    object: 'block',
                    type: 'heading_2',
                    heading_2: {
                        text: [
                            {
                                type: 'text',
                                text: {
                                    content: update.channel_post.text,
                                },
                            },
                        ],
                    },
                },
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        text: [
                            {
                                type: 'text',
                                text: {
                                    content: moment().utcOffset(330).format("YYYY-MM-DDTHH:mm:ss.SSS"),
                                },
                            },
                        ],
                    },
                },
            ],
        })
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })
    } else if(update.channel_post.photo !== undefined){
        console.log(update.channel_post.photo[0].file_id)
        axios.get(`https://api.telegram.org/bot${telegram_key}/getFile`, {
            params: {
                file_id: update.channel_post.photo[0].file_id
            }
        })
            .then(response => {
                let file_path = response.data.result.file_path;
                let url = `https://api.telegram.org/file/bot${telegram_key}/${file_path}`;
                notion.blocks.children.append({
                    block_id: 'fdb6b3047ad4424ba25d0b40c26e07ed'
                    ,
                    children: [
                        {
                            object: 'block',
                            type: 'heading_2',
                            heading_2: {
                                text: [
                                    {
                                        type: 'text',
                                        text: {
                                            content: 'Image Posted On ' + moment().utcOffset(330).format("YYYY-MM-DDTHH:mm:ss.SSS"),
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            object: 'block',
                            type: 'paragraph',
                            paragraph: {
                                text: [
                                    {
                                        type: 'text',
                                        text: {
                                            content: 'Link',
                                            link: {
                                                url: url,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                })
                    .then(response => {
                        console.log(response)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
    }else {
        console.log(update.channel_post.document.file_id)
        axios.get(`https://api.telegram.org/bot${telegram_key}/getFile`, {
            params: {
                file_id: update.channel_post.document.file_id
            }
        })
            .then(response => {
                let file_path = response.data.result.file_path;
                let url = `https://api.telegram.org/file/bot${telegram_key}/${file_path}`;
                notion.blocks.children.append({
                    block_id: 'fdb6b3047ad4424ba25d0b40c26e07ed'
                    ,
                    children: [
                        {
                            object: 'block',
                            type: 'heading_2',
                            heading_2: {
                                text: [
                                    {
                                        type: 'text',
                                        text: {
                                            content: 'Document Posted On ' + moment().utcOffset(330).format("YYYY-MM-DDTHH:mm:ss.SSS"),
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            object: 'block',
                            type: 'paragraph',
                            paragraph: {
                                text: [
                                    {
                                        type: 'text',
                                        text: {
                                            content: 'Link',
                                            link: {
                                                url: url,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                })
                    .then(response => {
                        console.log(response)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
    }
})