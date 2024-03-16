import type {Context} from "@netlify/functions"

const notify = async (message: string) => {
    const body = {
        content: message,
        embeds: [
            {
                image: {url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExazV4M3lsMW0yeml4bmFyemt6ZnlqdmY5YnFtenZ2dGFyYXVvZDQ1MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NytMLKyiaIh6VH9SPm/giphy.gif'}
            }
        ]
    }

    const resp = await fetch(process.env.DISCORD_WEBHOOK_URL ?? '', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })

    if (!resp.ok) {
        console.log('Error sending message to Discord')
        return false
    }

    return true
}

export default async (req: Request, context: Context) => {
    await notify('Hola mundo desde Netlify')

    return new Response(
        JSON.stringify({
            message: 'done',
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        })
}
