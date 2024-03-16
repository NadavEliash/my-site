import Link from "next/link";
import { Source_Code_Pro } from "next/font/google";

const sourceCode = Source_Code_Pro({ subsets: ['latin'] })

export default function Home() {
  const pages = [
    {
      href: 'about',
      icon: '',
      title: 'about'
    },
    {
      href: 'portfolio',
      icon: '',
      title: 'portfolio'
    },
    {
      href: 'animate',
      icon: '',
      title: 'animate online'
    },
    {
      href: 'remove-bg',
      icon: '',
      title: 'remove bg'
    },
  ]

  const colors = {
    blue: "text-blue-400",
    lightBlue: "text-sky-300",
    pink: "text-pink-300",
    yellow: "text-yellow-400",
    white: "text-yellow-100",
  }

  return (
    <main className={sourceCode.className}>
      <h1 className="text-5xl px-10 text-blue-500 my-20">Welcome<span className={colors.white}>.to</span>
      <span className={colors.yellow}>{`(`}</span>
      <span className={colors.lightBlue}>my_website</span>
      <span className={colors.yellow}>{`)`}</span>
      </h1>
      <div className="mx-40 w-fit p-6 bg-black/40 rounded-lg border-2 border-white text-lg" >
        <span className={colors.pink}>{'Hi there. '}</span>
        <span className={colors.blue}>{'Welcome to my '}</span>
        <span className={colors.white}>{'Home'}</span>
        <span className={colors.yellow}>{'()'}</span>
        <br />
        <br />
        <span className={colors.lightBlue}>{'I am a '}</span>
        <span className={colors.blue}>{'<Web_Developer>'}</span>
        <br />
        <span className="pl-10 text-white">&&</span>
        <span className={colors.blue}>{' <Designer> '}</span>
        <br />
        <span className="pl-10 text-white">&&</span>
        <span className={colors.blue}>{' <Animator>'}</span>
        <nav className="mt-3 flex flex-col gap-2 text-base text-emerald-300">
          {pages.map(page =>
            <div key={page.href} >
              <Link href={page.href}>{`<${page.title}>`}</Link>
              <br/>
              <Link href={page.href}>{`</${page.title}>`}</Link>
            </div>
          )}
        </nav>
      </div>
    </main>
  );
}