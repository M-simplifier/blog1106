import { prisma } from "@/prismaClient";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            const dbUser = await prisma.user.findUnique({
                where: {
                    email: user.email!
                }
            })
            if (!dbUser) {
                await prisma.user.create({
                    data: {
                        email: user.email!,
                        name: user.name!,
                        profile: ""
                    }
                })
            }
            return true
        },
    }
})

export { handler as GET, handler as POST }