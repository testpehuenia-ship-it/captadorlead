import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: (process.env.DATABASE_URL || "postgresql://dummy") as string,
    // @ts-ignore
    directUrl: (process.env.DIRECT_URL || "postgresql://dummy") as string
  },
})
