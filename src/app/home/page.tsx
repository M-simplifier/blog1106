import { prisma } from "@/prismaClient"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { cache } from "react"

const getUser = cache(async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    return user
})

const getArticles = cache(async () => {
    const articles = await prisma.article.findMany({
        where: {
            OR: [
                {
                    User: {
                        // followedBy: user.id
                    }
                }
            ]
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return articles
})

export default async function Page() {
    const session = await getServerSession()
    if (!session) {
        redirect("/")
    }
    const user = await getUser(session.user?.email!)
    if (!user) {
        return <div>something is wrong.</div>
    }
    const articles = await getArticles()

    return (
        <div>
            Not implemented
        </div>
    )
}