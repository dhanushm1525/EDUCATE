import dotenv from "dotenv";


dotenv.config();

const requiredEnv = [
    "MONGO_URI",
    "JWT_SECRET"
];


for (const key of requiredEnv){
    if(!process.env[key]){
        throw new Error(`Missing Environment variables: ${key}`);
    }
}

export const env = {
    nodeEnv: process.env.NODE_ENV ?? "development",

    port: Number(process.env.PORT ?? 5050),

    mongoUri: process.env.MONGO_URI!,

    clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',

    jwtSecret: process.env.JWT_SECRET!,

    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "3d"
};


