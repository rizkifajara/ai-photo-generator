import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'
import rateLimit from '@/lib/rateLimit'

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
})

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    try {
        await limiter.check(NextResponse.next(), 5, ip)
    } catch {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    
    try {
        const { prompt } = await req.json();
        const response = await hf.textToImage({
            model: 'black-forest-labs/FLUX.1-schnell',
            inputs: prompt,
            parameters: {
                guidance_scale: 0.0,
                num_inference_steps: 4,
                // max_sequence_length: 256,
            },
        });
        console.log('Hugging Face API response received')

        // Convert blob to base64
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:image/png;base64,${base64}`;

        return NextResponse.json({ image: dataUrl });
    } catch (error: any) {
        console.error('Error generating image:', error);
        return NextResponse.json({ error: 'Failed to generate image', details: error.message }, { status: 500 });
    }
}