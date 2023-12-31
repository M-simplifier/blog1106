import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { User } from '@prisma/client'
import LoginButton from '@/components/LoginButton'
import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'
import { SVGProps } from 'react'
import { prisma } from '@/prismaClient'
import { getServerSession } from 'next-auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  const user = session ?
    await prisma.user.findUnique({
      where: {
        email: session.user?.email!,
      }
    })
    :
    null

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='min-h-screen grid grid-cols-[1fr_4fr_1fr] container mx-auto'>
          <Left user={user}></Left>
          <main className='container mx-auto px-6'>{children}</main>
          <Right user={user}></Right>
        </div>
      </body>
    </html>
  )
}

function Left({ user }: { user: User | null }) {
  return (
    <div className='grid place-items-center sticky top-0 h-screen'>
      <div>
        <Link href="/" className='w-3/4 text-6xl'>
          <h1 className='italic font-extrabold'>Tech</h1>
          <h1 className='italic font-extrabold text-right'>Post</h1>
        </Link>
        <p className='text-center font-bold text-xl my-4'>{user ? user.name : <></>}</p>
        <div className='grid grid-cols-2'>
          <LoginButton></LoginButton>
          <LogoutButton></LogoutButton>
        </div>
      </div>
    </div>
  )
}

function Right({ user }: { user: User | null }) {
  return (
    <div className='grid grid-rows-4 place-items-center h-screen sticky top-0'>
      <Link href="/write" className='p-10 text-8xl bg-blue-400 rounded-full grid place-items-center'>
        <FilePlusIcon></FilePlusIcon>
      </Link>
      <Link href="/articles" className='p-10 text-8xl bg-blue-400 rounded-full grid place-items-center'>
        <BookshelfIcon></BookshelfIcon>
      </Link>
      <Link href="/persons" className='p-10 text-8xl bg-blue-400 rounded-full grid place-items-center'>
        <PersonsIcon></PersonsIcon>
      </Link>
      <div className='grid grid-cols-3 place-items-center w-full'>
        <Link href="/settings" className='p-4 text-4xl bg-blue-400 rounded-full grid place-items-center'>
          <SettingIcon></SettingIcon>
        </Link>
        <Link href="/home" className='p-4 text-4xl bg-blue-400 rounded-full grid place-items-center'>
          <HouseIcon></HouseIcon>
        </Link>
        <Link href={`/person/${user?.id}`} className='p-4 text-4xl bg-blue-400 rounded-full grid place-items-center'>
          <MyselfIcon></MyselfIcon>
        </Link>
      </div>
    </div>
  )
}

function FilePlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M14 2H6c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h7.81c-.53-.91-.81-1.95-.81-3c0-3.31 2.69-6 6-6c.34 0 .67.03 1 .08V8l-6-6m-1 7V3.5L18.5 9H13m10 11h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2Z"></path></svg>
  )
}


function BookshelfIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M9 3v15h3V3H9m3 2l4 13l3-1l-4-13l-3 1M5 5v13h3V5H5M3 19v2h18v-2H3Z"></path></svg>
  )
}

function PersonsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z"></path></svg>
  )
}

function SettingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 8a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m-2 12c-.25 0-.46-.18-.5-.42l-.37-2.65c-.63-.25-1.17-.59-1.69-.99l-2.49 1.01c-.22.08-.49 0-.61-.22l-2-3.46a.493.493 0 0 1 .12-.64l2.11-1.66L4.5 12l.07-1l-2.11-1.63a.493.493 0 0 1-.12-.64l2-3.46c.12-.22.39-.31.61-.22l2.49 1c.52-.39 1.06-.73 1.69-.98l.37-2.65c.04-.24.25-.42.5-.42h4c.25 0 .46.18.5.42l.37 2.65c.63.25 1.17.59 1.69.98l2.49-1c.22-.09.49 0 .61.22l2 3.46c.13.22.07.49-.12.64L19.43 11l.07 1l-.07 1l2.11 1.63c.19.15.25.42.12.64l-2 3.46c-.12.22-.39.31-.61.22l-2.49-1c-.52.39-1.06.73-1.69.98l-.37 2.65c-.04.24-.25.42-.5.42h-4m1.25-18l-.37 2.61c-1.2.25-2.26.89-3.03 1.78L5.44 7.35l-.75 1.3L6.8 10.2a5.55 5.55 0 0 0 0 3.6l-2.12 1.56l.75 1.3l2.43-1.04c.77.88 1.82 1.52 3.01 1.76l.37 2.62h1.52l.37-2.61c1.19-.25 2.24-.89 3.01-1.77l2.43 1.04l.75-1.3l-2.12-1.55c.4-1.17.4-2.44 0-3.61l2.11-1.55l-.75-1.3l-2.41 1.04a5.42 5.42 0 0 0-3.03-1.77L12.75 4h-1.5Z"></path></svg>
  )
}


function HouseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5Z"></path></svg>
  )
}

function MyselfIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"></path></svg>
  )
}