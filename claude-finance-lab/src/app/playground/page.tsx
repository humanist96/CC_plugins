"use client"

import { useState, useCallback, useMemo, useRef } from "react"
import dynamic from "next/dynamic"
import { Send, Terminal, Trash2, Bot, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ClaudeTerminal } from "@/components/terminal/ClaudeTerminal"
import { DartDataPanel } from "@/components/analysis/DartDataPanel"
import { ReportDataPanel } from "@/components/report/ReportDataPanel"
import { detectKoreanCompany } from "@/lib/dartCompanyDetector"
import { resolveCompany } from "@/lib/reportCompanyResolver"

const ReportPdfView = dynamic(
  () => import("@/components/report/ReportPdfView").then((m) => m.ReportPdfView),
  { ssr: false }
)

const claudeSuggestedCommands = [
  "/report 삼성전자",
  "/report AAPL",
  "/dart:재무제표 SK하이닉스",
  "/dart:공시 카카오",
  "삼성전자 최근 실적 분석해줘",
  "AAPL 최근 실적 요약해줘",
  "반도체 업종 전망 분석해줘",
]

export default function PlaygroundPage() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [currentCommand, setCurrentCommand] = useState<string | null>(null)
  const [commandId, setCommandId] = useState(0)
  const [reportText, setReportText] = useState<string | null>(null)
  const [isPdfReady, setIsPdfReady] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const pdfViewRef = useRef<HTMLDivElement>(null)

  const reportCompany = useMemo(() => {
    if (!currentCommand) return null
    const match = currentCommand.trim().match(/^\/report\s+(.+)$/i)
    if (!match) return null
    return resolveCompany(match[1].trim())
  }, [currentCommand])

  const detectedCompany = useMemo(() => {
    if (!currentCommand || reportCompany) return null
    return detectKoreanCompany(currentCommand)
  }, [currentCommand, reportCompany])

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return

    setHistory((prev) => [trimmed, ...prev].slice(0, 20))
    setInput("")
    setCommandId((prev) => prev + 1)
    setCurrentCommand(trimmed)
    setReportText(null)
    setIsPdfReady(false)
  }, [input])

  const handleReportComplete = useCallback(
    (text: string) => {
      if (reportCompany) {
        setReportText(text)
      }
    },
    [reportCompany]
  )

  const handlePdfDownload = useCallback(async () => {
    if (!pdfViewRef.current || !reportCompany) return

    setIsGeneratingPdf(true)
    try {
      const { generateReportPdf } = await import("@/lib/reportPdfGenerator")
      const date = new Date().toISOString().slice(0, 10)
      const name = reportCompany.displayName.replace(/[^a-zA-Z0-9가-힣]/g, "_")
      await generateReportPdf(pdfViewRef.current, `${name}_리포트_${date}.pdf`)
    } catch (error) {
      const message = error instanceof Error ? error.message : "PDF 생성 실패"
      alert(message)
    } finally {
      setIsGeneratingPdf(false)
    }
  }, [reportCompany])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Playground</h1>
        </div>
        <p className="text-muted-foreground">
          Claude AI에게 자유롭게 금융 관련 질문을 할 수 있습니다
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
        <Bot className="h-5 w-5 text-purple-400 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-purple-400 mb-1">Claude 모드 안내</p>
          <p className="text-muted-foreground">
            로컬 Claude Code CLI를 통해 AI가 직접 응답합니다.
            금융 분석, 시장 전망, 업무 지원 등 자유롭게 질문하세요.
            별도 API Key 없이 Claude Code 인증을 그대로 사용합니다.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Input */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">질문 입력</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                placeholder="Claude에게 질문하세요... (예: /report 삼성전자, /dart:재무제표 SK하이닉스)"
                className="w-full min-h-[80px] px-4 py-3 rounded-md bg-muted border border-border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex justify-end mt-3">
                <Button onClick={handleSubmit} disabled={!input.trim()} className="gap-1">
                  <Send className="h-4 w-4" />
                  실행
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          {currentCommand && (
            <>
              <ClaudeTerminal
                key={`claude-${commandId}`}
                command={currentCommand}
                onComplete={handleReportComplete}
              />

              {reportText && reportCompany && (
                <div className="flex justify-end">
                  <Button
                    onClick={handlePdfDownload}
                    disabled={!isPdfReady || isGeneratingPdf}
                    variant="outline"
                    className="gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    {isGeneratingPdf ? "PDF 생성 중..." : "PDF 다운로드"}
                  </Button>
                </div>
              )}

              {reportCompany ? (
                <ReportDataPanel
                  key={`report-${commandId}`}
                  region={reportCompany.region}
                  corpCode={reportCompany.corpCode}
                  corpName={reportCompany.displayName}
                  ticker={reportCompany.ticker}
                />
              ) : detectedCompany ? (
                <DartDataPanel
                  key={`dart-${commandId}`}
                  corpCode={detectedCompany.result.corp_code}
                  corpName={detectedCompany.result.corp_name}
                />
              ) : null}
            </>
          )}

          {reportText && reportCompany && (
            <ReportPdfView
              ref={pdfViewRef}
              reportText={reportText}
              reportCompany={reportCompany}
              onDataReady={() => setIsPdfReady(true)}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested Commands */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">추천 질문</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {claudeSuggestedCommands.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => setInput(cmd)}
                    className="w-full text-left px-2 py-1.5 rounded text-xs font-mono hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* History */}
          {history.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">최근 실행</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setHistory([])}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {history.map((cmd, i) => (
                    <button
                      key={`${cmd}-${i}`}
                      onClick={() => setInput(cmd)}
                      className="w-full text-left px-2 py-1.5 rounded text-xs font-mono hover:bg-muted transition-colors text-muted-foreground hover:text-foreground truncate"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
