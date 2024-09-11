'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Image as ImageIcon } from "lucide-react"

export default function Component() {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [previousImages, setPreviousImages] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (response.status === 429) {
        setError('Rate limit exceeded. Please try again later.');
        return;
      }

      const data = await response.json();
      if (data.image) {
        setGeneratedImage(data.image);
        setPreviousImages(prev => [data.image, ...prev.slice(0, 3)])
      } else {
        setError(`Failed to generate image: ${data.error}. ${data.details} || ''}`);
      }
    } catch (err: any) {
      setError('Failed to generate image: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-2">AI Photo Generator</h1>
      <p className="text-center text-gray-600 mb-8">Transform your ideas into stunning images with AI</p>

      <div className="max-w-md mx-auto">
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full"
              />
              <Button type="submit" className="w-full" disabled={isLoading || !prompt.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Image'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}

      {generatedImage && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Generated Image</h2>
            <div className="aspect-square relative">
              <img
                src={generatedImage}
                alt="AI Generated"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {previousImages.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Previous Generations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previousImages.map((img, index) => (
              <div key={index} className="aspect-square relative">
                <img
                  src={img}
                  alt={`Previous generation ${index + 1}`}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}