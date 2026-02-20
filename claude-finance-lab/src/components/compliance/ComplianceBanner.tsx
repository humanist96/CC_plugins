"use client"

import { AlertTriangle } from "lucide-react"

export function ComplianceBanner() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs">
      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-amber-400">투자 자문 안내</p>
        <p className="text-amber-200/80 mt-0.5">
          본 응답은 투자 자문이 아닌 정보 제공 및 교육 목적입니다.
          투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.
        </p>
      </div>
    </div>
  )
}
