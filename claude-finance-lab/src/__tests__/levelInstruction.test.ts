import { describe, it, expect } from "vitest"
import { getLevelInstruction } from "@/lib/levelInstruction"

describe("levelInstruction", () => {
  it("beginner 레벨 지시문 반환", () => {
    const result = getLevelInstruction("beginner")
    expect(result).not.toBeNull()
    expect(result).toContain("beginner")
    expect(result).toContain("초보")
  })

  it("intermediate 레벨 지시문 반환", () => {
    const result = getLevelInstruction("intermediate")
    expect(result).not.toBeNull()
    expect(result).toContain("intermediate")
    expect(result).toContain("중급")
  })

  it("advanced 레벨 지시문 반환", () => {
    const result = getLevelInstruction("advanced")
    expect(result).not.toBeNull()
    expect(result).toContain("advanced")
    expect(result).toContain("고급")
  })

  it("알 수 없는 레벨 → null", () => {
    expect(getLevelInstruction("unknown")).toBeNull()
    expect(getLevelInstruction("")).toBeNull()
  })
})
