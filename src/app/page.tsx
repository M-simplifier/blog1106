import { Article, User } from "@prisma/client";
import Link from "next/link";
import { SVGProps } from "react"
import { prisma } from "@/prismaClient";
import { formatDate } from "@/utils/utils";


export default async function Home() {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const pickups = await prisma.article.findMany({
    where: {
      createdAt: {
        gte: oneWeekAgo,
      },
    },
    include: {
      _count: {
        select: {
          hearts: true,
        }
      },
      User: true,
    },
    orderBy: [
      {
        hearts: {
          _count: "desc"
        },
      },
      {
        createdAt: "desc"
      }
    ],
    take: 6,
  });

  const news = await prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          hearts: true,
        }
      },
      User: true,
    },
    take: 6,
  })

  return (
    <div>
      <h2 className="text-5xl font-semibold my-6">PickUp!</h2>
      <div className="grid grid-cols-2">
        {pickups.map(article => <Article key={article.id} article={article}></Article>)}
      </div>
      <h2 className="text-5xl font-semibold my-6">New</h2>
      <div className="grid grid-cols-2">
        {news.map(article => <Article key={article.id} article={article}></Article>)}
      </div>
    </div>
  )
}

async function Article({ article }: { article: Article & { User: User, _count: { hearts: number } } }) {
  return (
    <Link href={`/article/${article.id}`}>
      <div className="grid grid-rows-3 m-6">
        <div>
          <h1 className="text-2xl">{article.title.length > 17 ? article.title.substring(0, 17) + "..." : article.title}</h1>
        </div>
        <div>
          <p className="text-right">{article.User.name}</p>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex">
            <HeartIcon className="h-full grid place-items-center"></HeartIcon>
            <p className="grid place-items-center">{article._count.hearts}</p>
          </div>
          <p className="text-right">{formatDate(article.createdAt)}</p>
        </div>
      </div>
    </Link>

  )
}


function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"></path></svg>
  )
}