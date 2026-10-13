import { readFileSync } from "node:fs"
import path from "node:path"

export default function Home() {
  const source = readFileSync(path.join(process.cwd(), "public", "index.html"), "utf8")
  const styles = source.match(/<style>([\s\S]*?)<\/style>/i)?.[1] ?? ""
  const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? source
  const content = body.replace(/<script[\s\S]*?<\/script>/gi, "")

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  )
}
