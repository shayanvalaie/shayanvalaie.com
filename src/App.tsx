import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import TechMarquee from './components/TechMarquee'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <TechMarquee />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
