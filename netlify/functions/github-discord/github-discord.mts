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

const onStar = (payload: any): string => {
    let message: string
    const {action, sender, repository, starred_at} = payload

    return message = `User ${sender.login} ${action} star on ${repository.full_name}`
}

const onIssue =(payload: any): string => {
    const {action, issue} = payload

    if (action === 'opened') {
        return `An issue was opened with title: "${issue.title}"`
    }

    if (action === 'closed') {
        return `An issue was closed by ${issue.user.login}`
    }

    if (action === 'reopened') {
        return `An issue with title "${issue.title}" was reopened by ${issue.user.login}`
    }

    return `Unhandled action for the issue event ${action}`
}

export default async (req: Request, context: Context) => {
    const githubEvent = req.headers.get('x-github-event') ?? 'unknown'
    let payload

    if (req.body) {
        const reader = req.body.getReader()
        const result = await reader.read()
        const decoder = new TextDecoder('utf-8')
        const text = decoder.decode(result.value)
        payload = JSON.parse(text)
    }

    let message: string
    console.log(payload)

    switch (githubEvent) {
        case 'star':
            message =onStar(payload)
            break

        case 'issues':
            message = onIssue(payload)
            break

        default:
            message = `Unknown event ${githubEvent}`
    }


    await notify(message)

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
