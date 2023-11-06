'use client'

import { signIn } from "next-auth/react"

export default function LoginButton() {
    return <button className="hover:bg-green-300 transition-all p-4 border text-center" onClick={() => signIn()}>LOGIN</button>

}
