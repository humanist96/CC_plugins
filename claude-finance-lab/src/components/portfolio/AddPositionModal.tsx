"use client"

import { useState, useCallback } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface AddPositionModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onAdd: (data: { ticker: string; name: string; region: "KR" | "US"; quantity: number; avgPrice: number }) => void
}

export function AddPositionModal({ isOpen, onClose, onAdd }: AddPositionModalProps) {
  const [ticker, setTicker] = useState("")
  const [name, setName] = useState("")
  const [region, setRegion] = useState<"KR" | "US">("US")
  const [quantity, setQuantity] = useState("")
  const [avgPrice, setAvgPrice] = useState("")

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const qty = Number(quantity)
      const price = Number(avgPrice)
      if (!ticker.trim() || !name.trim() || qty <= 0 || price <= 0) return

      onAdd({
        ticker: ticker.trim().toUpperCase(),
        name: name.trim(),
        region,
        quantity: qty,
        avgPrice: price,
      })

      setTicker("")
      setName("")
      setQuantity("")
      setAvgPrice("")
      onClose()
    },
    [ticker, name, region, quantity, avgPrice, onAdd, onClose]
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              종목 추가
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRegion("US")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  region === "US" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                US
              </button>
              <button
                type="button"
                onClick={() => setRegion("KR")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  region === "KR" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                KR
              </button>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">티커</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder={region === "US" ? "예: AAPL" : "예: 005930"}
                className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">종목명</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: Apple Inc."
                className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">수량</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  min="1"
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">매입 단가</label>
                <input
                  type="number"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={!ticker || !name || !quantity || !avgPrice}>
              <Plus className="h-4 w-4" />
              추가
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
