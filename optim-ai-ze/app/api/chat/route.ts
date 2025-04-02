import OpenAI from 'openai'

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Set runtime to edge for streaming
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, promptContent, roleContent, userProfile } = await req.json()

  // Create system message from prompt, role, and user profile
  let systemMessage = ""
  if (promptContent) {
    systemMessage += promptContent + "\n\n"
  }
  if (roleContent) {
    systemMessage += "Role Instructions:\n" + roleContent + "\n\n"
  }
  if (userProfile) {
    systemMessage += "User Profile:\n"
    if (userProfile.name) systemMessage += `Name: ${userProfile.name}\n`
    if (userProfile.profession) systemMessage += `Profession: ${userProfile.profession}\n`
    if (userProfile.expertise?.length) systemMessage += `Expertise: ${userProfile.expertise.join(", ")}\n`
    if (userProfile.interests?.length) systemMessage += `Interests: ${userProfile.interests.join(", ")}\n`
    if (userProfile.description) systemMessage += `Description: ${userProfile.description}\n`
  }

  // Add system message if we have any context
  const messagesWithContext = systemMessage 
    ? [{ role: 'system', content: systemMessage }, ...messages]
    : messages

  try {
    // Ask OpenAI for a streaming chat completion
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      stream: true,
      messages: messagesWithContext,
      temperature: 0.7,
      max_tokens: 2000
    })

    // Transform the OpenAI stream into a simple text stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let accumulatedResponse = ''
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) {
              accumulatedResponse += text
              // Simple plain text streaming - will be handled by Vercel AI SDK
              controller.enqueue(encoder.encode(text))
            }
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return new Response(
      JSON.stringify({ error: 'There was an error processing your request' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

