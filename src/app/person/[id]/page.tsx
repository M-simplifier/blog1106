import Markdown from "@/components/Markdown"
import Tag from "@/components/Tag"
import { prisma } from "@/prismaClient"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { SVGProps, cache } from "react"

const getUser = cache(async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    return user
})

const getPerson = cache(async (id: string) => {
    const person = await prisma.user.findUnique({
        where: {
            id: id
        },
        include: {
            tags: true,
        }
    })
    return person
})

export default async function Page({ params: { id } }: { params: { id: string } }) {
    const session = await getServerSession()
    const user = session ?
        await getUser(session.user?.email!)
        :
        null

    const person = await getPerson(id)
    if (!person) {
        return <div>Page was not found.</div>
    }

    const isMyprofile = user && user.id === person.id

    return (
        <div className="py-4">
            <div className="grid grid-cols-[1fr_auto] text-4xl mb-4">
                <h2 className="font-semibold">{person.name}</h2>
                {isMyprofile ?
                    <Link href="/edit/profile">
                        <EditIcon></EditIcon>
                    </Link>
                    :
                    <></>
                }
            </div>
            <div>
                {person.tags.map(tag => <Tag key={tag.id} tag={tag}></Tag>)}
            </div>
            <Markdown>{person.profile}</Markdown>
        </div>
    )
}
function EditIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h4v-1.9l10-10V8l-6-6H6m7 1.5L18.5 9H13V3.5m7.1 9.5c-.1 0-.3.1-.4.2l-1 1l2.1 2.1l1-1c.2-.2.2-.6 0-.8l-1.3-1.3c-.1-.1-.2-.2-.4-.2m-2 1.8L12 20.9V23h2.1l6.1-6.1l-2.1-2.1Z"></path></svg>
    )
}