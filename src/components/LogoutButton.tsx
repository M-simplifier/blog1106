'use client'

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <form action={() => signOut()}>
            <button className="hover:bg-red-300 transition-all p-4 border">LOGOUT</button>
        </form>
    )
}