import { prisma } from "@/prismaClient"
import { Article, Tag } from "@prisma/client"
import Link from "next/link"

export default async function Page() {
    const tags = await prisma.tag.findMany({
        include: {
            articles: {
                orderBy: {
                    createdAt: 'desc'
                },
                take: 10
            },
        },
    })

    return (
        <div>
            {tags.map(tag => <Tag key={tag.id} tag={tag}></Tag>)}
        </div>
    )
}

function Tag({ tag }: { tag: Tag & { articles: Article[] } }) {
    return (
        <div className="my-4">
            <h2 className="font-semibold text-4xl my-4">
                <Link href={`/tag/${tag.id}`}>
                    {tag.name}
                </Link>
            </h2>
            <div className="flex overflow-x-scroll ">
                {tag.articles.map(article => <Article key={article.id} article={article}></Article>)}
            </div>
        </div>
    )
}

function Article({ article }: { article: Article }) {
    return (
        <Link href={`/article/${article.id}`} className="border p-4 flex-shrink-0">
            <h3 className="text-xl">{article.title}</h3>
        </Link>
    )
}