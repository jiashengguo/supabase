import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { query } = req.body

    if (!query) {
      return res.status(400).json({ message: 'Query is required' })
    }

    const response = await fetch('http://localhost:8000/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('pg-meta error:', response.status, errorText)
      return res.status(response.status).json({
        message: 'Database error',
        error: errorText,
      })
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('API proxy error:', error)
    res.status(500).json({
      message: 'Internal server error',
      error: (error as Error).message,
    })
  }
}
