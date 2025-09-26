import express, { Request, Response } from 'express'

const app = express()
const port = 3000

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello Express + TypeScript + Yarn!')
})

app.get('/test', (_req: Request, res: Response) => {
  res.send('This is GET method')
})

app.get('/test123', (_req: Request, res: Response) => {
  res.send('This is GET method')
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
