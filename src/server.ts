import express, { type Request, type Response } from 'express'
import publicRouter from '@/routes/public-api'
import { errorMiddleware } from './middleware/error-middleware'

const app = express()

app.use(express.json())
app.use(publicRouter)
app.use(errorMiddleware)

app.get('/api', (req: Request, res: Response) => {
  res.json('Welcome to the RESTful API!')
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
