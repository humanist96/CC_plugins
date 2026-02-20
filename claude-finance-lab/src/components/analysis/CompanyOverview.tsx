"use client"

import { Building2, Globe, Phone, Calendar, MapPin, Briefcase } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { DartCompanyOverview } from "@/types/dart"
import { getCorpClsLabel, formatDate } from "@/lib/dartMapper"

interface CompanyOverviewProps {
  readonly company: DartCompanyOverview
}

export function CompanyOverview({ company }: CompanyOverviewProps) {
  const infoItems = [
    { icon: Briefcase, label: "대표자", value: company.ceo_nm },
    { icon: Building2, label: "시장구분", value: getCorpClsLabel(company.corp_cls) },
    { icon: MapPin, label: "주소", value: company.adres },
    { icon: Calendar, label: "설립일", value: formatDate(company.est_dt) },
    { icon: Phone, label: "전화번호", value: company.phn_no },
    { icon: Globe, label: "홈페이지", value: company.hm_url },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{company.corp_name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {company.corp_name_eng}
              {company.stock_code && (
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {company.stock_code}
                </span>
              )}
            </p>
          </div>
          <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
            {company.induty_code}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {infoItems.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-2 text-sm">
              <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="text-muted-foreground">{label}: </span>
                {label === "홈페이지" && value ? (
                  (() => {
                    try {
                      const parsed = new URL(value.startsWith("http") ? value : `https://${value}`)
                      if (parsed.protocol === "https:" || parsed.protocol === "http:") {
                        return (
                          <a
                            href={parsed.toString()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-all"
                          >
                            {value}
                          </a>
                        )
                      }
                      return <span className="break-all">{value}</span>
                    } catch {
                      return <span className="break-all">{value}</span>
                    }
                  })()
                ) : (
                  <span className="break-all">{value || "-"}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
