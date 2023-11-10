import { prisma } from "@/prismaClient"
import { formatDate } from "@/utils/utils"
import { Article, User } from "@prisma/client"
import Link from "next/link"
import { SVGProps, cache } from "react"

const getTag = cache(async (id: string) => {
    const tag = await prisma.tag.findUnique({
        where: {
            id: id,
        },
        include: {
            articles: {
                include: {
                    User: true,
                    _count: {
                        select: {
                            hearts: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            },
        }
    })
    return tag
})

export default async function Page({ params: { id } }: { params: { id: string } }) {
    const tag = await getTag(id)

    if (!tag) {
        return <p>Page was not found.</p>
    }

    const articles = tag.articles

    return (
        <div>
            <h2 className="font-semibold text-4xl my-6">{tag.name}</h2>
            {articles.map(article => <Article key={article.id} article={article}></Article>)}
        </div>
    )
}

function Article({ article }: { article: Article & { User: User, _count: { hearts: number } } }) {
    return (
        <Link href={`/article/${article.id}`} className="grid my-4">
            <h3 className="text-2xl">{article.title}</h3>
            <div className="flex text-lg text-gray-500">
                <Link href={`/person/${article.User.id}`}>
                    <p className="mr-4 border-2 rounded-full px-2">{article.User.name}</p>
                </Link>
                <div className="flex">
                    <HeartIcon className="h-full grid place-items-center"></HeartIcon>
                    <p className="grid place-items-center">{article._count.hearts}</p>
                </div>
            </div>
            <div className="text-gray-600 flex mb-2">
                <p className="mr-4">post: {formatDate(article.createdAt)}</p>
                <p>edit: {formatDate(article.updatedAt)}</p>
            </div>
        </Link>
    )
}

function HeartIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"></path></svg>
    )
}