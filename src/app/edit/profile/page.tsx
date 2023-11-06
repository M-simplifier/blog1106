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
        },
        include: {
            tags: true
        }
    })
    if (!user) {
        return <div>something is wrong.</div>
    }

    async function handler(formData: FormData) {
        'use server'
        const name = formData.get("name") as string
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
        const profile = formData.get("profile") as string
        await prisma.user.update({
            where: {
                id: user?.id
            },
            data: {
                name: name,
                tags: {
                    set: [],
                    connect: tags
                },
                profile: profile
            }
        })
        redirect(`/person/${user?.id}`)
    }
    return (
        <form action={handler} className="h-full py-4 grid grid-rows-[auto_auto_1fr_auto] text-center">
            <div className="grid w-full">
                <label htmlFor="name" className="w-full text-center text-2xl font-bold my-2">ユーザー名</label>
                <input defaultValue={user.name} type="text" name="name" id="name" className="w-full border font-semibold text-xl p-4 focus:outline-none rounded-2xl" />
            </div>
            <div className="grid w-full">
                <label htmlFor="tags" className="w-full text-center text-xl font-semibold my-2">タグ</label>
                <input defaultValue={user.tags.map(tag => tag.name)} type="text" id="tags" name="tags" className="w-full border text-lg p-2 focus:outline-none rounded-2xl" />
            </div>
            <div className="grid w-full h-full grid-rows-[auto_1fr] text-center">
                <label htmlFor="profile" className="w-full my-4 font-bold text-2xl">プロフィール</label>
                <textarea defaultValue={user.profile} name="profile" id="profile" className="text-lg w-full h-full border focus:outline-none p-4 rounded-2xl resize-none"></textarea>
            </div>
            <button type="submit" className="mt-4 py-4 text-xl w-full hover:bg-green-200 rounded-2xl transition-all">更新</button>
        </form>
    )
}
