"use client"

import { useEffect } from "react"

export default function HideV0Badge() {
  useEffect(() => {
    const selectors = [
      '[data-v0-badge]',
      '#v0-badge',
      '[data-testid="v0-badge"]',
      '[aria-label="Built with v0"]',
      '.v0-badge',
      '[data-v0-devtools]',
    ]
    const removeBadge = () => {
      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          if (el && el.parentElement) el.parentElement.removeChild(el)
          else if (el instanceof HTMLElement) {
            el.style.display = "none"
            el.style.visibility = "hidden"
          }
        })
      })
    }
    removeBadge()
    const mo = new MutationObserver(removeBadge)
    mo.observe(document.documentElement, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [])
  return null
}
