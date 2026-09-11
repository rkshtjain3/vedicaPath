import { NextResponse } from 'next/server';
import { synthesizeAstrologicalPrompt, LocalLLMService } from '@vedica/ai-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const llmService = new LocalLLMService();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      question,
      calculationData,
      fullName,
      language = 'en',
      conversationHistory = [],
      engineMode = 'rag',
      selectedModel,
    } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    if (!calculationData) {
      return NextResponse.json({ error: 'Calculation data is required' }, { status: 400 });
    }

    // Synthesize airtight multi-turn RAG prompt from deterministic calculations
    const prompt = synthesizeAstrologicalPrompt({
      question,
      calculationData,
      fullName,
      language,
      conversationHistory,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial metadata event with topic, archetype & followUp suggestions
          const metaPayload = JSON.stringify({
            type: 'meta',
            topic: prompt.context.detectedTopic,
            archetype: prompt.context.primaryArchetype,
            followUps: prompt.followUpSuggestions,
            confidence: prompt.context.confidenceRating,
          });
          controller.enqueue(encoder.encode(`data: ${metaPayload}\n\n`));

          // Stream tokens
          const tokenStream = llmService.streamResponse(prompt, {
            model: selectedModel,
            engineMode: engineMode as 'rag' | 'ollama' | 'auto',
          });
          for await (const token of tokenStream) {
            const tokenPayload = JSON.stringify({ type: 'token', token });
            controller.enqueue(encoder.encode(`data: ${tokenPayload}\n\n`));
          }

          // Send done event with followUp suggestions
          const donePayload = JSON.stringify({
            type: 'done',
            followUps: prompt.followUpSuggestions,
          });
          controller.enqueue(encoder.encode(`data: ${donePayload}\n\n`));
          controller.close();
        } catch (streamErr: any) {
          const errPayload = JSON.stringify({ type: 'error', error: streamErr?.message || 'Streaming failed' });
          controller.enqueue(encoder.encode(`data: ${errPayload}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('AI Ask API error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
