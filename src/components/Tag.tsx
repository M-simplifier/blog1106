import { Tag } from "@prisma/client";
import Link from "next/link";

export default function Tag({ tag }: { tag: Tag }) {
    return (
        <Link href={`/tag/${tag.id}`} className="p-1 bg-gray-200 rounded-lg mr-2 whitespace-nowrap">
            {tag.name}
        </Link>
    )
}