import 'dotenv/config'

export const dev = {
  app: { 
    port: Number(process.env.PORT) || 3003, 
    jwtUserActivationKey: process.env.JWT_ACCOUNT_ACTIVATION_KEY || 'aaaa',
    stmpUsername: process.env.STMP_USERNAME || "asmasaad3778@gmail.com",
    stmpPassword: process.env.STMP_PASSWORD || "zskx btdw msij pflj",
    
  },
  db: {
    url: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/e-commerce-backend-project',
  },
}
