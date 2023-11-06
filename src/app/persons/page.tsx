import { prisma } from "@/prismaClient"
import { Tag, User } from "@prisma/client"
import TagComponent from "@/components/Tag"
import Link from "next/link"

export default async function Page() {
    const users = await prisma.user.findMany({
        include: {
            tags: true,
        }
    })

    return (
        <div className="h-full border">
            <div className="flex h-1/4">
                {users.map(user => <UserProfile key={user.id} user={user}></UserProfile>)}
            </div>
        </div>
    )
}

function UserProfile({ user }: { user: User & { tags: Tag[] } }) {
    return (
        <Link href={`/person/${user.id}`} className="grid w-1/4 grid-rows-[auto_1fr_auto] border">
            <h2 className="text-2xl font-semibold text-center">{user.name}</h2>
            <p>{user.shortPhrase}</p>
            <div className="flex overflow-x-scroll">
                {user.tags.map(tag => <TagComponent key={tag.id} tag={tag}></TagComponent>)}
            </div>
        </Link>
    )
}