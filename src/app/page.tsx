'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ImageIcon, DownloadIcon } from "lucide-react"

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

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `ai-generated-image-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-bg min-h-screen">
      <h1 className="text-6xl font-heading text-center mb-2 text-text transform -rotate-2">AI Photo Generator</h1>
      <p className="text-center text-2xl mb-8 text-text transform rotate-1">Transform your ideas into stunning images with AI</p>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-8 border-4 border-border shadow-light">
          <CardContent className="p-6 bg-main">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full border-4 border-border text-xl p-4 bg-bg placeholder-secondaryBlack rounded-base"
              />
              <Button 
                type="submit" 
                className="w-full bg-mainAccent hover:bg-main text-text font-heading py-4 px-6 text-xl border-4 border-border rounded-base transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-light"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
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
        <div className="text-red-600 text-center mb-4 text-xl font-heading">{error}</div>
      )}

      {generatedImage && (
        <Card className="mb-8 border-4 border-border shadow-light">
          <CardContent className="p-6 bg-main">
            <h2 className="text-3xl font-heading mb-4 text-text transform -rotate-1">Generated Image</h2>
            <div className="aspect-square relative mb-4 border-4 border-border">
              <img
                src={generatedImage}
                alt="AI Generated"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleDownload} 
                className="px-6 py-3 text-xl bg-mainAccent hover:bg-main text-text font-heading border-4 border-border rounded-base transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-light"
              >
                <DownloadIcon className="mr-2 h-6 w-6" />
                Download Image
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {previousImages.length > 0 && (
        <div className="border-4 border-border p-6 bg-main shadow-light rounded-base">
          <h2 className="text-3xl font-heading mb-4 text-text transform rotate-1">Previous Generations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previousImages.map((img, index) => (
              <div key={index} className="aspect-square relative border-4 border-border">
                <img
                  src={img}
                  alt={`Previous generation ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}