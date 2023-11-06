import { prisma } from "@/prismaClient"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Page() {
    const session = await getServerSession()
    if (!session) {
        redirect("/")
    }
    const user = await prisma.user.findUnique({
        where: {
            email: session.user?.email!
        }
    })
    if (!user) {
        return <div>something is wrong.</div>
    }

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
    return (
        <div>

        </div>
    )
}