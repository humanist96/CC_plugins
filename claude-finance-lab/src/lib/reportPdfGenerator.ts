/** html2canvas + jspdf A4 multi-page PDF generator */

export async function generateReportPdf(
  element: HTMLElement,
  fileName: string
): Promise<void> {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ])

  const A4_WIDTH_MM = 210
  const A4_HEIGHT_MM = 297
  const CAPTURE_WIDTH_PX = 794

  element.style.width = `${CAPTURE_WIDTH_PX}px`

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    windowWidth: CAPTURE_WIDTH_PX,
    useCORS: true,
    logging: false,
  })

  const imgData = canvas.toDataURL("image/jpeg", 0.95)
  const imgWidthMm = A4_WIDTH_MM
  const imgHeightMm = (canvas.height * A4_WIDTH_MM) / canvas.width
  const pageHeightMm = A4_HEIGHT_MM

  const pdf = new jsPDF("p", "mm", "a4")
  let yOffset = 0

  while (yOffset < imgHeightMm) {
    if (yOffset > 0) {
      pdf.addPage()
    }

    pdf.addImage(imgData, "JPEG", 0, -yOffset, imgWidthMm, imgHeightMm)
    yOffset += pageHeightMm
  }

  pdf.save(fileName)
}
