import type {Context} from "@netlify/functions"

export default async (req: Request, context: Context) => {
    const myImportanVariable = process.env.MY_IMPORTANT_VARIABLE

    if (!myImportanVariable) {
        throw 'Missing MY_IMPORTANT_VARIABLE'
    }

    console.log('Hola mundo desde los logs Variable')

    return new Response(JSON.stringify({myImportanVariable}),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        })
}
