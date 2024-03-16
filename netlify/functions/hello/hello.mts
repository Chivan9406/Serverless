import type {Context} from "@netlify/functions"

export default async (req: Request, context: Context) => {
    console.log('Hola mundo desde los logs Hello')

    return new Response(JSON.stringify({message: 'Hello World'}),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        })
}
