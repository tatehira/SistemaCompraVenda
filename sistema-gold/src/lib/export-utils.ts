import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface Transaction {
    id: number
    date: string
    customer_name?: string
    type: 'BUY' | 'SELL'
    gold_name: string
    weight_grams: number
    point_name: string
    price: number
}

interface Summary {
    totalBuy: number
    totalSell: number
    balance: number
    totalBuyWeight: number
    totalSellWeight: number
}

export const exportToCSV = (transactions: Transaction[], filename: string = 'relatorio.csv') => {
    const headers = ['Data', 'Cliente', 'Tipo', 'Item', 'Peso (g)', 'Local', 'Valor (R$)']
    const rows = transactions.map(t => [
        new Date(t.date).toLocaleDateString('pt-BR'),
        t.customer_name || '-',
        t.type === 'BUY' ? 'COMPRA' : 'VENDA',
        t.gold_name,
        t.weight_grams.toString().replace('.', ','),
        t.point_name,
        t.price.toFixed(2).replace('.', ',')
    ])

    const csvContent = [
        headers.join(';'),
        ...rows.map(row => row.join(';'))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export const exportToPDF = (
    transactions: Transaction[],
    summary: Summary,
    dateRange: { start: string, end: string },
    filename: string = 'relatorio.pdf'
) => {
    const doc = new jsPDF()
    const logoUrl = '/logo.png' // Assumes logo is in public folder

    // Load logo image
    const img = new Image()
    img.src = logoUrl
    img.onload = () => {
        // --- Header ---
        // Logo
        doc.addImage(img, 'PNG', 14, 10, 25, 25) // x, y, w, h

        // Title & Info
        doc.setFontSize(22)
        doc.setTextColor(40)
        doc.text('Relatório Financeiro', 196, 20, { align: 'right' })

        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 196, 28, { align: 'right' })
        doc.text(`Período: ${new Date(dateRange.start).toLocaleDateString('pt-BR')} a ${new Date(dateRange.end).toLocaleDateString('pt-BR')}`, 196, 33, { align: 'right' })

        // Line Separator
        doc.setDrawColor(200)
        doc.line(14, 40, 196, 40)

        // --- Summary Section ---
        let yPos = 50
        doc.setFontSize(14)
        doc.setTextColor(0)
        doc.text('Resumo do Período', 14, yPos)

        yPos += 10
        const summaryData = [
            ['Total Compras', `R$ ${summary.totalBuy.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, `${summary.totalBuyWeight.toFixed(2)}g`],
            ['Total Vendas', `R$ ${summary.totalSell.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, `${summary.totalSellWeight.toFixed(2)}g`],
            ['Balanço', `R$ ${summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, `${(summary.totalBuyWeight + summary.totalSellWeight).toFixed(2)}g (Vol)`]
        ]

        autoTable(doc, {
            startY: yPos,
            head: [['Indicador', 'Valor Financeiro', 'Volume (Peso)']],
            body: summaryData,
            theme: 'striped',
            headStyles: { fillColor: [30, 41, 59] }, // Dark slate
            styles: { fontSize: 10, cellPadding: 5 },
            columnStyles: {
                0: { fontStyle: 'bold' },
                1: { halign: 'right' },
                2: { halign: 'right' }
            }
        })

        // --- Detailed Transactions ---
        // @ts-ignore
        yPos = doc.lastAutoTable.finalY + 15

        doc.setFontSize(14)
        doc.text('Detalhamento de Transações', 14, yPos)
        yPos += 5

        const tableRows = transactions.map(t => [
            new Date(t.date).toLocaleDateString('pt-BR'),
            t.customer_name || '-',
            t.type === 'BUY' ? 'COMPRA' : 'VENDA',
            `${t.gold_name} (${t.weight_grams}g)`,
            t.point_name,
            `R$ ${t.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        ])

        autoTable(doc, {
            startY: yPos,
            head: [['Data', 'Cliente', 'Tipo', 'Item', 'Local', 'Valor']],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [30, 41, 59] },
            styles: { fontSize: 8, cellPadding: 3 },
            columnStyles: {
                5: { halign: 'right' }
            },
            didParseCell: (data) => {
                // Colorize Buy/Sell
                if (data.section === 'body' && data.column.index === 2) {
                    const text = data.cell.raw as string
                    if (text === 'COMPRA') {
                        data.cell.styles.textColor = [59, 130, 246] // Blue
                    } else {
                        data.cell.styles.textColor = [16, 185, 129] // Emerald
                    }
                }
            }
        })

        // Footer (Page Numbers)
        const pageCount = doc.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(8)
            doc.setTextColor(150)
            doc.text(`Página ${i} de ${pageCount} - Gold System`, 105, 290, { align: 'center' })
        }

        doc.save(filename)
    }
    img.onerror = () => {
        // Fallback if logo fails (shouldn't happen if local, but good safety)
        doc.save(filename)
    }
}
