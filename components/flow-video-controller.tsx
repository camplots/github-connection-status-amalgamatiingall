"use client"

import { useEffect } from "react"

export function FlowVideoController() {
  useEffect(() => {
    const video = document.getElementById("flow-video") as HTMLVideoElement | null
    const button = document.getElementById("flow-toggle") as HTMLButtonElement | null
    if (!video || !button) return

    const label = button.querySelector(".flow-toggle-text")
    let userPaused = false

    const sync = () => {
      const playing = !video.paused
      button.classList.toggle("is-playing", playing)
      button.setAttribute("aria-label", playing ? "Pause video" : "Play video")
      if (label) label.textContent = playing ? "Pause" : "Play"
    }

    const play = () => {
      video.muted = true
      video.play().catch(sync)
    }

    const onClick = () => {
      if (video.paused) {
        userPaused = false
        play()
      } else {
        userPaused = true
        video.pause()
      }
    }

    button.addEventListener("click", onClick)
    video.addEventListener("play", sync)
    video.addEventListener("pause", sync)

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let observer: IntersectionObserver | undefined

    if (!reduceMotion && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              if (video.paused && !userPaused) play()
            } else if (!video.paused) {
              video.pause()
            }
          }
        },
        { threshold: 0.4 },
      )
      observer.observe(video)
    }

    sync()

    return () => {
      button.removeEventListener("click", onClick)
      video.removeEventListener("play", sync)
      video.removeEventListener("pause", sync)
      observer?.disconnect()
    }
  }, [])

  return null
}
