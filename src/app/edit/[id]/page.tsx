import { prisma } from "@/prismaClient"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Page({ params: { id } }: { params: { id: string } }) {
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

    const article = await prisma.article.findUnique({
        where: {
            id: id,
        },
        include: {
            tags: true,
        }
    })
    if (!article || article.userId !== user.id) {
        return <div>Invalid Access</div>
    }

    async function update(formData: FormData) {
        'use server'
        const title = formData.get("title") as string
        const rawTags: string[] = (formData.get("tags") as string).toLowerCase().split(",").map(s => s.trim()).filter(s => s !== "")
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
        const content = formData.get("content") as string
        await prisma.article.update({
            where: {
                id: id,
            },
            data: {
                title: title,
                content: content,
                tags: {
                    set: [],
                    connect: tags,
                }
            }
        })
        redirect(`/article/${id}`)
    }
    return (
        <div className="h-full py-8">
            <form action={update} className="h-full grid grid-rows-[auto_auto_1fr_auto] place-items-center">
                <div className="grid w-full">
                    <label htmlFor="title" className="w-full text-center text-2xl font-bold my-2">タイトル</label>
                    <input defaultValue={article.title} name="title" type="text" className="w-full border font-semibold text-xl p-4 focus:outline-none rounded-2xl" />
                </div>
                <div className="grid w-full">
                    <label htmlFor="tags" className="w-full text-center text-xl font-semibold my-2">タグ</label>
                    <input defaultValue={article.tags.map(tag => tag.name).join(",")} type="text" name="tags" id="tags" className="w-full border text-lg p-2 focus:outline-none rounded-2xl" />
                </div>
                <div className="grid w-full h-full grid-rows-[auto_1fr] text-center">
                    <label htmlFor="content" className="w-full my-4 font-bold text-2xl">本文</label>
                    <textarea defaultValue={article.content} name="content" id="content" className="text-lg w-full h-full border focus:outline-none p-4 rounded-2xl resize-none"></textarea>
                </div>
                <button type="submit" className="mt-4 py-4 text-xl w-full hover:bg-green-200 rounded-2xl transition-all">投稿</button>
            </form>
        </div>
    )
}