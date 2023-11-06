import { prisma } from "@/prismaClient"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Home() {
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

    async function create(formData: FormData) {
        'use server'
        const title: string = formData.get("title") as string
        const rawTags: string[] = (formData.get("tags") as string).toLowerCase().split(",").map(s => s.trim())
        const tags = await Promise.all(rawTags.map(async rawTag => {
            let tag = await prisma.tag.findFirst({
                where: {
                    name: rawTag,
                }
            })
            if (!tag) {
                tag = await prisma.tag.create({
                    data: {
                        name: rawTag,
                    }
                })
            }
            return tag
        }))
        const content: string = formData.get("content") as string
        const article = await prisma.article.create({
            data: {
                title: title,
                content: content,
                User: {
                    connect: {
                        id: user?.id!,
                    }
                },
                tags: {
                    connect: tags
                }
            }
        })
        redirect(`/article/${article.id}`)
    }
    return (
        <div className="h-full py-8">
            <form action={create} className="h-full grid grid-rows-[auto_auto_1fr_auto] place-items-center">
                <div className="grid w-full">
                    <label htmlFor="title" className="w-full text-center text-2xl font-bold my-2">タイトル</label>
                    <input name="title" type="text" className="w-full border font-semibold text-xl p-4 focus:outline-none rounded-2xl" />
                </div>
                <div className="grid w-full">
                    <label htmlFor="tags" className="w-full text-center text-xl font-semibold my-2">タグ</label>
                    <input type="text" name="tags" id="tags" className="w-full border text-lg p-2 focus:outline-none rounded-2xl" />
                </div>
                <div className="grid w-full h-full grid-rows-[auto_1fr] text-center">
                    <label htmlFor="content" className="w-full my-4 font-bold text-2xl">本文</label>
                    <textarea name="content" id="content" className="text-lg w-full h-full border focus:outline-none p-4 rounded-2xl resize-none"></textarea>
                </div>
                <button type="submit" className="mt-4 py-4 text-xl w-full hover:bg-green-200 rounded-2xl transition-all">投稿</button>
            </form>
        </div>
    )
}