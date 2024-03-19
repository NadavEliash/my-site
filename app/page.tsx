import Link from "next/link";
import localFont from "next/font/local"

const menlo = localFont({src: '../Menlo-Regular.ttf'})

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

export default function Home() {

  return (
    <main className={`${menlo.className}`}>
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
        <span className={colors.blue}>{'My_skills'}</span>
        <span className={colors.white}>{' = '}</span>
        <span className={colors.yellow}>{'['}</span>
        <br />
        <span className={`ml-8 ${colors.lightBlue}`}>{'Web_Development'}</span>
        <span className={colors.white}>{','}</span>
        <br />
        <span className={`ml-8 ${colors.lightBlue}`}>{'Designe'}</span>
        <span className={colors.white}>{','}</span>
        <br />
        <span className={`ml-8 ${colors.lightBlue}`}>{'Animation'}</span>
        <br />
        <span className={colors.yellow}>{']'}</span>
        <nav className="mt-3 flex flex-col gap-2 text-base text-emerald-300">
          {pages.map(page =>
            <div key={page.href} >
              <Link href={page.href}>{`<${page.title} />`}</Link>
            </div>
          )}
        </nav>
      </div>
    </main>
  );
}