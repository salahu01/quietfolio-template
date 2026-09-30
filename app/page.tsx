import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import TechStack from "@/components/TechStack";
import GitHubActivity from "@/components/GitHubActivity";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";
import { personJsonLd, websiteJsonLd, PERSON_ID } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { profile } from "@/lib/data";

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            websiteJsonLd(),
            personJsonLd(),
            { "@type": "ProfilePage", "@id": `${SITE_URL}/#profilepage`, url: SITE_URL, name: profile.name, mainEntity: { "@id": PERSON_ID }, isPartOf: { "@id": `${SITE_URL}/#website` } },
          ],
        }}
      />
      <main id="main" className="rail">
        <Hero />
        <div className="stripe" />
        <About />
        <div className="stripe" />
        <Projects />
        <div className="stripe" />
        <Experience />
        <div className="stripe" />
        <TechStack />
        <div className="stripe" />
        <GitHubActivity />
        <div className="stripe" />
        <Contact />
      </main>
    </>
  );
}
