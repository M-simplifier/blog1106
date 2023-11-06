import { prisma } from "@/prismaClient";
import { formatDate } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SVGProps } from "react";
import Tag from "@/components/Tag";
import Markdown from "@/components/Markdown";
import { getServerSession } from "next-auth";

export default async function Page({ params: { id } }: { params: { id: string } }) {
    const session = await getServerSession()
    const user = session ?
        await prisma.user.findUnique({
            where: {
                email: session.user?.email!
            },
            include: {
                hearted: {
                    select: {
                        id: true,
                    }
                }
            }
        })
        :
        null

    const article = await prisma.article.findUnique({
        where: {
            id: id,
        },
        include: {
            User: true,
            tags: true,
            _count: {
                select: {
                    hearts: true,
                }
            }
        }
    })

    if (!article) {
        return <h2>Page was not found.</h2>
    }

    async function deleteHandler() {
        'use server'
        await prisma.article.delete({
            where: {
                id: id,
            }
        })
        redirect("/")
    }

    const isHearted = user?.hearted.find(e => e.id === id) !== undefined

    async function hearted() {
        'use server'
        if (!isHearted) {
            await prisma.article.update({
                where: {
                    id: id,
                },
                data: {
                    hearts: {
                        connect: {
                            id: user?.id!
                        }
                    }
                }
            })
        } else {
            await prisma.article.update({
                where: {
                    id: id,
                },
                data: {
                    hearts: {
                        disconnect: {
                            id: user?.id!
                        }
                    }
                }
            })
        }
        revalidatePath("/")
    }

    function HeartButton() {
        return (
            <form action={hearted} className="">
                <button className="text-4xl">
                    {isHearted ?
                        <HeartIcon></HeartIcon>
                        :
                        <OutlineHeartIcon></OutlineHeartIcon>
                    }
                </button>
            </form>
        )
    }

    return (
        <div className="py-4">
            <div className="text-gray-600 flex mb-2">
                <p className="mr-4">post: {formatDate(article.createdAt)}</p>
                <p>edit: {formatDate(article.updatedAt)}</p>
            </div>
            <div className="grid grid-cols-[1fr_auto]">
                <h2 className="text-6xl leading-[4.2rem]">{article.title}</h2>
                {user && user.id === article.User.id ? <EditOrDelete id={id} deleteHandler={deleteHandler}></EditOrDelete> : <></>}
            </div>
            <div className="flex my-4 text-2xl text-gray-500">
                <Link href={`/person/${article.User.id}`}>
                    <p className="mr-4 border-2 rounded-full px-2">{article.User.name}</p>
                </Link>
                <div className="flex">
                    <HeartIcon className="h-full grid place-items-center"></HeartIcon>
                    <p className="grid place-items-center">{article._count.hearts}</p>
                </div>
            </div>
            <div className="flex mb-2">
                {article.tags.map(tag => <Tag key={tag.id} tag={tag}></Tag>)}
            </div>
            <Markdown>{article.content}</Markdown>
            {
                user ?
                    <HeartButton></HeartButton>
                    :
                    <></>
            }
        </div >
    )
}

function EditOrDelete({ id, deleteHandler }: { id: string, deleteHandler: (formData: FormData) => void }) {
    return (
        <div className="grid grid-cols-2 text-6xl">
            <Link href={`/edit/${id}`}><EditIcon></EditIcon></Link>
            <form action={deleteHandler}>
                <button><DeleteIcon></DeleteIcon></button>
            </form>
        </div>
    )
}


function EditIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h4v-1.9l10-10V8l-6-6H6m7 1.5L18.5 9H13V3.5m7.1 9.5c-.1 0-.3.1-.4.2l-1 1l2.1 2.1l1-1c.2-.2.2-.6 0-.8l-1.3-1.3c-.1-.1-.2-.2-.4-.2m-2 1.8L12 20.9V23h2.1l6.1-6.1l-2.1-2.1Z"></path></svg>
    )
}

function DeleteIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z"></path></svg>
    )
}

function OutlineHeartIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"></path></svg>
    )
}

function HeartIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35Z"></path></svg>
    )
}