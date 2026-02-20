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

interface ValidationErrors {
  ticker?: string
  name?: string
  quantity?: string
  avgPrice?: string
}

function validate(fields: { ticker: string; name: string; quantity: string; avgPrice: string; region: "KR" | "US" }): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!fields.ticker.trim()) {
    errors.ticker = "티커를 입력해주세요"
  } else if (fields.region === "US" && !/^[A-Za-z]{1,5}$/.test(fields.ticker.trim())) {
    errors.ticker = "US 티커는 1~5자의 영문자여야 합니다"
  } else if (fields.region === "KR" && !/^\d{6}$/.test(fields.ticker.trim())) {
    errors.ticker = "KR 종목코드는 6자리 숫자여야 합니다"
  }

  if (!fields.name.trim()) {
    errors.name = "종목명을 입력해주세요"
  }

  const qty = Number(fields.quantity)
  if (!fields.quantity) {
    errors.quantity = "수량을 입력해주세요"
  } else if (!Number.isFinite(qty) || qty <= 0) {
    errors.quantity = "1 이상의 숫자를 입력해주세요"
  } else if (!Number.isInteger(qty)) {
    errors.quantity = "정수를 입력해주세요"
  }

  const price = Number(fields.avgPrice)
  if (!fields.avgPrice) {
    errors.avgPrice = "매입 단가를 입력해주세요"
  } else if (!Number.isFinite(price) || price <= 0) {
    errors.avgPrice = "0보다 큰 금액을 입력해주세요"
  }

  return errors
}

export function AddPositionModal({ isOpen, onClose, onAdd }: AddPositionModalProps) {
  const [ticker, setTicker] = useState("")
  const [name, setName] = useState("")
  const [region, setRegion] = useState<"KR" | "US">("US")
  const [quantity, setQuantity] = useState("")
  const [avgPrice, setAvgPrice] = useState("")
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const markTouched = useCallback((field: string) => {
    setTouched((prev) => new Set(prev).add(field))
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      const validationErrors = validate({ ticker, name, quantity, avgPrice, region })
      setErrors(validationErrors)
      setTouched(new Set(["ticker", "name", "quantity", "avgPrice"]))

      if (Object.keys(validationErrors).length > 0) return

      onAdd({
        ticker: ticker.trim().toUpperCase(),
        name: name.trim(),
        region,
        quantity: Number(quantity),
        avgPrice: Number(avgPrice),
      })

      setTicker("")
      setName("")
      setQuantity("")
      setAvgPrice("")
      setErrors({})
      setTouched(new Set())
      onClose()
    },
    [ticker, name, region, quantity, avgPrice, onAdd, onClose]
  )

  const handleBlur = useCallback(
    (field: string) => {
      markTouched(field)
      const validationErrors = validate({ ticker, name, quantity, avgPrice, region })
      setErrors(validationErrors)
    },
    [ticker, name, quantity, avgPrice, region, markTouched]
  )

  if (!isOpen) return null

  const inputClass = (field: keyof ValidationErrors) =>
    `w-full px-3 py-2 rounded-lg bg-muted border text-sm focus:outline-none focus:ring-2 ${
      touched.has(field) && errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-border focus:ring-primary"
    }`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              종목 추가
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8" aria-label="닫기">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                onBlur={() => handleBlur("ticker")}
                placeholder={region === "US" ? "예: AAPL" : "예: 005930"}
                className={inputClass("ticker")}
              />
              {touched.has("ticker") && errors.ticker && (
                <p className="text-xs text-red-400 mt-1">{errors.ticker}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">종목명</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="예: Apple Inc."
                className={inputClass("name")}
              />
              {touched.has("name") && errors.name && (
                <p className="text-xs text-red-400 mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">수량</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  onBlur={() => handleBlur("quantity")}
                  placeholder="0"
                  min="1"
                  className={inputClass("quantity")}
                />
                {touched.has("quantity") && errors.quantity && (
                  <p className="text-xs text-red-400 mt-1">{errors.quantity}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  매입 단가 {region === "KR" ? "(원)" : "(USD)"}
                </label>
                <input
                  type="number"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(e.target.value)}
                  onBlur={() => handleBlur("avgPrice")}
                  placeholder="0"
                  min="0"
                  step={region === "KR" ? "1" : "0.01"}
                  className={inputClass("avgPrice")}
                />
                {touched.has("avgPrice") && errors.avgPrice && (
                  <p className="text-xs text-red-400 mt-1">{errors.avgPrice}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              추가
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
