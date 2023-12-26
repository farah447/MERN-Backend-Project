import 'dotenv/config'

export const dev = {
  app: {
    port: Number(process.env.PORT) || 3003,
    defaultUserImagePath: process.env.DEFAULT_USER_IMAGE_PATH || '',
    defaultProductsImagePath:
      process.env.DEFAULT_PRODUCTS_IMAGE_PATH || '',
    jwtUserActivationKey: process.env.JWT_ACCOUNT_ACTIVATION_KEY || '',
    jwtResetPasswordKey: process.env.JWT_RESET_PASSWORD_KEY || '',
    jwtAccessKey: process.env.JWT_ACCESS_KEY || '',
    stmpUsername: process.env.STMP_USERNAME || '',
    stmpPassword: process.env.STMP_PASSWORD || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
  },
  db: {
    url: process.env.MONGODB_URI || '',
  },
  cloud: {
    cloudinaryName: process.env.CLOUDINARY_NAME || '',
    cloudinaryAPIKey: process.env.CLOUDINARY_API_KEY || '',
    cloudinaryAPISecretKey: process.env.CLOUDINARY_API_SECRET_KEY || '',
  }
}
